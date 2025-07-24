'use client'
import Header from '../components/Header/Header'
import Input from '../components/Input/Input'
import Button from '../components/Button/Button'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ApiService } from '@/services/api'
import { useCart } from '@/contexts/CartContext'
import './style.css'

//função pra formatar o cpf em xxx.xxx.xxx-xx
const formatCpf = (value: string) => {
  //remove tudo que não for dígito
  const digits = value.replace(/\D/g, '');
  //aplicando máscara do CPF
  const part1 = digits.substring(0, 3);
  const part2 = digits.substring(3, 6);
  const part3 = digits.substring(6, 9);
  const part4 = digits.substring(9, 11);
  let formatted = part1;
  if (part2) formatted += `.${part2}`;
  if (part3) formatted += `.${part3}`;
  if (part4) formatted += `-${part4}`;
  return formatted;
};

// função pra formatar telefone em (DDD)9XXXX-XXXX
const formatTelefone = (value: string) => {
  //remove tudo que não for dígito
  const digits = value.replace(/\D/g, '');
  // pega DDD (3 dígitos se vier com 0? assumindo 2 dígitos de DDD e dígito 9 fixo)
  const ddd = digits.substring(0, 2);
  const firstDigit = digits.substring(2, 3);
  const part1 = digits.substring(3, 7);
  const part2 = digits.substring(7, 11);
  let formatted = '';
  if (ddd) formatted += `(${ddd})`;
  if (firstDigit) formatted += firstDigit;
  if (part1) formatted += `${part1}`;
  if (part2) formatted += `-${part2}`;
  return formatted;
};

export default function TelaInfo() {
    const router = useRouter();
    const { clearCart } = useCart();
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState('')
    const [complemento, setComplemento] = useState('')
    const [loading, setLoading] = useState(false)
    const [orderData, setOrderData] = useState<any>(null)
    
    useEffect(() => {
        // Recuperar dados do pedido do sessionStorage
        const storedOrderData = sessionStorage.getItem('orderData')
        if (storedOrderData) {
            const data = JSON.parse(storedOrderData)
            setOrderData(data)
            setCpf(formatCpf(data.cpf))
        } else {
            // Se não tiver dados do pedido, voltar para o carrinho
            router.push('/TelaCarrinho')
        }
    }, [router])

    //handler cpf personalizado
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatCpf(rawValue);
      setCpf(formatted);
    };

    // Handler personalizado para o Telefone
    const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatTelefone(e.target.value);
      setTelefone(formatted);
    };

    // Verifica se todos os campos obrigatórios estão preenchidos corretamente
    const isFormValid = 
        nome.trim() !== '' &&
        cpf.replace(/\D/g, '').length === 11 &&
        telefone.replace(/\D/g, '').length === 11 &&
        endereco.trim() !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !orderData) {
            return;
        }

        setLoading(true);
        try {
            // Criar o pedido na API
            const result = await ApiService.placeOrder({
                cpf: cpf.replace(/\D/g, ''), // Remove formatação do CPF
                items: orderData.items
            });

            // Armazenar informações do pedido e cliente
            const orderInfo = {
                orderId: result.order_id,
                customerInfo: {
                    nome,
                    cpf,
                    telefone,
                    endereco,
                    complemento
                },
                status: result.status,
                total: result.total
            };

            sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo));
            
            // Limpar carrinho
            clearCart();
            
            // Redirecionar para confirmação de pagamento
            router.push('/ConfirmarPagamento');
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            alert('Erro ao criar pedido. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleVoltar = () => {
        router.push('/TelaCarrinho');
    };

    if (!orderData) {
        return <div>Carregando...</div>;
    }

    return(
        <>
        <Header isClient/>
        <form className='info-container' onSubmit={handleSubmit}>
            <p id='titulo'>Suas informações:</p>
            <div>
                <div className='inputbox'>
                <p>Nome:</p>
                <input name='nome' placeholder='Ex:Gustavo' value={nome} onChange={(e) => {setNome(e.target.value)}} required/>
            </div>
            <div className='inputbox'>
                <p>CPF:</p>
                <input name='CPF' placeholder='000.000.000-00' value={cpf} onChange={handleCpfChange} maxLength={14} required/>
            </div>
            <div className='inputbox'>
                <p>Telefone:</p>
                <input name='telefone' placeholder='(xx)9xxxx-xxxx' value={telefone} onChange={handleTelefoneChange} required/>
            </div>
            <div className='inputbox'>
                <p>Endereço:</p>
                <input name='endereco' placeholder='Ex:Av. Silas Munguba' value={endereco} onChange={(e) => {setEndereco(e.target.value)}} required/>
            </div>
            <div className='inputbox'>
                <p>Complemento:</p>
                <input name='complemento' placeholder='Ex:PPGCC' value={complemento} onChange={(e) => {setComplemento(e.target.value)}}/>
            </div>
            </div>
            <div className='buttons'>
                <Button 
                    text={loading ? 'Criando Pedido...' : 'Confirmar'} 
                    type='submit' 
                    tipo='btn-confirmarInfo -preto' 
                    disabled={!isFormValid || loading}
                />
                <Button 
                    text='Voltar' 
                    type='button' 
                    tipo='btn-voltarInfo -branco' 
                    onClick={handleVoltar}
                />
            </div>
        </form>
        </>
    )
}