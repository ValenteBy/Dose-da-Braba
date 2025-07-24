'use client'
import { useState } from 'react'
import Header from '../components/Header/Header'
import Image from 'next/image'
import Card from '../components/Card/Card'
import { useRouter } from 'next/navigation'
import './style.css'

export default function Menu(){
    const router = useRouter()
    const [b1, setB1] = useState('')

    const handleTelaInicial = () => {
        router.push('/')
    }

    return(
        <>
        <Header isClient></Header>
        <div className='menu-container'>
            <div className='cabecalho-menu'>
                <button className='btn-voltarMenu -branco' onClick={handleTelaInicial}>
                <div className='mg-auto'>
                    <Image src='./images/fi-bs-angle-left.svg' alt='' width={25} height={25}></Image>
                </div>
                </button>
                <p id='menu'>Menu</p>
            </div>
            <Card/>
        </div>
        </>
    )
}