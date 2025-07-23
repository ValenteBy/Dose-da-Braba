export interface HeaderProps {
    isAdmin?: boolean;
    isClient?: boolean;
}

export interface InputProps {
    name?: string;
    text?: string;
    id?: string;
    placeholder: string;
    value?: string;
    onChange?: (e : React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ButtonProps {
    text: string;
    tipo: string;
    pagina?: string;
    type?: "button" | "submit" | "reset"
    onClick?: (e : React.MouseEvent<HTMLButtonElement>) => void
}

export interface Produto{
    nome: string;
    preco: number;
    descricao: string;
    imagem?: string;
}

export interface TextProps{
    text: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface ItemProps{
    nome: string;
    preco: number;
    imagem?: string;
    adicionais: string[];
    quantidade: number;
}

export interface CounterProps{
    quant: number;
}