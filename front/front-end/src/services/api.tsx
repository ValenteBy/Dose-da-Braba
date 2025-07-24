import axios from 'axios'
import { PlaceOrderDTO, OrderResponse, PayDTO, ProductModel, ClienteNotification } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const orderService = {
  // Criar pedido
  createOrder: async (orderData: PlaceOrderDTO): Promise<{ order_id: string; status: string; total: number }> => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Buscar pedido por ID
  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Histórico de pedidos do cliente
  getCustomerOrders: async (cpf: string): Promise<OrderResponse[]> => {
    const response = await api.get(`/customers/${cpf}/orders`)
    return response.data
  },

  // Cancelar pedido
  cancelOrder: async (id: string): Promise<{ order_id: string; status: string }> => {
    const response = await api.post(`/orders/${id}/cancel`)
    return response.data
  },

  // Avançar status do pedido (para admin/cozinha)
  updateOrderStatus: async (id: string): Promise<{ order_id: string; status: string }> => {
    const response = await api.patch(`/orders/${id}/status`)
    return response.data
  },

  // Pagar pedido
  payOrder: async (id: string, paymentData: PayDTO): Promise<any> => {
    const response = await api.post(`/orders/${id}/pay`, paymentData)
    return response.data
  },
}

export const menuService = {
  // Listar menu
  getMenu: async (): Promise<ProductModel[]> => {
    const response = await api.get('/menu')
    return response.data
  },
}

export const customerService = {
  // Notificações do cliente
  getNotifications: async (cpf: string): Promise<{ notifications: ClienteNotification[] }> => {
    const response = await api.get(`/customers/${cpf}/notifications`)
    return response.data
  },
}

export default api