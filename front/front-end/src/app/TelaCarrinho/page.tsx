'use client'
import './style.css'
import Header from '../components/Header/Header'
import Item from '../components/Item/Item';
import TextArea from '../components/TextArea/TextArea';
import Button from '../components/Button/Button';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function TelaCarrinho(){
    const [observacoes, setObservacoes] = useState('')
    const [cpf, setCpf] = useState('')
    const { items, total, clearCart } = useCart()
    const router = useRouter()

    const handleVoltar = () => {
        router.back()
    }

    const handleConfirmarPedido = () => {
        if (!cpf.trim()) {
            alert('Por favor, informe seu CPF')
            return
        }

        if (items.length === 0) {
            alert('Seu carrinho está vazio')
            return
        }

        // Armazenar dados do pedido no sessionStorage
        const orderData = {
            cpf: cpf.trim(),
            items: items.map(item => ({
                base: item.base,
                addons: item.addons,
                quantity: item.quantity
            })),
            observations: observacoes,
            total: total
        }

        sessionStorage.setItem('orderData', JSON.stringify(orderData))
        router.push('/TelaInfo')
    }

    const formatCPF = (value: string) => {
        // Remove caracteres não numéricos
        const numbers = value.replace(/\D/g, '')
        
        // Aplica máscara XXX.XXX.XXX-XX
        if (numbers.length <= 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        }
        return value
    }

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value)
        setCpf(formatted)
    }

    return(
        <>
        <Header isClient/>
        <main>
            <section className='carrinho-container'>
                <div className='cpf-container'>
                    <label htmlFor="cpf">CPF do Cliente:</label>
                    <input 
                        id="cpf"
                        type="text" 
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={handleCPFChange}
                        maxLength={14}
                        className='cpf-input'
                    />
                </div>

                {items.length === 0 ? (
                    <div className='carrinho-vazio'>
                        <p>Seu carrinho está vazio</p>
                        <Button tipo='btn-confirmar -preto' text='Ir ao Menu' onClick={() => router.push('/Menu')}/>
                    </div>
                ) : (
                    <>
                        {items.map((item, index) => (
                            <div key={index}>
                                <Item 
                                    nome={item.name} 
                                    preco={item.price * item.quantity} 
                                    imagem="./images/image-exemplo.svg" 
                                    adicionais={item.addons} 
                                    quantidade={item.quantity}
                                />
                            </div>
                        ))}
                        
                        <div className='total-container'>
                            <h3>Total do Pedido: R$ {total.toFixed(2)}</h3>
                        </div>
                    </>
                )}

                <div className='obs-container'>
                  <p>Observações:</p>
                  <TextArea 
                    text='' 
                    placeholder='Alguma observação especial para seu pedido?' 
                    value={observacoes} 
                    onChange={(e) => setObservacoes(e.target.value)}
                  />
                </div>
                
                <div className='buttons'>
                  <div className='margin-left'>
                    <Button type='button' tipo='btn-voltar -branco' text='Voltar' onClick={handleVoltar}/>
                  </div>
                  <div className='margin-right'>
                    <Button 
                        tipo='btn-confirmar -preto' 
                        text='Confirmar Pedido' 
                        onClick={handleConfirmarPedido}
                        disabled={items.length === 0}
                    />
                  </div>
                </div>
            </section>
        </main>
        </>
    )
}