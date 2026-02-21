'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Pergunta {
  id: number;
  data: string;
  pergunta: string;
  status: string;
  resposta: string;
}

export default function RespostasPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'todas' | 'pendentes' | 'respondidas'>('todas');

  useEffect(() => {
    fetchPerguntas();
  }, []);

  const fetchPerguntas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/perguntas');
      
      if (response.data.success) {
        setPerguntas(response.data.perguntas);
      } else {
        setError('Erro ao carregar perguntas');
      }
    } catch (err) {
      setError('Erro ao carregar perguntas');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const perguntasFiltradas = perguntas.filter((p) => {
    if (filter === 'pendentes') return p.status === 'Pendente';
    if (filter === 'respondidas') return p.status === 'Respondida';
    return true;
  });

  const pendentesCount = perguntas.filter((p) => p.status === 'Pendente').length;
  const respondidasCount = perguntas.filter((p) => p.status === 'Respondida').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📋 Painel de Perguntas
          </h1>
          <p className="text-white/80 text-lg">
            Visualize e gerencie as perguntas enviadas pelos participantes
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
          >
            <div className="text-white/60 text-sm mb-2">Total de Perguntas</div>
            <div className="text-4xl font-bold text-white">{perguntas.length}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-yellow-500/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30"
          >
            <div className="text-yellow-200/80 text-sm mb-2">Pendentes</div>
            <div className="text-4xl font-bold text-yellow-200">{pendentesCount}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-green-500/10 backdrop-blur-lg rounded-xl p-6 border border-green-500/30"
          >
            <div className="text-green-200/80 text-sm mb-2">Respondidas</div>
            <div className="text-4xl font-bold text-green-200">{respondidasCount}</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <button
            onClick={() => setFilter('todas')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'todas'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Todas ({perguntas.length})
          </button>
          <button
            onClick={() => setFilter('pendentes')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'pendentes'
                ? 'bg-yellow-500 text-yellow-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Pendentes ({pendentesCount})
          </button>
          <button
            onClick={() => setFilter('respondidas')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'respondidas'
                ? 'bg-green-500 text-green-900'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Respondidas ({respondidasCount})
          </button>

          <button
            onClick={fetchPerguntas}
            disabled={loading}
            className="ml-auto px-6 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            {loading ? '🔄 Carregando...' : '🔄 Atualizar'}
          </button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">Carregando perguntas...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-red-200">
            {error}
          </div>
        ) : perguntasFiltradas.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-white text-xl">Nenhuma pergunta encontrada</div>
          </div>
        ) : (
          <div className="space-y-4">
            {perguntasFiltradas.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-white/30">#{p.id}</div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'Respondida'
                          ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30'
                      }`}
                    >
                      {p.status}
                    </div>
                  </div>
                  <div className="text-white/50 text-sm">{p.data}</div>
                </div>

                <div className="mb-4">
                  <div className="text-white/60 text-xs font-semibold mb-2">PERGUNTA:</div>
                  <div className="text-white text-lg leading-relaxed">{p.pergunta}</div>
                </div>

                {p.resposta && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-green-200/60 text-xs font-semibold mb-2">
                      RESPOSTA:
                    </div>
                    <div className="text-green-200 leading-relaxed">{p.resposta}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-white/70 hover:text-white transition-colors underline"
          >
            ← Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
