'use client'
import Header from '../components/Header/Header'
import Button from '../components/Button/Button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import './style.css'

export default function ConfirmarPagamento() {

    const router = useRouter()
    const [metPagamento,setMetPagamento] = useState('')

    const cliente = {
        nome: 'Fulano de Sousa',
        cpf: '123.456.789-10',
        endereco: 'Av. Dr.Silas Munguba',
        numero: '(85) 9 9702-8922',
        complemento: 'Lorem Ipsum Dolor Sit Amet'
    }

    const isFormValid = metPagamento !== ''

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!isFormValid) return
      router.push('')//colocar popup de pedido confirmado
    }

    return(
        <>
        <Header isClient/>
        <form className='main-content' onSubmit={handleSubmit}>
            <div className='info-cliente'>
                <div className='nome-endereco-complemento'>
                    <div>
                        <p id='bold'>Nome:</p>
                        <p>{cliente.nome}</p>
                    </div>
                    <div>
                        <p id='bold'>Endereço:</p>
                        <p>{cliente.endereco}</p>
                    </div>
                    <div>
                        <p id='bold'>Complemento:</p>
                        <p>{cliente.complemento}</p>
                    </div>
                </div>
                <div className='cpf-telefone'>
                    <div>
                        <p id='bold'>CPF:</p>
                        <p>{cliente.cpf}</p>
                    </div>
                    <div>
                        <p id='bold'>Telefone:</p>
                        <p>{cliente.numero}</p>
                    </div>
                </div>
            </div>

            <div className='opcoes-pagamento'>
                <div className='opcoes-pagamento'>
                  <span>Pagamento:</span>
                  {['Pix', 'Credito', 'Dinheiro'].map((method) => (
                    <div className='option' key={method}>
                      <input
                        className='radio-container' type='radio' id={method.toLowerCase()} name='pagamento' value={method} checked={metPagamento === method} onChange={() => setMetPagamento(method)}
                       />
              <label htmlFor={method.toLowerCase()}>
                {method === 'Credito' ? 'Cartão de Crédito' : method}
              </label>
            </div>
          ))}
        </div>
            </div>

            <div className='conta'>
                <div className='conta-segmento'>
                    <span>Subtotal:</span>
                    <span>R$ 34,98</span>
                </div>
                <hr></hr>
                <div className='conta-segmento'>
                    <span>Cartão Fidelidade</span>
                    <span style={{color: '#ff0000'}}>10% OFF</span>
                </div>
                <hr></hr>
                <div className='conta-segmento'>
                    <span style={{fontWeight: 700}}>Total:</span>
                    <span style={{fontWeight: 700}}>R$ 31,49</span>
                </div>
            </div>

            <div className='buttons'>
                <Button text='Confirmar Pedido' type='submit' tipo='btn-confirmarPedido -preto' ></Button>
                <Button text='Voltar' type='reset' tipo='btn-voltarPedido -branco' pagina='/TelaInfo'></Button>
            </div>
        </form>
        </>
    )
}