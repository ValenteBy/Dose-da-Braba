import './Input.css'
import Image from 'next/image'
import { InputProps } from '@/types'

const Input = ({name, text, id, placeholder, value, onChange} : InputProps) => {

    if (id == 'senha'){
        return(
            <div className='inputbox'>
                <input id={id} name={name} type='password' placeholder={placeholder} value={value} onChange={onChange}/>
            </div>
        )
    }
    else if (id == 'busca'){
        return(
            <div className='inputbox2'>
                <input id={id} name={name} placeholder={placeholder} value={value} onChange={onChange}/>
                <span className='search-icon'>
                    <Image src='./images/fi-rr-search.svg' alt='search-icon' draggable={false} width={24} height={24}/>
                </span>
            </div>
        )
    }
    else if (id == 'preco'){
        return(
            <div>
                <p>{text}</p>
                <div className='pricebox'>
                <div>
                    <span>R$</span>
                    <input id={id} name={name} placeholder={placeholder} value={value} onChange={onChange}/>
                </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div className='inputbox'>
            <p>{text}</p>
            <input id={id} name={name} placeholder={placeholder} value={value} onChange={onChange}/>
        </div>
        )
    }
}

export default Input