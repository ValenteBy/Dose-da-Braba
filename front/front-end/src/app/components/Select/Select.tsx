import './Select.css'

const Select = () => {
    return(
        <div>
            <p>Tipo do Produto:</p>
            <select name='tipo' id='tipoProduto'>
                <option value='Base'>Base</option>
                <option value='Adicional'>Adicional</option>
            </select>
        </div>
    )
}

export default Select