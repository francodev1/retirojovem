'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PagamentoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState<string | boolean>(false);
  const [pixCopied, setPixCopied] = useState(false);

  const preco = 280.00;
  // String PIX que você forneceu
  const pixString = '00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z93NLRsiiBmx1Ecojwhpj5204000053039865802BR5912FONTE CHURCH6009SAO PAULO62080504mpis630456D4';

  const handleCheckout = async (valor: number, method: string = 'cartao') => {
    setLoading(true);
    setError('');
    try {
      // Pegar dados do localStorage (salvos durante inscrição)
      const inscricaoData = localStorage.getItem('inscricaoData');
      console.log('📍 inscricaoData do localStorage:', inscricaoData);
      
      if (!inscricaoData) {
        setError('Dados de inscrição não encontrados. Por favor, complete o formulário novamente.');
        setLoading(false);
        return;
      }

      const { nome, email, telefone } = JSON.parse(inscricaoData);
      console.log('✅ Dados extraídos:', { nome, email, telefone });

      const requestBody = {
        nomeInscrito: nome,
        email: email,
        telefone: telefone,
        valor: valor,
        method: method,
      };
      console.log('📤 Enviando para API:', requestBody);

      const response = await fetch('/api/pagamento/cartao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('📥 Status da resposta:', response.status, response.statusText);
      const data = await response.json();
      console.log('📥 Resposta da API:', data);

      if (data.init_point) {
        console.log('✅ init_point encontrado:', data.init_point);
        window.location.href = data.init_point;
      } else {
        const errorMsg = data.error || 'Erro ao processar pagamento';
        console.error('❌ Erro na resposta:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erro ao processar pagamento';
      console.error('❌ Exceção capturada:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixString);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 px-4">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Complete seu Pagamento
          </h1>
          <p className="text-blue-200 text-lg">
            Escolha a forma de pagamento mais conveniente
          </p>
        </motion.div>

        <motion.div
          className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-200 text-lg">Retiro Closer 2025</span>
            <span className="text-3xl font-bold text-blue-400">R$ {preco.toFixed(2)}</span>
          </div>
          <div className="border-t border-blue-400/20 pt-4 flex justify-between">
            <span className="text-blue-300">Subtotal</span>
            <span className="text-blue-300">R$ {preco.toFixed(2)}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* PIX Card */}
          <motion.div
            className="p-6 rounded-xl border-2 cursor-pointer transition-all bg-blue-900/20 border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-500/20"
            variants={itemVariants}
            onClick={() => setShowDetails('pix')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-3">💳</div>
            <h3 className="text-xl font-bold text-white mb-2">PIX</h3>
            <p className="text-blue-200 text-sm mb-3">Pagamento instantâneo e seguro</p>
            <div className="space-y-1">
              <div className="text-cyan-400 text-sm font-semibold">R$ {preco.toFixed(2)}</div>
              <div className="text-cyan-400 text-xs">À vista - Mais rápido ⚡</div>
            </div>
          </motion.div>

          {/* Cartão Card */}
          <motion.div
            className="p-6 rounded-xl border-2 cursor-pointer transition-all bg-blue-900/20 border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-500/20"
            variants={itemVariants}
            onClick={() => handleCheckout(preco, 'cartao')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-3">💳</div>
            <h3 className="text-xl font-bold text-white mb-2">Cartão Crédito</h3>
            <p className="text-blue-200 text-sm mb-3">Parcelado com juros</p>
            <div className="space-y-1">
              <div className="text-cyan-400 text-sm font-semibold">Até 12x</div>
              <div className="text-cyan-400 text-xs">Juros variável</div>
            </div>
            {loading && <p className="text-blue-300 text-xs mt-2">Processando...</p>}
          </motion.div>

          {/* Dinheiro Card */}
          <motion.div
            className="p-6 rounded-xl border-2 cursor-pointer transition-all bg-blue-900/20 border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-500/20"
            variants={itemVariants}
            onClick={() => setShowDetails('dinheiro')}
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-3xl mb-3">💵</div>
            <h3 className="text-xl font-bold text-white mb-2">Dinheiro</h3>
            <p className="text-blue-200 text-sm mb-3">Pagamento na chegada</p>
            <div className="space-y-1">
              <div className="text-cyan-400 text-sm font-semibold">R$ {preco.toFixed(2)}</div>
              <div className="text-cyan-400 text-xs">À vista - Sem juros ✓</div>
            </div>
          </motion.div>
        </div>

        {/* PIX Details */}
        {showDetails === 'pix' && (
          <motion.div
            className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Pagamento via PIX</h2>

            <div className="space-y-4">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                <p className="text-gray-800 font-semibold mb-4">Escaneie o código QR</p>
                <div className="bg-white p-4 rounded border-4 border-gray-400">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z93NLRsiiBmx1Ecojwhpj5204000053039865802BR5912FONTE CHURCH6009SAO PAULO62080504mpis630456D4"
                    alt="QR Code PIX"
                    width={200}
                    height={200}
                    className="border border-gray-300"
                  />
                </div>
              </div>

              {/* Chave PIX */}
              <div className="bg-blue-950/50 border border-green-400/30 rounded-lg p-6">
                <p className="text-white font-bold mb-3">Ou copie a chave PIX:</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={pixString}
                    readOnly
                    className="flex-1 bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 font-mono text-xs overflow-hidden"
                  />
                  <motion.button
                    onClick={copyPixKey}
                    className={`px-6 py-3 rounded font-semibold transition-all whitespace-nowrap ${
                      pixCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-cyan-500 text-white hover:bg-cyan-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pixCopied ? '✅ Copiado!' : 'Copiar'}
                  </motion.button>
                </div>
              </div>

              {/* Informações */}
              <div className="bg-blue-900/20 border border-blue-400/20 rounded-lg p-4">
                <p className="text-blue-300 text-sm">
                  ✓ Valor: R$ {preco.toFixed(2)}<br />
                  ✓ Comprovante não é necessário<br />
                  ✓ Inscrição confirmada assim que o pagamento for recebido
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dinheiro Details */}
        {showDetails === 'dinheiro' && (
          <motion.div
            className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Pagamento em Dinheiro</h2>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-950/50 border border-green-400/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h3 className="text-white font-bold mb-2">Local para Pagamento</h3>
                    <p className="text-blue-200 text-sm mb-1">
                      <strong>Fonte Church</strong>
                    </p>
                    <p className="text-blue-300 text-sm">Av Independência, 36</p>
                    <p className="text-blue-300 text-sm">Maringá, Alvorada</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 border border-green-400/30 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="text-white font-bold mb-2">Valor a pagar:</p>
                    <p className="text-2xl font-bold text-green-400">R$ {preco.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/50 border border-yellow-400/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  ⚠️ <strong>Importante:</strong> O pagamento em dinheiro deve ser realizado no local (Fonte Church) na data de chegada dos participantes.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-400/20 rounded-lg p-4">
                <p className="text-blue-300">
                  ✓ Não há juros adicionais<br />
                  ✓ Cota no evento garantida ao chegar<br />
                  ✓ Leve a confirmação impressa ou no celular
                </p>
              </div>
            </div>

            <motion.button
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✅ Confirmado - Levarei o Dinheiro
            </motion.button>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-red-900/30 border border-red-400/50 rounded-xl p-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-300">❌ {error}</p>
          </motion.div>
        )}

        <motion.div
          className="bg-blue-900/20 border border-blue-400/20 rounded-xl p-6"
          variants={itemVariants}
        >
          <h3 className="text-white font-bold mb-3">ℹ️ Informações Importantes</h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            <li>✓ Seu pagamento é seguro e protegido</li>
            <li>✓ Você receberá um email de confirmação</li>
            <li>✓ Dúvidas? Entre em contato com a coordenação</li>
            <li>✓ Cancelamentos devem ser feitos com antecedência</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
