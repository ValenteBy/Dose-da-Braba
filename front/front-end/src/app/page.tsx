'use client'
import { useState } from 'react'
import Header from './components/Header/Header'
import Image from 'next/image'
import Footer from './components/Footer/Footer'
import Input from './components/Input/Input'
import Card from './components/Card/Card'
import './pageStyle.css'

export default function TelaInicial(){
    const [b1, setB1] = useState('')

    return(
        <>
        <Header isClient></Header>
        <div>
          <div className='container'>
          <div className='justify-between'>
            <div className='column'>
              <div>
                <h1 className='texto-principal'>O CAFÉ NOTA 10</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi, quae placeat. Corrupti, omnis id a consequatur eius saepe quia dignissimos.</p>
              </div>
              <div className='buttons'>
                <button className='botao-box text-style -preto -bordas -tamanho'>GitHub</button>
                <button className='botao-box text-style -branco -bordas -tamanho'>Qualquer</button>
              </div>
            </div>
            <span>
              <Image src='./images/image-exemplo.svg' alt='Imagem-Cafe' width={750} height={750}/>
            </span>
          </div>
        </div>
        </div>

      {/* Segunda Parte -> Cards */}
        <div className='-branco'>
          <div className='container py-5rem'>
            <div className='text-container'>
              <div className='mg-auto wd-fit'>
                <h1 className='mg-auto wd-fit'>a</h1>
                <p className='texto-cinza mg-auto subtitulo py-1rem'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi, quae placeat. Corrupti, omnis id a consequatur eius saepe quia dignissimos.</p>
              </div>
            </div>

            <div className='options-container'>
              <div className='option-card px-py'>
                <h1 className='mg-texto-card'>Cafés</h1>
                <p className='texto-cinza mg-texto-card'>Lorem ipsum dolor sit amet dolor consectetur.</p>
                <div className='imagem-e-botao'>
                  <Image className='imagem-pd' src='./images/fi-ss-coffee.svg' alt='' width={120} height={120}/>
                  <button className='botao-box-card -preto'>Menu</button>
                </div>
              </div>

              <div className='option-card px-py'>
                <h1 className='mg-texto-card'>Chás</h1>
                <p className='texto-cinza mg-texto-card'>Lorem ipsum dolor sit amet dolor consectetur.</p>
                <div className='imagem-e-botao'>
                  <Image className='imagem-pd pd-left' src='./images/fi-sr-mug-alt.svg' alt='' width={120} height={120}/>
                  <button className='botao-box-card -preto'>Menu</button>
                </div>
              </div>

              <div className='option-card px-py'>
                <h1 className='mg-texto-card'>Outros</h1>
                <p className='texto-cinza mg-texto-card'>Lorem ipsum dolor sit amet dolor consectetur.</p>
                <div className='imagem-e-botao'>
                  <Image className='imagem-pd' src='./images/fi-ss-cupcake.svg' alt='' width={120} height={120}/>
                  <button className='botao-box-card -preto'>Menu</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{height: 250}}></div>

        <div className='-branco'>
          <div className='container py-5rem'>
            <div className='text-container'>
              <div className='mg-auto'>
                <h1 className='mg-auto wd-fit'>Equipe</h1>
              </div>
            </div>

            <div className='options-container -wd-team'>
              <div className='person-card'>
                <div className='img-container'>
                  <Image className='mg-left' src='/images/Erley.png' alt='' width={390} height={250}></Image>
                </div>
                <div className='px-py'>
                  <h2 className='mg-texto-card'>Erley Monteiro da Rocha</h2>
                  <p className='texto-cinza mg-texto-card'>Matrícula: 1631451</p>
                </div>
                <div className='py-1rem'>
                  <a className='mg-github' href='https://github.com/ErleyMDR' target='_blank'>
                    <Image src='./images/Octicons-mark-github.svg' alt='' width={40} height={40}></Image>
                  </a>
                </div>
              </div>

              <div className='person-card'>
                <div className='img-container'></div>
                <div className='px-py'>
                  <h2 className='mg-texto-card'>Samuel Valente de Oliveira</h2>
                  <p className='texto-cinza mg-texto-card'>Matricula: seilaporra</p>
                </div>
                <div className='py-1rem'>
                  <a className='mg-github' href='https://github.com/ValenteBy' target='_blank'>
                    <Image src='./images/Octicons-mark-github.svg' alt='' width={40} height={40}></Image>
                  </a>
                </div>
              </div>

              <div className='person-card'>
                <div className='img-container'></div>
                <div className='px-py'>
                  <h2 className='mg-texto-card'>Gustavo Lopes Lameu</h2>
                  <p className='texto-cinza mg-texto-card'>Matricula: seilaporra</p>
                </div>
                <div className='py-1rem'>
                  <a className='mg-github' href='https://github.com/GusLameu' target='_blank'>
                    <Image src='./images/Octicons-mark-github.svg' alt='' width={40} height={40}></Image>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Footer/>
        </>
    )
}