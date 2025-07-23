'use client'
import './style.css'
import Header from '../components/Header/Header'
import Image from 'next/image'

export default function TelaProduto() {
    return(
        <>
        <Header isClient/>
        <section className='produto-detalhes-container'>
            <div className='produto-detalhes'>
                <div className='imagem-container'>
                    <Image src='./images/image-exemplo.svg' alt='product-photo' width={240} height={240}/>
                </div>
            </div>
        </section>
        </>
    )
}