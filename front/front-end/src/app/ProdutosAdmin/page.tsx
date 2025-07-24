'use client'
import CardEditar from '../components/CardEditar/CardEditar'
import Header from '../components/Header/Header'
import './style.css'

export default function ProdutosAdmin(){
    return(
        <>
        <Header isAdmin/>
        <p className='produtos'>Produtos</p>
        <CardEditar/>
        </>
    )
}