import { Produto } from '@/types'
import Image from 'next/image'
import './Card.css'
import Button from '../Button/Button';
import { useRouter } from 'next/navigation';

export default function Card()  {
    const router = useRouter()

    const handleTelaProduto = () => {
      router.push('/TelaProduto')
    }

    const produtos = [
          { nome: "Café Expresso",
            preco: 15.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Capuccino",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Latte",
            preco: 19.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Cha",
            preco: 10.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Hot Chocolate",
            preco: 17.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Suco",
            preco: 12.99,
            imagem: "./images/image-exemplo.svg"
          },
          { nome: "Seila",
            preco: 10.00,
            imagem: "./images/image-exemplo.svg"
          }
      ];

    return(
        <div className='cards-wrapper'>
            {produtos.map((item, key) => {
            return (
            <div className='produto-card' key={key}>
                <Image className='image-border' src={item.imagem} alt='product-photo' width={170} height={170}></Image>
                <span className='nome-container text-style'>{item.nome}</span>
                <span className='preco-container text-style'>R$ {item.preco}</span>
                <Button text='Adicionar ao carrinho' tipo='btn-adicionarProduto' type='button' onClick={handleTelaProduto}/>
            </div>)
            })}
        </div>
    )
}
