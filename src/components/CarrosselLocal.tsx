'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CarrosselLocal() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Array de imagens do local
  const slides = [
    {
      src: '/assets/foto02.jpg',
      title: 'Bem-vindo ao Quintal',
      desc: 'Espaço acolhedor para sua transformação',
    },
    {
      src: '/assets/foto03.jpg',
      title: 'Área de Convivência',
      desc: 'Local perfeito para conexões genuínas',
    },
    {
      src: '/assets/foto04.jpg',
      title: 'Campo Futebol',
      desc: 'Acomodações confortáveis e acolhedoras',
    },
    {
      src: '/assets/foto05.jpg',
      title: 'Lazer e Diversão',
      desc: 'Diversão em comunhão',
    },
    {
      src: '/assets/Foto10.jpg',
      title: 'Mais Diversão',
      desc: 'Ambiente tranquilo e inspirador',
    },
    {
      src: '/assets/foto13.jpg',
      title: 'Espaços Amplos',
      desc: 'Encontros com qualidade e segurança',
    },
    {
      src: '/assets/foto14.jpg',
      title: 'Infraestrutura',
      desc: 'Tudo o que você precisa para crescer',
    },
    {
      src: '/assets/foto15.jpg',
      title: 'Comunidade',
      desc: 'Viva uma experiência transformadora',
    },
    {
      src: '/assets/foto20.jpg',
      title: 'Momentos Especiais',
      desc: 'Memórias que você nunca esquecerá',
    },
    {
      src: '/assets/foto22.jpg',
      title: 'Conexão Real',
      desc: 'Crescimento espiritual genuíno',
    },
    {
      src: '/assets/foto23.jpg',
      title: 'Seu Lugar Espera',
      desc: 'Venha fazer parte dessa família',
    },
  ];

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <motion.div
        className="max-w-6xl mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conheça o Local
          </h2>
          <p className="text-blue-200 text-lg">
            Quintal dos Belgas - Um espaço perfeito para sua transformação
          </p>
        </motion.div>

        {/* Carrosel Container */}
        <div className="relative h-96 md:h-[500px] mb-8 rounded-2xl overflow-hidden">
          {/* Slides */}
          <div className="relative w-full h-full">
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                className="absolute w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentSlide ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Imagem */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center relative">
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay escuro */}
                  <div className="absolute inset-0 bg-black/30" />
                </div>

                {/* Info do slide */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {slide.title}
                  </h3>
                  <p className="text-blue-200 text-lg">{slide.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Botões Navegação */}
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
          >
            ←
          </motion.button>

          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
          >
            →
          </motion.button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                className={`rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-cyan-400 w-8 h-3'
                    : 'bg-white/40 w-3 h-3 hover:bg-white/60'
                }`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🏠', title: 'Confortável', desc: 'Acomodações bem cuidadas e limpas' },
            { icon: '🍽️', title: 'Alimentação', desc: 'Refeições preparadas com carinho' },
            { icon: '🌳', title: 'Natureza', desc: 'Ambiente tranquilo e inspirador' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-blue-900/30 border border-blue-400/20 rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-blue-200 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Auto-play indicator */}
        <motion.div
          className="text-center mt-8 text-blue-300 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {autoPlay ? '🎬 Carrossel automático ativado' : '⏸️ Navegação manual'}
        </motion.div>
      </motion.div>
    </section>
  );
}
