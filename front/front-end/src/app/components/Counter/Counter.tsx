import './Counter.css'
import { CounterProps } from '@/types/index.js'
import { useState } from 'react'

const Counter = ({quant}: CounterProps) => {
    const [count, setCount] = useState(quant)

    const handlePlusAction = () => {
        setCount(prevCount => prevCount + 1)
    }

    const handleMinusAction = () => {
        setCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
    }

    return(
        <div className='counterbox'>
            <button className='button' onClick={handleMinusAction}>
                <div className='icon-container'>
                    <svg className='minus'>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </div>
            </button>
            <div id='count'>{count}</div>
            <button className='button' onClick={handlePlusAction}>
                <div className='icon-container'>
                    <svg className='plus'>
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </div>
            </button>
        </div>
    )
}

export default Counter