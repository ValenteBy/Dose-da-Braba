'use client'
import Header from '../components/Header/Header'
import Button from '../components/Button/Button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ApiService } from '@/services/api'
import './style.css'

export default function ConfirmarPagamento() {
    const router = useRouter()
    const [metPagamento, setMetPagamento] = useState('')
    const [orderInfo, setOrderInfo] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [paymentResult, setPaymentResult] = useState<any>(null)

    useEffect(() => {
        // Recuperar informações do pedido
        const storedOrderInfo = sessionStorage.getItem('orderInfo')
        if (storedOrderInfo) {
            setOrderInfo(JSON.parse(storedOrderInfo))
        } else {
            // Se não tiver informações do pedido, voltar para a tela de info
            router.push('/TelaInfo')
        }
    }, [router])

    const getPaymentMethodKey = (method: string) => {
        switch (method) {
            case 'Pix': return 'pix'
            case 'Credito': return 'cartao'
            case 'Dinheiro': return 'cartao' // Dinheiro também usa cartão fidelidade
            default: return 'cartao'
        }
    }

    const getDiscountInfo = (method: string) => {
        switch (method) {
            case 'Pix': return { name: 'PIX', discount: 0.05, text: '5% OFF' }
            case 'Credito': return { name: 'Cartão de Crédito', discount: 0, text: 'Sem desconto' }
            case 'Dinheiro': return { name: 'Cartão Fidelidade', discount: 0.10, text: '10% OFF' }
            default: return { name: 'Sem desconto', discount: 0, text: 'Sem desconto' }
        }
    }

    const calculateTotal = () => {
        if (!orderInfo) return { subtotal: 0, discount: 0, total: 0 }
        
        const subtotal = orderInfo.total
        const discountInfo = getDiscountInfo(metPagamento)
        const discountAmount = subtotal * discountInfo.discount
        const total = subtotal - discountAmount
        
        return { subtotal, discount: discountAmount, total, discountInfo }
    }

    const isFormValid = metPagamento !== ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isFormValid || !orderInfo) return

        setLoading(true)
        try {
            const paymentMethod = getPaymentMethodKey(metPagamento)
            const result = await ApiService.payOrder(orderInfo.orderId, {
                cpf: orderInfo.cpf,
                payment_method: paymentMethod
            })

            setPaymentResult(result)
            
            // Armazenar resultado do pagamento
            sessionStorage.setItem('paymentResult', JSON.stringify(result))
            
            // Redirecionar para status do pedido
            router.push('/StatusPedido')
        } catch (error) {
            console.error('Erro ao processar pagamento:', error)
            alert('Erro ao processar pagamento. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleVoltar = () => {
        router.push('/TelaInfo')
    }

    if (!orderInfo) {
        return <div>Carregando...</div>
    }

    const { subtotal, discount, total, discountInfo } = calculateTotal()

    return(
        <>
        <Header isClient/>
        <form className='main-content' onSubmit={handleSubmit}>
            <div className='info-cliente'>
                <div className='nome-endereco-complemento'>
                    <div>
                        <p id='bold'>Nome:</p>
                        <p>{orderInfo.customerInfo.nome}</p>
                    </div>
                    <div>
                        <p id='bold'>Endereço:</p>
                        <p>{orderInfo.customerInfo.endereco}</p>
                    </div>
                    <div>
                        <p id='bold'>Complemento:</p>
                        <p>{orderInfo.customerInfo.complemento || 'N/A'}</p>
                    </div>
                </div>
                <div className='cpf-telefone'>
                    <div>
                        <p id='bold'>CPF:</p>
                        <p>{orderInfo.customerInfo.cpf}</p>
                    </div>
                    <div>
                        <p id='bold'>Telefone:</p>
                        <p>{orderInfo.customerInfo.telefone}</p>
                    </div>
                </div>
            </div>

            <div className='opcoes-pagamento'>
                <div className='opcoes-pagamento'>
                  <span>Pagamento:</span>
                  {['Pix', 'Credito', 'Dinheiro'].map((method) => (
                    <div className='option' key={method}>
                      <input
                        className='radio-container' 
                        type='radio' 
                        id={method.toLowerCase()} 
                        name='pagamento' 
                        value={method} 
                        checked={metPagamento === method} 
                        onChange={() => setMetPagamento(method)}
                       />
                      <label htmlFor={method.toLowerCase()}>
                        {method === 'Credito' ? 'Cartão de Crédito' : 
                         method === 'Dinheiro' ? 'Dinheiro (com Cartão Fidelidade)' : method}
                      </label>
                    </div>
                  ))}
                </div>
            </div>

            <div className='conta'>
                <div className='conta-segmento'>
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <hr></hr>
                {metPagamento && discountInfo && discount > 0 && (
                    <>
                        <div className='conta-segmento'>
                            <span>{discountInfo.name}</span>
                            <span style={{color: '#ff0000'}}>{discountInfo.text}</span>
                        </div>
                        <hr></hr>
                    </>
                )}
                <div className='conta-segmento'>
                    <span style={{fontWeight: 700}}>Total:</span>
                    <span style={{fontWeight: 700}}>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            <div className='buttons'>
                <Button 
                    text={loading ? 'Processando...' : 'Confirmar Pedido'} 
                    type='submit' 
                    tipo='btn-confirmarPedido -preto'
                    disabled={!isFormValid || loading}
                />
                <Button 
                    text='Voltar' 
                    type='button' 
                    tipo='btn-voltarPedido -branco' 
                    onClick={handleVoltar}
                />
            </div>
        </form>
        </>
    )
}