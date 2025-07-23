import './CardEditar.css'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CardEditar() {
    const router = useRouter();

    const handleEditarProdutosPage = () => {
        router.push('/EditarProduto')
    }

    const handleCadProduto = () => {
        router.push('/CadProduto')
    }

    const produtos = [
            { nome: "Café Expresso",
            preco: 15.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Disponível"
            },
            { nome: "Capuccino",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Disponível"
            },
            { nome: "Latte",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Disponível"
            },
            { nome: "Cha",
            preco: 10.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Indisponível"
            },
            { nome: "Hot Chocolate",
            preco: 17.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Indisponível"
            },
            { nome: "Suco",
            preco: 12.99,
            imagem: "./images/image-exemplo.svg",
            ativo: "Disponível"
            },
            { nome: "Seila",
            preco: 10.00,
            imagem: "./images/image-exemplo.svg",
            ativo: "Indisponível"
            }
    ];

    return(
        <>
        <div className='cards'>
            <div className='cardCriar-container' onClick={handleCadProduto}>
                <div>
                    <button className='button-criar -preto' onClick={handleCadProduto}>+</button>
                    <p>Criar Produto</p>
                </div>
            </div>

            {produtos.map((item, key) => {
                return(
                    <div className='cards-container' key={key}>
                        <Image className='border' src={item.imagem} alt='Product-Photo' width={300} height={300}/>
                        <span>{item.nome}</span>
                        <span>R$ {item.preco}</span>
                        <span id='ativo'>Status: {item.ativo}</span>
                        <span>
                            <span>
                                <button className='btn-editarProduto -preto' onClick={handleEditarProdutosPage}>Editar</button>
                            </span>
                            <span>
                                <button className='btn-removerProduto -branco'>Remover</button>
                            </span>
                        </span>
                    </div>
                )
            })}
        </div>
        </>
    )
}