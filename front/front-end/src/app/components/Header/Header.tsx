import { HeaderProps } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import "./Header.css"

const Header = ({isAdmin, isClient} : HeaderProps) => {

    const router = useRouter();

    const handleProdutosAdmin = () => {
        router.push('/ProdutosAdmin')
    }
    const handleTelaCarrinho = () => {
        router.push('/TelaCarrinho')
    }
    const handleTelaInicial = () => {
        router.push('/')
    }

    if (isAdmin){
        return(
            <header className="cabecalho-container cabecalho2">
                <div className="">
                    <p className="cabecalho-title">Cafortimais</p>
                </div>
                <div className="cabecalho-container2">
                    <a href="/ProdutosAdmin">Produtos</a>
                    <a>Pedidos</a>
                </div>
            </header>
        )
    }
    else if (isClient){
        return(
            <header className="cabecalho-container">
                <div className="">
                    <p className="cabecalho-title" onClick={handleTelaInicial}>Cafortimais</p>
                </div>
                <div className="nav-bar">
                    <div className="dropdown">
                        <button className="dropbtn">Menu</button>
                        <div className="dropdown-content">
                            <a href="http://localhost:3000/TelaInicial">Café</a>
                            <a>Chá</a>
                            <a>Outros</a>
                        </div>
                    </div>
                    <a className="nav-item">Sobre Nós</a>
                    <a className="nav-item">Descontos</a>
                </div>
                <button className="cabecalho-button-carrinho">
                    <Image
                    src='./images/fi-rr-shopping-cart.svg'
                    alt="Carrinho"
                    draggable={false}
                    height={25}
                    width={25}
                    onClick={handleTelaCarrinho}
                    />
                </button>
            </header>
        )
    }
    else {
        return(
            <header className="cabecalho-container">
                <div className="">
                    <p className="cabecalho-title">Cafortimais</p>
                </div>
            </header>
        )
    }
}

export default Header