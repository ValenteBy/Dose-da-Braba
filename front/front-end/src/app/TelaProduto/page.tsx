'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../components/Header/Header'
import TextArea from '../components/TextArea/TextArea'
import './style.css'

interface ProdutoDetalhe {
    nome: string;
    descricao: string;
    imagem: string;
    opcoes: { id: string; label: string; }[];
    preco: number;
}

export default function TelaProduto() {
    const router = useRouter()

    const [observacoes, setObservacoes] = useState('')
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<string[]>([])


    const produto: ProdutoDetalhe = {
        nome: "Café Expresso",
        descricao: "Descricao do Produto",
        imagem: "/images/image-exemplo.svg",
        opcoes: [
            { id: "leite-aveia", label: "Leite de Aveia" },
            { id: "canela", label: "Canela" },
            { id: "sem-acucar", label: "Sem Açúcar" },
        ],
        preco: 14.99
    }

    const handleVoltar = () => {
        router.back()
    }

    const handleOpcaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setOpcoesSelecionadas(prev => 
            checked ? [...prev, value] : prev.filter(opcao => opcao !== value)
        );
    };

    const handleAdicionarAoCarrinho = () => {
        console.log('Produto adicionado ao carrinho:', {
            produto: produto.nome,
            opcao: opcoesSelecionadas,
            observacoes: observacoes
        })
        //adicionar ao carrinho
        router.push('/TelaCarrinho')
    }

    return (
        <>
            <Header isClient />
            <form className='bebida-container'>
                <div className='bebida-card'>
                    <div className='bebida-info-top'>
                        <Image src={produto.imagem} alt={produto.nome} width={200} height={200} className='bebida-imagem'/>
                        <div className='bebida-detalhes'>
                            <h1 className='bebida-nome'>{produto.nome}</h1>
                            <p className='bebida-descricao'>{produto.descricao}</p>
                        </div>
                    </div>

                    <div className='bebida-opcoes'>
                        {produto.opcoes.map((opcao) => (
                            <label key={opcao.id} className='opcao-item'>
                                <input type='checkbox' name='personalizacao' value={opcao.id} checked={opcoesSelecionadas.includes(opcao.id)} onChange={handleOpcaoChange}/>{opcao.label}</label>
                        ))}
                    </div>

                    <div className='bebida-observacoes'>
                        <label className='observacoes-label'>Observações:</label>
                        <TextArea text='' placeholder='Lorem Ipsum Dolor Sit Amet' value={observacoes} onChange={(e) => setObservacoes(e.target.value)}/>
                    </div>

                    <div className='bebida-actions'>
                        <button className='btn-voltar -branco' onClick={handleVoltar}>Voltar</button>
                        <button className='btn-adicionar -preto' onClick={handleAdicionarAoCarrinho}>Adicionar ao Carrinho</button>
                    </div>
                </div>
            </form>
        </>
    )
}
