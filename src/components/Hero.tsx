'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
        duration: 0.8,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating objects */}
      <motion.div
        className="absolute top-40 left-1/4 w-8 h-8 border-2 border-blue-400 rounded-lg opacity-40"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          x: mousePosition.x * 0.05,
          y: mousePosition.y * 0.05,
        }}
      />
      <motion.div
        className="absolute bottom-40 right-1/4 w-6 h-6 border-2 border-cyan-400 rounded-full opacity-40"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{ duration: 5, delay: 1, repeat: Infinity, repeatType: "loop" }}
        style={{
          x: mousePosition.x * 0.03,
          y: mousePosition.y * 0.03,
        }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mb-6 inline-block"
          variants={itemVariants}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/50 backdrop-blur-md">
            <span className="text-cyan-300 text-sm font-semibold">✨ Evento Exclusivo</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          variants={itemVariants}
        >
          Retiro <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Closer</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Uma experiência transformadora para jovens cristãos. Venha crescer, conectar e descobrir seu propósito.
        </motion.p>

        <motion.p
          className="text-base md:text-lg text-blue-300/80 mb-2 max-w-2xl mx-auto italic"
          variants={itemVariants}
        >
          "Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente" - Romanos 12:2
        </motion.p>

        <motion.p
          className="text-sm md:text-base text-blue-300/70 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Closer significa "mais perto" - um momento para se aproximar de Deus e de si mesmo, crescendo em comunhão genuína.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.a
            href="#inscricao"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Inscreva-se Agora
          </motion.a>
          <motion.a
            href="#sobre"
            className="px-8 py-4 border-2 border-blue-400 text-blue-300 font-bold rounded-lg hover:bg-blue-500/20 transition-all duration-300 block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Saiba Mais
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">20 Fev</div>
            <div className="text-sm text-blue-200">Início</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">3</div>
            <div className="text-sm text-blue-200">Dias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">180</div>
            <div className="text-sm text-blue-200">Vagas</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-blue-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
