'use client'
import { useState } from 'react'
import Header from '../components/Header/Header'
import Input from '../components/Input/Input'
import Card from '../components/Card/Card'
import './style.css'

export default function TelaInicial(){
    const [b1, setB1] = useState('')

    return(
        <>
        <Header isClient></Header>
        <div className='search-input-container'>
            <Input id='busca' placeholder='Busque por item' value={b1} onChange={(e) => setB1(e.target.value)}/>
        </div>
        <div className='contents-wrapper'>
            <div className='ultimos-pedidos-container'></div>
            <div className='produtos-container'>
                <Card/>
            </div>
        </div>
        </>
    )
}