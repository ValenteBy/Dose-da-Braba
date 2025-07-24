'use client'
import './style.css'
import Header from '../components/Header/Header'
import Popup from 'reactjs-popup'
import { useState } from 'react'

export default function GerenciarPedidos(){

    const [open, setOpen] = useState(false)

    const cliente = [{
        nome: 'Fulano de Sousa',
        cpf: '123.456.789-10',
        endereco: 'Av. Dr.Silas Munguba',
        numero: '(85) 9 9702-8922',
        complemento: 'Lorem Ipsum Dolor Sit Amet'
    }]

    const pedido = [
        { nome: "Café Expresso",
            preco: 15.99,
            imagem: "./images/image-exemplo.svg",
            adicionais: ['Acucar', 'Leite'],
            quantidade: 1
        },
        { nome: "Capuccino",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg",
            adicionais: ['Acucar', 'Leite','Raspas de Chocolate'],
            quantidade: 1
        }
    ]

    return(
        <>
        <Header isAdmin/>
        <div className='pedidos-container'>
            <div className='pedidos-content'>
                <h1>Pedidos</h1>
                <div className='pedido-card'>
                    <div className='pedido-card-container'>

                    <div className='status-container'>
                        <div className='status-showcase'>
                            <div className='status-cell'>
                            <div className='status-bar'>
                                <div className='status-ball -preto'>1</div>
                                <div className='status-path'></div>
                            </div>
                            <p>Pedido Recebido</p>
                            </div>
                            <div className='status-cell'>
                                <div className='status-bar'>
                                    <div className='status-ball -preto'>2</div>
                                    <div className='status-path'></div>
                                </div>
                                <p>Pedido Em preparo</p>
                            </div>
                            <div className='status-cell'>
                                <div className='status-bar'>
                                    <div className='status-ball -preto'>3</div>
                                    <div className='status-path'></div>
                                </div>
                                <p>Pedido Pronto</p>
                            </div>
                            <div className='status-cell'>
                                <div className='status-bar'>
                                    <div className='status-ball -preto'>4</div>
                                </div>
                                <p>Pedido Entregue</p>
                            </div>
                        </div>
                    </div>

                    <div className='pedido-card-buttons'>
                        <button className='btn-detalhesPedido -branco' onClick={() => setOpen(true)}>Detalhes</button>
                        <button className='btn-avancarStatus -preto'>Avançar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>

        <Popup open={open} onClose={() => setOpen(false)} modal nested>
            <div className='popup-pedido'>
                <div className='popup-container'>
                    <h1>Pedido</h1>
                    {cliente.map((info, key) => {
                        return(
                        <div className='info-cliente' key={key}>
                            <div className='nome-endereco-complemento'>
                                <div>
                                    <p id='bold'>Nome:</p>
                                    <p>{info.nome}</p>
                                </div>
                                <div>
                                    <p id='bold'>Endereço:</p>
                                    <p>{info.endereco}</p>
                                </div>
                                <div>
                                    <p id='bold'>Complemento:</p>
                                    <p>{info.complemento}</p>
                                </div>
                            </div>
                            <div className='cpf-telefone'>
                                <div>
                                    <p id='bold'>CPF:</p>
                                    <p>{info.cpf}</p>
                                </div>
                                <div>
                                    <p id='bold'>Telefone:</p>
                                    <p>{info.numero}</p>
                                </div>
                            </div>
                        </div>
                        )
                })}
                <hr></hr>
                <div className='resumo-pedido'>
                    {pedido.map((item, key) => {
                        return(
                            <div className='resumo-item' key={key}>
                            <span>
                            <p className=''>{item.nome} - {item.quantidade}x</p>
                            <hr/>
                            {item.adicionais.map((add, key) => {
                                return(
                                    <p id='add-on' key={key}>● {add}</p>
                                )
                            })}
                            </span>
                            <span className='' id='valor'>R$ {item.quantidade * item.preco}</span>
                            </div>
                        )
                    })}
                </div>
                <div className='total-container'>
                    <span>Total:</span>
                    <span>R$ 34,98</span>
                </div>
                <hr></hr>
                <div className='button-popup'>
                    <button className='button-fechar -branco' onClick={() => setOpen(false)}>Fechar</button>
                </div>
                </div>
            </div>
        </Popup>
        </>
    )
}