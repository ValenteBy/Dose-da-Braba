import { MenuItem, PlaceOrderDTO, OrderResponse, PaymentDTO, PaymentResponse } from '@/types';

const API_BASE_URL = '/api';

export class ApiService {
  static async getMenu(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/menu`);
      if (!response.ok) {
        throw new Error('Erro ao buscar menu');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar menu:', error);
      throw error;
    }
  }

  static async placeOrder(orderData: PlaceOrderDTO): Promise<{ order_id: string; status: string; total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar pedido');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  }

  static async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Pedido não encontrado');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    }
  }

  static async payOrder(orderId: string, paymentData: PaymentDTO): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar pagamento');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      throw error;
    }
  }

  static async cancelOrder(orderId: string): Promise<{ order_id: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao cancelar pedido');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      throw error;
    }
  }

  // Usado pela cozinha para avançar status (RECEBIDO -> EM PREPARO -> PRONTO -> ENTREGUE)
  static async advanceOrderStatus(orderId: string): Promise<{ order_id: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao atualizar status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  static async getAllOrders(): Promise<OrderResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) {
        throw new Error('Erro ao buscar todos os pedidos');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar todos os pedidos:', error);
      throw error;
    }
  }

  static async getCustomerOrders(cpf: string): Promise<OrderResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${cpf}/orders`);
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos do cliente');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar pedidos do cliente:', error);
      throw error;
    }
  }

  static async getCustomerNotifications(cpf: string): Promise<{ notifications: string[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${cpf}/notifications`);
      if (!response.ok) {
        throw new Error('Erro ao buscar notificações');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }
}
