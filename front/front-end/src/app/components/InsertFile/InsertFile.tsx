import './InsertFile.css'

const InsertFile = () => {
    return(
        <div className='insert-container'>
            <p>Imagem do Produto:</p>
            <input id='insert' type='file' accept='image/*' name='imagemProduto'/>
        </div>
    )
}

export default InsertFile