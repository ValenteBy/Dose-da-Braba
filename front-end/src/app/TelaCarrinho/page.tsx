'use client'
import './style.css'
import Header from '../components/Header/Header'
import Item from '../components/Item/Item';
import TextArea from '../components/TextArea/TextArea';
import Button from '../components/Button/Button';
import { useState } from 'react';

export default function TelaCarrinho(){
    const [ob1, setOB1] = useState('')

    const produto = { nome: "Café Expresso",
            preco: 15.99,
            imagem: "./images/image-exemplo.svg",
            adicionais: ['Acucar', 'Leite'],
            quantidade: 1
          }

    const carrinho = [
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
          },
          { nome: "Latte",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg",
            adicionais: ['Acucar', 'Leite','Raspas de Chocolate'],
            quantidade: 1
          }
      ];

    return(
        <>
        <Header isClient/>
        <main>
            <section className='carrinho-container'>
                {carrinho.map((prod, key) => {
                return(
                    <div key={key}>
                        <Item nome={prod.nome} preco={prod.preco} imagem={prod.imagem} adicionais={prod.adicionais} quantidade={prod.quantidade}></Item>
                    </div>
                )
                })}
                <div className='obs-container'>
                  <p>Observações:</p>
                  <TextArea text='' placeholder='' value={ob1} onChange={(e) => {setOB1(e.target.value)}}></TextArea>
                </div>
                <div className='buttons'>
                  <div className='margin-left'>
                    <Button type='reset' tipo='btn-voltar -branco' text='Voltar' pagina='/'></Button>
                  </div>
                  <div className='margin-right'>
                    <Button tipo='btn-confirmar -preto' text='Confirmar Pedido' pagina='/TelaInfo'></Button>
                  </div>
                </div>
            </section>
        </main>
        </>
    )
}