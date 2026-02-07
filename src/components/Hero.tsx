'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        className="absolute bottom-20 right-10 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        className="absolute top-40 left-1/4 w-8 h-8 border-2 border-orange-400 rounded-lg opacity-40"
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
        className="absolute bottom-40 right-1/4 w-6 h-6 border-2 border-amber-400 rounded-full opacity-40"
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
        {/* Citação Bíblica */}
       
        

        {/* Main Description */}
        <motion.p
          className="text-lg md:text-xl text-orange-100 mb-8 leading-relaxed font-medium max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Uma experiência transformadora para jovens cristãos. Venha ficar mais perto de Deus, conectar em comunhão genuína e descobrir seu propósito no Espírito Santo.
        </motion.p>

        {/* Logo - Centered Below */}
        <motion.div
          className="mb-8 inline-block"
          variants={itemVariants}
        >
          <Image
            src="/assets/closer-logo.v4.png"
            alt="Closer Logo"
            width={380}
            height={150}
            priority
            className="h-auto w-auto drop-shadow-2xl"
          />
        </motion.div>

         <motion.p
          className="text-base md:text-lg text-orange-300/90 italic mb-3 leading-relaxed"
          variants={itemVariants}
        >
          "Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da sua mente" - Romanos 12:2
        </motion.p>

        {/* Descrição do Closer */}
        <motion.p
          className="text-sm md:text-base text-orange-300/70 mb-8 leading-relaxed"
          variants={itemVariants}
        >
          Closer significa "mais perto" - um momento para você se aproximar de Jesus, do Pai Celestial e do Espírito Santo, crescendo em comunhão genuína com a galera.
        </motion.p>


        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          variants={itemVariants}
        >
          <motion.a
            href="#inscricao"
            className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Inscreva-se Agora
          </motion.a>
          <motion.a
            href="#sobre"
            className="px-10 py-4 border-2 border-orange-400 text-orange-300 font-bold text-lg rounded-lg hover:bg-orange-500/20 transition-all duration-300 block text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Saiba Mais
          </motion.a>
        </motion.div>

        {/* Key Info */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">20 Fev</div>
            <div className="text-sm text-orange-200">Início</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">3</div>
            <div className="text-sm text-orange-200">Dias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">100</div>
            <div className="text-sm text-orange-200">Vagas</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-orange-400 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-orange-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
