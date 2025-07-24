'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header/Header'
import Image from 'next/image'
import './style.css'

interface ItemPedido {
    nome: string;
    personalizacoes: string[];
    preco: number;
    
}

interface Pedido {
    id: number;
    status: number; // 1:pedido recebido, 2:em preparo, 3:pedido pronto, 4: retirado
    itens: ItemPedido[];
    total: number;
}

export default function StatusPedido() {
    const router = useRouter()
    
    const [pedido] = useState<Pedido>({
        id: 1,
        status: 2, //em preparo
        itens: [
            {
                nome: "Café",
                personalizacoes: ["Sem açúcar", "Leite de aveia", "Canela"],
                preco: 14.99
            },
            {
                nome: "Café",
                personalizacoes: ["Com açúcar", "Leite de vaca", "Canela"],
                preco: 14.99
            }
        ],
        total: 29.98
    })

    const statusLabels = [
        "Pedido recebido",
        "Em preparo", 
        "Pedido pronto",
        "Retirado"
    ]

    const handleVoltar = () => {
        router.back()
    }

    const handleCancelarPedido = () => {
        //lógica de cancelamento
        if (confirm("Tem certeza que deseja cancelar o pedido?")) {
            console.log("Pedido cancelado")
            router.push('/')
        }
    }

    return (
        <>
            <Header isClient />
            
            <div className='status-header'>
                <button className='btn-voltar -branco' onClick={handleVoltar}>
                <div className='mg-auto'>
                    <Image src='./images/fi-bs-angle-left.svg' alt='' width={25} height={25}></Image>
                </div>
                </button>
                <h1 className='titulo-status'>Status do pedido</h1>
            </div>
            
            <div className='status-container'>
                <div className='status-tracker'>
                    {statusLabels.map((label, index) => (
                        <div key={index} className='status-step-wrapper'>
                            <div className='status-step'>
                                <div className={`status-circle ${pedido.status >= index + 1 ? 'active' : ''}`}>
                                    {index + 1}
                                </div>
                                {index < statusLabels.length - 1 && (
                                    <div className={`status-line ${pedido.status > index + 1 ? 'active' : ''}`}></div>
                                )}
                            </div>
                            <span className={`status-label ${pedido.status > index + 1 ? 'completed' : pedido.status === index + 1 ? 'current' : ''}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='resumo-container'>
                <h2 className='resumo-titulo'>Resumo do seu pedido</h2>
                
                <div className='itens-lista'>
                    {pedido.itens.map((item, index) => (
                        <div key={index} className='item-pedido'>
                            <div className='item-info'>
                                <h3 className='item-nome'>{item.nome}</h3>
                                <div className='item-personalizacoes'>
                                    {item.personalizacoes.map((personalizacao, idx) => (
                                        <span key={idx} className='personalizacao'>
                                            {personalizacao}{idx < item.personalizacoes.length - 1 ? ',' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className='item-preco'>
                                R$ {item.preco.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                
                
            </div>

            <div className='acao-container'>
                <button className='btn-cancelar -preto' onClick={handleCancelarPedido} disabled={pedido.status >= 3}>
                    {pedido.status >= 3 ? 'Pedido não pode ser cancelado' : 'Cancelar Pedido'}
                </button>
            </div>
        </>
    )
}