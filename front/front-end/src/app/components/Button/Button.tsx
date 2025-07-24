import "./Button.css"
import { ButtonProps } from "@/types"
import { useRouter } from "next/navigation"

const Button = ({text, tipo ,type , pagina, onClick} : ButtonProps) => {
    const router = useRouter();

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) =>{
        if (onClick){
            onClick(e);
        }
        if (pagina && type !== 'submit') {
          router.push(pagina);
        }
    }

    return(
        <div className="buttonbox">
            <button className={tipo} type={type} onClick={handleButtonClick}>
                {text}
            </button>
        </div>
    )
}

export default Button