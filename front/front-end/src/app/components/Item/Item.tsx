import './Item.css'
import { ItemProps } from '@/types'
import Image from 'next/image'
import Counter from '../Counter/Counter'

const Item = ({nome, preco, imagem, adicionais, quantidade} : ItemProps) => {
    return(
        <div className='item-container'>
            <Image className='img-border' src={imagem} alt='item-image' width={240} height={200}/>
            <span className='-y-auto'>
                <p id='nome'>{nome}</p>
                <hr/>
                {adicionais.map((add, key) => {
                    return(
                        <p id='add-on' key={key}>● {add}</p>
                    )
                })}
            </span>
            <span className='mg-preco -auto' id='valor'>R$ {quantidade * preco}</span>
            <div className='mg-counter -y-auto'>
                <Counter quant={quantidade}/>
            </div>
        </div>       
    )
}

export default Item