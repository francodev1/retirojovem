'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const VALOR_INSCRICAO = 296;
const VALOR_PIX = 289;
const PIX_ESTATICO = '00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z93NLRsiiBmx1Ecojwhpj5204000053039865802BR5912FONTE CHURCH6009SAO PAULO62080504mpis630456D4';

export default function PagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({ nome: '', email: '', telefone: '' });

  useEffect(() => {
    const inscricaoData = localStorage.getItem('inscricaoData');
    if (inscricaoData) {
      const data = JSON.parse(inscricaoData);
      setUserData(data);
    }
  }, []);

  const handlePixPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 Criando PIX com MercadoPago...');
      const response = await fetch('/api/pagamento/cartao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeInscrito: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          valor: VALOR_PIX,
          method: 'pix',
        }),
      });

      const data = await response.json();
      console.log('✅ Resposta PIX:', data);
      
      if (data.success && data.init_point) {
        console.log('🟢 Redirecionando para MercadoPago PIX...');
        window.location.href = data.init_point;
      } else {
        setError(data.error || 'Erro ao criar PIX');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    }
    
    setLoading(false);
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔵 Criando Checkout MercadoPago...');
      const response = await fetch('/api/pagamento/cartao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeInscrito: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          valor: VALOR_INSCRICAO,
          method: 'cartao',
        }),
      });

      const data = await response.json();
      console.log('✅ Resposta Cartão:', data);
      
      if (data.success && data.init_point) {
        console.log('🟢 Redirecionando para MercadoPago Checkout...');
        window.location.href = data.init_point;
      } else {
        setError(data.error || 'Erro ao criar sessão de pagamento');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    }
    
    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Complete seu Pagamento
          </h1>
          <p className="text-gray-400">Escolha a forma de pagamento mais conveniente</p>
        </motion.div>

        {/* Resumo do pedido */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-950/50 border border-blue-400/30 rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-300">Retiro Closer 2026</h2>
            <span className="text-3xl font-bold text-blue-400">R$ 296.00</span>
          </div>
          <div className="border-t border-blue-400/20 pt-4 flex justify-between">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">R$ 296.00</span>
          </div>
        </motion.div>

        {/* Métodos de pagamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* PIX Estático */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-orange-900/40 to-orange-800/40 border-2 border-orange-400/30 rounded-xl p-6 hover:border-orange-400/60 transition-all cursor-pointer"
          >
            <div className="text-5xl mb-4">📲</div>
            <h3 className="text-2xl font-bold text-orange-300 mb-2">PIX</h3>
            <p className="text-gray-400 text-sm mb-4">Pagamento instantâneo e seguro</p>
            <p className="text-orange-400 font-bold text-lg mb-4">R$ {VALOR_PIX},00</p>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(PIX_ESTATICO)}`}
              alt="QR Code PIX" 
              className="w-48 h-48 mx-auto rounded-lg bg-white p-2"
            />
          </motion.div>

          {/* Cartão Crédito */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCardPayment}
            disabled={loading}
            className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border-2 border-blue-400/30 rounded-xl p-6 hover:border-blue-400/60 transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💳</div>
            <h3 className="text-2xl font-bold text-blue-300 mb-2">Cartão Crédito</h3>
            <p className="text-gray-400 text-sm mb-4">Parcelado com juros</p>
            <p className="text-blue-400 font-bold text-lg">R$ {VALOR_INSCRICAO},00</p>
            <p className="text-gray-500 text-xs mt-2">Até 12x no cartão</p>
          </motion.button>
        </div>

        

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-center mb-8"
          >
            ❌ {error}
          </motion.div>
        )}

        {/* Info importante */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-950/30 border border-blue-400/20 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-blue-300 mb-3">ℹ️ Informações Importantes</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ Seu pagamento é seguro e protegido pelo MercadoPago</li>
            <li>✓ Você receberá um email de confirmação</li>
            <li>✓ Dúvidas? Contato: 51 98567-0124</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
