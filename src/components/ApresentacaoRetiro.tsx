'use client';

import { motion } from 'framer-motion';

export default function ApresentacaoRetiro() {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="sobre" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 px-4">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sobre o Retiro <span className="text-cyan-400">Closer</span>
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Uma experiência de 3 dias inesquecível para crescimento espiritual e conexão comunitária
          </p>
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Data */}
          <motion.div
            className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 hover:border-blue-400/50 transition-all"
            variants={cardVariants}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-3">Data</h3>
            <p className="text-blue-200 text-lg font-semibold mb-2">20 - 22 de Fevereiro</p>
            <div className="space-y-2 text-blue-300 text-sm">
              <p>✓ Sexta-feira a Domingo</p>
              <p>✓ Check-in: Sexta às 18h</p>
              <p>✓ Check-out: Domingo às 17h</p>
            </div>
          </motion.div>

          {/* Vagas */}
          <motion.div
            className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 hover:border-blue-400/50 transition-all"
            variants={cardVariants}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-white mb-3">Vagas Disponíveis</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold text-cyan-400">100</span>
              <span className="text-blue-300">vagas totais</span>
            </div>
            <div className="w-full bg-blue-950/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full"
                initial={{ width: 0 }}
                whileInView={{ width: '45%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <p className="text-blue-300 text-xs mt-2">Muitas vagas ainda disponíveis!</p>
          </motion.div>

          {/* Local */}
          <motion.div
            className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 hover:border-blue-400/50 transition-all"
            variants={cardVariants}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-white mb-3">Local</h3>
            <p className="text-blue-200 font-semibold mb-2">Quintal dos Belgas</p>
            <p className="text-blue-300 text-sm mb-3">RS 020 - Parada 89</p>
            <p className="text-blue-300 text-sm font-semibold">Gravataí, RS</p>
          </motion.div>
        </div>

        {/* Coordenação */}
        <motion.div
          className="bg-gradient-to-r from-blue-900/40 via-blue-900/30 to-blue-900/40 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">👥</span>
            <h3 className="text-2xl font-bold text-white">Coordenação Geral</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                nome: 'Lucas Franco',
                cargo: 'Coordenador',
                icon: '🎯',
              },
              {
                nome: 'Mauricio Silva',
                cargo: 'Coordenador',
                icon: '🎯',
              },
              {
                nome: 'Elieser Borges',
                cargo: 'Coordenador',
                icon: '🎯',
              },
            ].map((coordenador, index) => (
              <motion.div
                key={index}
                className="bg-blue-950/50 border border-blue-400/20 rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-3xl mb-2">{coordenador.icon}</div>
                <p className="text-white font-bold text-lg">{coordenador.nome}</p>
                <p className="text-blue-400 text-sm">{coordenador.cargo}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-blue-200">
              <span className="font-bold">Em caso de dúvidas,</span> dirija-se à Coordenação Geral
            </p>
          </motion.div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-blue-900/20 border border-cyan-400/20 rounded-xl p-6">
            <h4 className="text-lg font-bold text-cyan-400 mb-3">✨ O que te espera</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>✓ Momentos de louvor e comunhão no Espírito</li>
              <li>✓ Mensagens transformadoras da Palavra</li>
              <li>✓ Conexão genuína com a comunidade cristã</li>
              <li>✓ Atividades incríveis e diversas</li>
              <li>✓ Tempo de busca pela face de Deus</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-400/20 rounded-xl p-6">
            <h4 className="text-lg font-bold text-blue-400 mb-3">🎒 Prepare-se para</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>✓ Crescimento real com Jesus Cristo</li>
              <li>✓ Amizades que vão durar para vida toda</li>
              <li>✓ Uma experiência que vai te transformar</li>
              <li>✓ Memórias abençoadas e marcantes</li>
              <li>✓ Retorno com o coração renovado em Deus</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
