'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header/Header'
import Input from '../components/Input/Input'
import TextArea from '../components/TextArea/TextArea'
import Select from '../components/Select/Select'
import InsertFile from '../components/InsertFile/InsertFile'
import './style.css'

export default function EditarProduto(){
    const router = useRouter()

    const [nomeProduto, setNomeProduto] = useState('')
    const [descricaoProduto, setDescricaoProduto] = useState('')
    const [precoProduto, setPrecoProduto] = useState('')

    const handleProdutosAdmin = () => {
        router.push('/ProdutosAdmin')
    }

    return(
        <>
            <Header isAdmin/>
            <div className='titulo'>
                <h1>Cadastrar Produto</h1>
            </div>
            
            <form className='linha'>
                <div className='coluna'>
                    <Input id='input' text='Nome do Produto:' placeholder='' value={nomeProduto} onChange={(e) => {setNomeProduto(e.target.value)}}/>
                    <Select></Select>
                    <Input id='preco' text='Preço:' placeholder='0,01' value={precoProduto} onChange={(e) => {setPrecoProduto(e.target.value)}}/>
                    <label>Disponível para compra: 
                        <input type='checkbox' id='check-disponivel'></input>
                    </label>

                    <div className='btn-container'>
                        <button className='-branco' type='reset' value='Reset' id='voltar' onClick={handleProdutosAdmin}>Voltar</button>
                    </div>
                </div>

                <span id='separador'></span>

                <div className='coluna'>
                    <TextArea text='Descrição do Produto:' placeholder='Digite aqui a descrição' value={descricaoProduto} onChange={(e) => {setDescricaoProduto(e.target.value)}}/>
                    <InsertFile></InsertFile>
                    <div className='btn-container -end'>
                        <button className='-preto' type='submit' id='salvar'>Salvar</button>
                    </div>
                </div>

            </form>
        </>
    )
}