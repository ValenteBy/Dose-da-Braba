'use client';
import { useState } from "react";
import Header from "../components/Header/Header";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import "./style.css";

export default function HomeAdmin() {
    const [s1, setS1] = useState('');

    return (
        <>
        <Header/>
        <div className="container">
            <div className='linha'>
                <p className="senhaText">Senha:</p>
                <Input id="senha" placeholder="Digite a Senha de Admin" value={s1} onChange={(e) => setS1(e.target.value)}/>
            </div>
            <Button text="Confirmar" tipo="btn-confirmarSenha -preto" pagina="/ProdutosAdmin"/>
        </div>
        </>
    )
}