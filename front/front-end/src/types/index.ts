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
    disabled?: boolean;
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

// API Types - Baseado no backend real
export interface MenuItem {
    id: string;
    name: string;
    base_price: number;
    category: string;
}

export interface OrderItem {
    base: string;
    addons: string[];
}

export interface PlaceOrderDTO {
    cpf: string;
    items: OrderItem[];
}

export interface OrderResponse {
    id: string;
    cpf: string;
    items: OrderItem[];
    status: string;
    total_price: number;
}

export interface PaymentDTO {
    cpf: string;
    payment_method: string;
}

// Estados válidos do pedido (baseado no State Pattern do backend)
export type OrderStatus = 'RECEBIDO' | 'EM PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';

// Response do pagamento
export interface PaymentResponse {
    order_id: string;
    status: string;
    total: number;
    original_price: number;
    discount_applied: number;
    final_price: number;
}

export interface CartItem {
    base: string;
    addons: string[];
    quantity: number;
    price: number;
    name: string;
}