'use client';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import { OrderResponse } from '@/types';

interface Pedido extends OrderResponse {
  created_at?: string;
}

export default function CozinhaPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoPedidoAlert, setNovoPedidoAlert] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const adicionarPedidoTeste = () => {
    const novoId = `test-${Date.now()}`;
    const bases = ["Café Expresso", "Cappuccino", "Latte", "Americano"];
    const addonsDisponiveis = ["Canela", "LeiteDeAveia", "SemAcucar"];
    const novoPedido = {
      id: novoId,
      cpf: `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
      items: [
        {
          base: bases[Math.floor(Math.random() * bases.length)],
          addons: Math.random() > 0.5 ? [addonsDisponiveis[Math.floor(Math.random() * addonsDisponiveis.length)]] : [],
          quantity: Math.floor(Math.random() * 3) + 1
        }
      ],
      status: "RECEBIDO",
      total_price: Math.random() * 30 + 10,
      created_at: new Date().toISOString()
    };

    setPedidos(prev => [novoPedido, ...prev]);
    setNovoPedidoAlert(true);
    setTimeout(() => setNovoPedidoAlert(false), 3000);
    
    setNotifications(prev => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: Novo pedido adicionado #${novoId.slice(-8)} (TESTE)`
    ]);
  };

  useEffect(() => {
    console.log('Cozinha: Iniciando carregamento inicial...');
    carregarPedidos();
    
    // Polling para atualizações a cada 3 segundos (mais frequente)
    const interval = setInterval(() => {
      console.log('Cozinha: Atualizando pedidos automaticamente...');
      carregarPedidos();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      console.log('Cozinha: Carregando pedidos...');
      
      // Primeiro tenta buscar todos os pedidos via ApiService
      try {
        const data = await ApiService.getAllOrders();
        console.log('Cozinha: Pedidos recebidos via ApiService:', data.length, 'pedidos');
        console.log('Cozinha: Dados completos:', data);
        
        // Converter OrderResponse para Pedido adicionando created_at
        const pedidosComData = data.map(order => ({
          ...order,
          created_at: new Date().toISOString() // Adiciona timestamp atual
        }));
        
        // Filtrar apenas pedidos que a cozinha precisa ver (incluir ENTREGUE para acompanhamento)
        const pedidosAtivos = pedidosComData.filter((p: Pedido) => 
          ['RECEBIDO', 'EM PREPARO', 'PRONTO', 'ENTREGUE'].includes(p.status)
        );
        
        console.log('Cozinha: Pedidos ativos filtrados:', pedidosAtivos.length);
        console.log('Cozinha: Status dos pedidos:', pedidosAtivos.map(p => `${p.id.slice(-8)}: ${p.status}`));
        
        // Verificar se há novos pedidos
        if (pedidos.length > 0 && pedidosAtivos.length > pedidos.length) {
          setNovoPedidoAlert(true);
          setTimeout(() => setNovoPedidoAlert(false), 3000);
          console.log('Cozinha: Novo pedido detectado!');
        }
        
        setPedidos(pedidosAtivos);
        return;
      } catch (apiError) {
        console.log('Cozinha: ApiService falhou, tentando fallback...', apiError);
      }
      
      // Fallback: buscar pedidos por CPFs que podem ter feito pedidos
      const cpfsParaBuscar = [
        "11144477735", "12345678901", "98765432109", 
        "11111111111", "22222222222", "33333333333"
      ];
      
      const todosPedidos: Pedido[] = [];
      for (const cpf of cpfsParaBuscar) {
        try {
          const pedidosCpf = await ApiService.getCustomerOrders(cpf);
          if (pedidosCpf && Array.isArray(pedidosCpf)) {
            // Converter para Pedido adicionando created_at
            const pedidosComData = pedidosCpf.map(order => ({
              ...order,
              created_at: new Date().toISOString()
            }));
            todosPedidos.push(...pedidosComData);
          }
        } catch (error) {
          // Ignora erros para CPFs inexistentes
        }
      }
      
      // Filtrar apenas pedidos que a cozinha precisa ver (incluir ENTREGUE para acompanhamento)
      const pedidosAtivos = todosPedidos.filter((p: Pedido) => 
        ['RECEBIDO', 'EM PREPARO', 'PRONTO', 'ENTREGUE'].includes(p.status)
      );
      
      // Verificar se há novos pedidos
      if (pedidos.length > 0 && pedidosAtivos.length > pedidos.length) {
        setNovoPedidoAlert(true);
        setTimeout(() => setNovoPedidoAlert(false), 3000);
      }
      
      setPedidos(pedidosAtivos);
      console.log('Pedidos recebidos via fallback:', pedidosAtivos);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      // Aguardar pedidos reais
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const avancarEstado = async (pedidoId: string) => {
    try {
      const pedido = pedidos.find(p => p.id === pedidoId);
      if (!pedido) return;

      console.log(`Cozinha: Avançando status do pedido ${pedidoId.slice(-8)} de ${pedido.status}`);

      // Se for um pedido de teste, simular a atualização
      if (pedidoId.startsWith('test-')) {
        let novoStatus = '';
        switch (pedido.status) {
          case 'RECEBIDO': novoStatus = 'EM PREPARO'; break;
          case 'EM PREPARO': novoStatus = 'PRONTO'; break;
          case 'PRONTO': novoStatus = 'ENTREGUE'; break;
          default: return;
        }
        
        // Atualizar localmente para pedidos de teste
        setPedidos(prev => prev.map(p => 
          p.id === pedidoId 
            ? { ...p, status: novoStatus }
            : p
        ).filter(p => p.status !== 'ENTREGUE')); // Remover entregues
        
        setNotifications(prev => [
          ...prev.slice(-4),
          `${new Date().toLocaleTimeString()}: Pedido #${pedidoId.slice(-8)} → ${novoStatus} (TESTE)`
        ]);
        return;
      }

      // Para pedidos reais, usar o método correto do ApiService
      const result = await ApiService.advanceOrderStatus(pedidoId);
      console.log(`Cozinha: Status atualizado para ${result.status}`);
      
      // Atualizar a lista imediatamente
      await carregarPedidos();
      
      setNotifications(prev => [
        ...prev.slice(-4), // Manter apenas os últimos 5
        `${new Date().toLocaleTimeString()}: Pedido #${pedidoId.slice(-8)} → ${result.status}`
      ]);
    } catch (error) {
      console.error('Cozinha: Erro ao atualizar status:', error);
      setNotifications(prev => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: Erro ao atualizar pedido #${pedidoId.slice(-8)}: ${error}`
      ]);
    }
  };

  const cancelarPedido = async (pedidoId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;

    try {
      // Se for um pedido de teste, simular o cancelamento
      if (pedidoId.startsWith('test-')) {
        setPedidos(prev => prev.filter(p => p.id !== pedidoId));
        setNotifications(prev => [
          ...prev.slice(-4),
          `${new Date().toLocaleTimeString()}: Pedido #${pedidoId.slice(-8)} cancelado (TESTE)`
        ]);
        return;
      }

      const response = await fetch(`/api/orders/${pedidoId}/cancel`, {
        method: 'POST'
      });

      if (response.ok) {
        carregarPedidos();
        
        setNotifications(prev => [
          ...prev.slice(-4),
          `${new Date().toLocaleTimeString()}: Pedido #${pedidoId.slice(-8)} cancelado`
        ]);
      } else {
        const errorData = await response.text();
        console.error('Erro da API:', errorData);
        setNotifications(prev => [
          ...prev.slice(-4),
          `${new Date().toLocaleTimeString()}: Erro ao cancelar pedido #${pedidoId.slice(-8)}: ${errorData}`
        ]);
      }
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      setNotifications(prev => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: Erro de conexão ao cancelar pedido #${pedidoId.slice(-8)}`
      ]);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      'RECEBIDO': 'bg-yellow-500',
      'EM PREPARO': 'bg-blue-500',
      'PRONTO': 'bg-green-500',
      'ENTREGUE': 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getTempoEspera = (createdAt: string): string => {
    const agora = new Date();
    const criado = new Date(createdAt);
    const diffMinutos = Math.floor((agora.getTime() - criado.getTime()) / 60000);
    
    if (diffMinutos < 1) return 'Agora mesmo';
    if (diffMinutos === 1) return '1 minuto';
    return `${diffMinutos} minutos`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Carregando pedidos da cozinha...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Alerta de novo pedido */}
      {novoPedidoAlert && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 z-50 animate-pulse">
          <h2 className="text-2xl font-bold">NOVO PEDIDO RECEBIDO!</h2>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">
              COZINHA - DOSE DA BRABA
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={carregarPedidos}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Atualizar ({pedidos.length})
              </button>
              <button 
                onClick={adicionarPedidoTeste}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Simular Pedido
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-400">Pedidos Ativos</div>
                <div className="text-2xl font-bold">{pedidos.length}</div>
              </div>
            </div>
          </div>

          {/* Notificações */}
          {notifications.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Últimas Atividades</h3>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {notifications.slice(-3).reverse().map((notification, index) => (
                  <div key={index} className="text-sm text-gray-300 p-2 bg-gray-600 rounded">
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Pedidos */}
          <div className="grid gap-4">
            {pedidos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">Vazio</div>
                <h3 className="text-2xl">Nenhum pedido na fila</h3>
                <p>Aguardando novos pedidos...</p>
              </div>
            ) : (
              pedidos
                .sort((a, b) => {
                  // Priorizar por status e depois por tempo
                  const statusPriority = { 'RECEBIDO': 1, 'EM PREPARO': 2, 'PRONTO': 3, 'ENTREGUE': 4 };
                  const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 5;
                  const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 5;
                  
                  if (aPriority !== bPriority) return aPriority - bPriority;
                  return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
                })
                .map((pedido) => (
                  <div 
                    key={pedido.id} 
                    className={`border-2 rounded-lg p-6 transition-all ${
                      pedido.status === 'RECEBIDO' ? 'border-yellow-500 bg-yellow-900/20 animate-pulse' :
                      pedido.status === 'EM PREPARO' ? 'border-blue-500 bg-blue-900/20' :
                      pedido.status === 'PRONTO' ? 'border-green-500 bg-green-900/20' :
                      pedido.status === 'ENTREGUE' ? 'border-gray-500 bg-gray-900/20 opacity-75' :
                      'border-gray-500 bg-gray-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-2xl">Pedido #{pedido.id.slice(-8)}</h3>
                        <p className="text-xl text-gray-300">CPF: {pedido.cpf}</p>
                        <p className="text-gray-400">
                          Há {getTempoEspera(pedido.created_at || '')}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-white font-bold text-lg ${getStatusColor(pedido.status)}`}>
                          {pedido.status === 'EM PREPARO' ? 'EM PREPARO' : pedido.status}
                        </span>
                        <p className="text-xl font-bold text-green-400 mt-2">
                          R$ {pedido.total_price?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Itens do Pedido */}
                    <div className="bg-gray-700 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-lg mb-3">Itens para Preparar:</h4>
                      {pedido.items?.map((item, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-600 last:border-b-0">
                          <span className="text-lg">
                            <strong>1x</strong> {item.base}
                          </span>
                          <span className="text-gray-300">
                            {item.addons && item.addons.length > 0 && (
                              <span className="text-yellow-300">
                                +{item.addons.map((addon: string) => {
                                  switch(addon) {
                                    case 'LeiteDeAveia': return 'Leite de Aveia';
                                    case 'Canela': return 'Canela';
                                    case 'SemAcucar': return 'Sem Açúcar';
                                    default: return addon;
                                  }
                                }).join(', ')}
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Botões de Ação - Pedidos entregues não tem botões */}
                    <div className="flex gap-3">
                      {pedido.status === 'ENTREGUE' ? (
                        <div className="flex-1 bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-bold text-lg text-center">
                          ✓ PEDIDO ENTREGUE
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => avancarEstado(pedido.id)}
                            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold text-lg"
                          >
                            {pedido.status === 'RECEBIDO' && 'INICIAR PREPARO'}
                            {pedido.status === 'EM PREPARO' && 'MARCAR COMO PRONTO'}
                            {pedido.status === 'PRONTO' && 'ENTREGAR'}
                          </button>
                          
                          {pedido.status === 'RECEBIDO' && (
                            <button
                              onClick={() => cancelarPedido(pedido.id)}
                              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-bold"
                            >
                              CANCELAR
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
