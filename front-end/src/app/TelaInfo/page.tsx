'use client'
import Header from '../components/Header/Header'
import Input from '../components/Input/Input'
import Button from '../components/Button/Button'
import { useState } from 'react'
import './style.css'

export default function TelaInfo() {
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')

    return(
        <>
        <Header isClient/>
        <form className='info-container'>
            <p>Suas informações:</p>
            <div>
                <div className='inputbox'>
                <p>Nome:</p>
                <input name='nome' placeholder='' value={nome} onChange={(e) => {setNome(e.target.value)}}/>
            </div>
            <div className='inputbox'>
                <p>CPF:</p>
                <input name='CPF' placeholder='' value='' onChange={() => {}}/>
            </div>
            <div className='inputbox'>
                <p>Telefone:</p>
                <input name='telefone' placeholder='' value='' onChange={() => {}}/>
            </div>
            <div className='inputbox'>
                <p>Endereço:</p>
                <input name='endereco' placeholder='' value='' onChange={() => {}}/>
            </div>
            <div className='inputbox'>
                <p>Complemento:</p>
                <input name='complemento' placeholder='' value='' onChange={() => {}}/>
            </div>
            </div>
            <div className='buttons'>
                <Button text='Confirmar' type='button' tipo='btn-confirmarInfo' pagina='/ConfirmarPagamento'></Button>
                <Button text='Voltar' type='reset' tipo='btn-voltarInfo' pagina='/TelaCarrinho'></Button>
            </div>
        </form>
        </>
    )
}