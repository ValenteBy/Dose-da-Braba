'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header/Header'
import Image from 'next/image'
import { ApiService } from '@/services/api'
import { OrderResponse } from '@/types'
import './style.css'

interface Notification {
    id: string;
    message: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning';
}

export default function StatusPedido() {
    const router = useRouter()
    const [order, setOrder] = useState<OrderResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [paymentResult, setPaymentResult] = useState<any>(null)
    const [previousStatus, setPreviousStatus] = useState<string>('')
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showNotification, setShowNotification] = useState(false)

    useEffect(() => {
        loadOrderData()
    }, [])

    // UseEffect separado para polling
    useEffect(() => {
        if (!order || order.status === 'ENTREGUE') return

        // Poll para atualizações de status a cada 3 segundos
        const interval = setInterval(() => {
            refreshOrderStatus()
        }, 3000)

        return () => clearInterval(interval)
    }, [order?.id, order?.status])

    const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            message,
            timestamp: new Date().toLocaleTimeString(),
            type
        }
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Manter apenas 5 últimas
        setShowNotification(true)
        
        // Auto-hide após 4 segundos
        setTimeout(() => setShowNotification(false), 4000)
    }

    const loadOrderData = async () => {
        try {
            const storedPaymentResult = sessionStorage.getItem('paymentResult')
            if (storedPaymentResult) {
                const result = JSON.parse(storedPaymentResult)
                setPaymentResult(result)
                
                // Buscar dados atualizados do pedido
                const orderData = await ApiService.getOrder(result.order_id)
                setOrder(orderData)
                setPreviousStatus(orderData.status)
                
                // Notificação inicial
                addNotification('Acompanhe o status do seu pedido em tempo real', 'info')
            } else {
                router.push('/')
            }
        } catch (error) {
            console.error('Erro ao carregar dados do pedido:', error)
            router.push('/')
        } finally {
            setLoading(false)
        }
    }

    const refreshOrderStatus = async () => {
        if (!order) return
        
        try {
            const updatedOrder = await ApiService.getOrder(order.id)
            
            // Verificar se houve mudança de status
            if (order.status !== updatedOrder.status) {
                const statusMessage = getStatusMessage(updatedOrder.status)
                addNotification(statusMessage, 'success')
                setPreviousStatus(order.status)
            }
            
            setOrder(updatedOrder)
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
            // Removido: não mostrar notificação de erro a cada polling
            // addNotification('Erro ao verificar atualizações do pedido', 'warning')
        }
    }

    const getStatusMessage = (status: string): string => {
        switch (status) {
            case 'RECEBIDO':
                return 'Seu pedido foi recebido e está na fila da cozinha'
            case 'EM PREPARO':
            case 'EM_PREPARO':
                return 'Sua bebida está sendo preparada com carinho'
            case 'PRONTO':
                return 'Seu pedido está pronto! Pode vir retirar'
            case 'ENTREGUE':
                return 'Pedido entregue com sucesso! Obrigado!'
            default:
                return 'Status do pedido atualizado'
        }
    }

    const getStatusNumber = (status: string) => {
        switch (status) {
            case 'RECEBIDO': return 1
            case 'EM PREPARO': return 2  // Backend retorna com espaço
            case 'EM_PREPARO': return 2  // Fallback para underscore
            case 'PRONTO': return 3
            case 'ENTREGUE': return 4
            default: return 1
        }
    }

    const statusLabels = [
        "Pedido recebido",
        "Em preparo", 
        "Pedido pronto",
        "Entregue"
    ]

    const handleVoltar = () => {
        router.push('/')
    }

    const handleCancelarPedido = async () => {
        if (!order) return
        
        if (getStatusNumber(order.status) >= 3) {
            addNotification("Pedido não pode ser cancelado", 'warning')
            return
        }

        if (confirm("Tem certeza que deseja cancelar o pedido?")) {
            try {
                await ApiService.cancelOrder(order.id)
                addNotification('Pedido cancelado com sucesso', 'warning')
                router.push('/')
            } catch (error) {
                console.error('Erro ao cancelar pedido:', error)
                addNotification('Erro ao cancelar pedido', 'warning')
            }
        }
    }

    const calculateItemPrice = (item: any) => {
        // Preço base da bebida + addons
        let price = 5.0 // preço base do café
        if (item.base === 'Cha') price = 4.0
        
        // Adicionar preço dos addons
        item.addons.forEach((addon: string) => {
            switch (addon) {
                case 'LeiteDeAveia': price += 2.0; break
                case 'Canela': price += 1.0; break
                case 'SemAcucar': break // sem custo adicional
            }
        })
        
        return price
    }

    if (loading) {
        return <div>Carregando...</div>
    }

    if (!order) {
        return <div>Pedido não encontrado</div>
    }

    const currentStatus = getStatusNumber(order.status)

    return (
        <>
            <Header isClient />
            
            {/* Notificação flutuante */}
            {showNotification && notifications.length > 0 && (
                <div className="notification-overlay">
                    <div className={`notification-popup ${notifications[0].type}`}>
                        <div className="notification-content">
                            <h4>Atualização do Pedido</h4>
                            <p>{notifications[0].message}</p>
                            <small>{notifications[0].timestamp}</small>
                        </div>
                        <button 
                            className="notification-close"
                            onClick={() => setShowNotification(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            
            <div className='status-header'>
                <button className='btn-voltar -branco' onClick={handleVoltar}>
                    <div className='mg-auto'>
                        <Image src='./images/fi-bs-angle-left.svg' alt='' width={25} height={25}></Image>
                    </div>
                </button>
                <h1 className='titulo-status'>Status do pedido #{order.id}</h1>
            </div>
            
            {/* Histórico de notificações */}
            {notifications.length > 0 && (
                <div className='notifications-history'>
                    <h3>Atualizações do Pedido</h3>
                    <div className='notifications-list'>
                        {notifications.slice(0, 3).map((notification) => (
                            <div key={notification.id} className={`notification-item ${notification.type}`}>
                                <span className='notification-time'>{notification.timestamp}</span>
                                <span className='notification-text'>{notification.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className='status-container'>
                <div className='status-tracker'>
                    {statusLabels.map((label, index) => (
                        <div key={index} className='status-step-wrapper'>
                            <div className='status-step'>
                                <div className={`status-circle ${currentStatus >= index + 1 ? 'active' : ''}`}>
                                    {index + 1}
                                </div>
                                {index < statusLabels.length - 1 && (
                                    <div className={`status-line ${currentStatus > index + 1 ? 'active' : ''}`}></div>
                                )}
                            </div>
                            <span className={`status-label ${currentStatus > index + 1 ? 'completed' : currentStatus === index + 1 ? 'current' : ''}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='resumo-container'>
                <h2 className='resumo-titulo'>Resumo do seu pedido</h2>
                
                <div className='itens-lista'>
                    {order.items.map((item, index) => (
                        <div key={index} className='item-pedido'>
                            <div className='item-info'>
                                <h3 className='item-nome'>{item.base}</h3>
                                <div className='item-personalizacoes'>
                                    {item.addons.length > 0 ? (
                                        item.addons.map((addon, idx) => (
                                            <span key={idx} className='personalizacao'>
                                                {addon === 'LeiteDeAveia' ? 'Leite de Aveia' :
                                                 addon === 'Canela' ? 'Canela' :
                                                 addon === 'SemAcucar' ? 'Sem Açúcar' : addon}
                                                {idx < item.addons.length - 1 ? ', ' : ''}
                                            </span>
                                        ))
                                    ) : (
                                        <span className='personalizacao'>Sem personalizações</span>
                                    )}
                                </div>
                            </div>
                            <div className='item-preco'>
                                R$ {calculateItemPrice(item).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className='total-container'>
                    <h3>Total: R$ {order.total_price.toFixed(2)}</h3>
                    {paymentResult && (
                        <div className='payment-info'>
                            <p>Pagamento: {paymentResult.discount_type}</p>
                            <p>Desconto aplicado: R$ {(paymentResult.original_price - paymentResult.final_price).toFixed(2)}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className='acao-container'>
                <button 
                    className='btn-cancelar -preto' 
                    onClick={handleCancelarPedido} 
                    disabled={currentStatus >= 3}
                >
                    {currentStatus >= 3 ? 'Pedido não pode ser cancelado' : 'Cancelar Pedido'}
                </button>
            </div>
        </>
    )
}
