import { TextProps } from '@/types'
import './TextArea.css'

const TextArea = ({text, placeholder, value, onChange} : TextProps) => {
    return(
        <div>
            <p>{text}</p>
            <textarea className='textArea' placeholder={placeholder} value={value} onChange={onChange}></textarea>
        </div>
    )
}

export default TextArea