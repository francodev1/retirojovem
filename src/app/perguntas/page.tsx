'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

export default function PerguntasPage() {
  const [pergunta, setPergunta] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pergunta.trim()) {
      setStatus('error');
      setMessage('Por favor, digite sua pergunta');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await axios.post('/api/perguntas', { pergunta });
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Pergunta enviada com sucesso! 🙏');
        setPergunta('');
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Erro ao enviar pergunta');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao enviar pergunta. Tente novamente.');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Perguntas Anônimas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-lg"
            >
              Faça sua pergunta de forma anônima para os pastores
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pergunta" className="block text-white font-semibold mb-2">
                Sua Pergunta
              </label>
              <textarea
                id="pergunta"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                placeholder="Digite sua pergunta aqui..."
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent min-h-[200px] resize-none"
                maxLength={1000}
                disabled={loading}
              />
              <div className="mt-2 text-right">
                <span className="text-white/60 text-sm">
                  {pergunta.length}/1000 caracteres
                </span>
              </div>
            </div>

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200"
              >
                {message}
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-200"
              >
                {message}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar Pergunta'}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg"
          >
            <p className="text-white/80 text-sm">
              ℹ️ <strong>Importante:</strong> Suas perguntas são completamente anônimas. 
              Os pastores receberão apenas o conteúdo da pergunta, sem identificação do autor.
            </p>
          </motion.div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/70 hover:text-white transition-colors underline"
            >
              ← Voltar para a página inicial
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
