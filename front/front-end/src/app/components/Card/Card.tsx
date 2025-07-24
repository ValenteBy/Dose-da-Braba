'use client'
import { Produto, MenuItem } from '@/types'
import Image from 'next/image'
import './Card.css'
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

export default function Card()  {
    const router = useRouter()
    const [produtos, setProdutos] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadMenu()
    }, [])

    const loadMenu = async () => {
        try {
            setLoading(true)
            const menu = await ApiService.getMenu()
            setProdutos(menu)
        } catch (err) {
            console.error('Erro ao carregar menu:', err)
            setError('Erro ao carregar menu')
            // Fallback para produtos estáticos em caso de erro
            setProdutos([
                { id: '1', name: "Café Expresso", base_price: 15.99, category: "Cafe" },
                { id: '2', name: "Capuccino", base_price: 19.99, category: "Cafe" },
                { id: '3', name: "Latte", base_price: 19.99, category: "Cafe" },
                { id: '4', name: "Cha", base_price: 10.99, category: "Cha" },
                { id: '5', name: "Hot Chocolate", base_price: 17.99, category: "Cafe" },
                { id: '6', name: "Suco", base_price: 12.99, category: "Bebida" },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleTelaProduto = (produto: MenuItem) => {
        // Armazenar o produto selecionado no sessionStorage
        sessionStorage.setItem('selectedProduct', JSON.stringify(produto))
        router.push('/TelaProduto')
    }

    if (loading) {
        return <div className='cards-wrapper'>Carregando menu...</div>
    }

    return(
        <div className='cards-wrapper'>
            {error && <div className="error-message">{error}</div>}
            {produtos.map((item) => {
            return (
            <div className='produto-card' key={item.id}>
                <Image className='image-border' src="./images/image-exemplo.svg" alt='product-photo' width={170} height={170}></Image>
                <span className='nome-container text-style'>{item.name}</span>
                <span className='preco-container text-style'>R$ {item.base_price.toFixed(2)}</span>
                <Button text='Personalizar Bebida' tipo='btn-adicionarProduto -preto' type='button' onClick={() => handleTelaProduto(item)}/>
            </div>)
            })}
        </div>
    )
}
