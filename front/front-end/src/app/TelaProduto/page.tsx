'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../components/Header/Header'
import TextArea from '../components/TextArea/TextArea'
import { useCart } from '@/contexts/CartContext'
import { MenuItem, CartItem } from '@/types'
import './style.css'

interface AddonInfo {
    id: string;
    label: string;
    price: number;
}

export default function TelaProduto() {
    const router = useRouter()
    const { addItem } = useCart()

    const [observacoes, setObservacoes] = useState('')
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<string[]>([])
    const [produto, setProduto] = useState<MenuItem | null>(null)
    const [quantidade, setQuantidade] = useState(1)

    const addonOptions: AddonInfo[] = [
        { id: "LeiteDeAveia", label: "Leite de Aveia", price: 2.0 },
        { id: "Canela", label: "Canela", price: 1.0 },
        { id: "SemAcucar", label: "Sem Açúcar", price: 0.0 },
    ]

    useEffect(() => {
        // Recuperar produto selecionado do sessionStorage
        const selectedProduct = sessionStorage.getItem('selectedProduct')
        if (selectedProduct) {
            setProduto(JSON.parse(selectedProduct))
        } else {
            // Fallback caso não tenha produto selecionado
            router.push('/Menu')
        }
    }, [router])

    const handleVoltar = () => {
        router.back()
    }

    const handleOpcaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setOpcoesSelecionadas(prev => 
            checked ? [...prev, value] : prev.filter(opcao => opcao !== value)
        );
    };

    const calculateTotalPrice = () => {
        if (!produto) return 0;
        
        const basePrice = produto.base_price;
        const addonsPrice = opcoesSelecionadas.reduce((total, addonId) => {
            const addon = addonOptions.find(a => a.id === addonId);
            return total + (addon?.price || 0);
        }, 0);
        
        return (basePrice + addonsPrice) * quantidade;
    };

    const handleAdicionarAoCarrinho = () => {
        if (!produto) return;

        const cartItem: CartItem = {
            base: produto.category === "Cafe" ? "Cafe" : "Cha",
            addons: opcoesSelecionadas,
            quantity: quantidade,
            price: calculateTotalPrice() / quantidade,
            name: produto.name
        };

        addItem(cartItem);
        
        console.log('Produto adicionado ao carrinho:', {
            produto: produto.name,
            opcoes: opcoesSelecionadas,
            observacoes: observacoes,
            quantidade: quantidade,
            preco: calculateTotalPrice()
        })
        
        router.push('/TelaCarrinho')
    }

    const handleQuantidadeChange = (delta: number) => {
        setQuantidade(prev => Math.max(1, prev + delta));
    };

    if (!produto) {
        return <div>Carregando...</div>
    }

    return (
        <>
            <Header isClient />
            <form className='bebida-container'>
                <div className='bebida-card'>
                    <div className='bebida-info-top'>
                        <Image src="/images/image-exemplo.svg" alt={produto.name} width={200} height={200} className='bebida-imagem'/>
                        <div className='bebida-detalhes'>
                            <h1 className='bebida-nome'>{produto.name}</h1>
                            <p className='bebida-descricao'>Deliciosa bebida da nossa cafeteria</p>
                            <p className='bebida-preco'>Preço base: R$ {produto.base_price.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className='bebida-opcoes'>
                        <h3>Personalize sua bebida:</h3>
                        {addonOptions.map((opcao) => (
                            <label key={opcao.id} className='opcao-item'>
                                <input 
                                    type='checkbox' 
                                    name='personalizacao' 
                                    value={opcao.id} 
                                    checked={opcoesSelecionadas.includes(opcao.id)} 
                                    onChange={handleOpcaoChange}
                                />
                                {opcao.label} {opcao.price > 0 && `(+R$ ${opcao.price.toFixed(2)})`}
                            </label>
                        ))}
                    </div>

                    <div className='quantidade-container'>
                        <label>Quantidade:</label>
                        <div className='quantidade-controls'>
                            <button type='button' onClick={() => handleQuantidadeChange(-1)}>-</button>
                            <span>{quantidade}</span>
                            <button type='button' onClick={() => handleQuantidadeChange(1)}>+</button>
                        </div>
                    </div>

                    <div className='preco-total'>
                        <h3>Total: R$ {calculateTotalPrice().toFixed(2)}</h3>
                    </div>

                    <div className='bebida-observacoes'>
                        <label className='observacoes-label'>Observações:</label>
                        <TextArea text='' placeholder='Alguma observação especial?' value={observacoes} onChange={(e) => setObservacoes(e.target.value)}/>
                    </div>

                    <div className='bebida-actions'>
                        <button type='button' className='btn-voltar -branco' onClick={handleVoltar}>Voltar</button>
                        <button type='button' className='btn-adicionar -preto' onClick={handleAdicionarAoCarrinho}>Adicionar ao Carrinho</button>
                    </div>
                </div>
            </form>
        </>
    )
}
