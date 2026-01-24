'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { validateFormData } from '@/lib/validation';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  idade: string;
  alergia: string;
  beliche: string;
  participouAntes: string;
  comoConheceu: string;
  tipoPagamento: string;
}

export default function InscricaoForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    idade: '',
    alergia: '',
    beliche: '',
    participouAntes: '',
    comoConheceu: '',
    tipoPagamento: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras e formatação por campo
    switch (name) {
      case 'nome':
        // Apenas letras e espaços
        formattedValue = value.replace(/[^a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ\s]/g, '');
        break;

      case 'email':
        // Remove espaços
        formattedValue = value.replace(/\s/g, '').toLowerCase();
        break;

      case 'telefone':
        // Remove tudo que não é número
        const phoneDigits = value.replace(/\D/g, '');
        // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (phoneDigits.length <= 10) {
          formattedValue = phoneDigits
            .replace(/(\d{2})/, '($1) ')
            .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
          formattedValue = phoneDigits
            .slice(0, 11)
            .replace(/(\d{2})/, '($1) ')
            .replace(/(\d{5})(\d)/, '$1-$2');
        }
        break;

      case 'idade':
        // Apenas números, máximo 3
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
        break;

      case 'alergia':
        // Apenas letras, espaços e vírgulas
        formattedValue = value.replace(/[^a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ\s,]/g, '');
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrors({});

    // Validar localmente primeiro
    const validation = validateFormData(formData);

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((error) => {
        // Mapear erros para campos específicos
        if (error.includes('Nome')) errorMap.nome = error;
        else if (error.includes('Email')) errorMap.email = error;
        else if (error.includes('Telefone')) errorMap.telefone = error;
        else if (error.includes('Idade')) errorMap.idade = error;
        else if (error.includes('Beliche')) errorMap.beliche = error;
        else if (error.includes('experiência')) errorMap.participouAntes = error;
        else if (error.includes('Como soube')) errorMap.comoConheceu = error;
        else if (error.includes('Tipo de pagamento')) errorMap.tipoPagamento = error;
      });
      setErrors(errorMap);
      setStatus('error');
      setMessage('Preencha todos os campos corretamente');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/inscricao', formData);

      if (response.status === 200) {
        setStatus('success');
        setMessage('✅ Inscrição enviada com sucesso! Você será redirecionado para o pagamento.');
        
        // Salvar dados no localStorage para recuperar na página de pagamento
        if (typeof window !== 'undefined') {
          localStorage.setItem('inscricaoData', JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone.replace(/\D/g, ''),
          }));
        }
        
        // Reset form
        setFormData({
          nome: '',
          email: '',
          telefone: '',
          idade: '',
          alergia: '',
          beliche: '',
          participouAntes: '',
          comoConheceu: '',
          tipoPagamento: '',
        });

        // Redirect to payment after 2 seconds
        setTimeout(() => {
          window.location.href = '/pagamento';
        }, 2000);
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'Erro ao enviar inscrição. Tente novamente.';
      setMessage('❌ ' + errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <section id="inscricao" className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20 px-4">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Inscreva-se Agora
          </h2>
          <p className="text-blue-200 text-lg">
            Preencha o formulário abaixo para garantir seu lugar no Retiro Closer
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-blue-900/30 backdrop-blur-md border border-blue-400/20 rounded-2xl p-8 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                maxLength={100}
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.nome
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="ex: João da Silva"
              />
              {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
            </motion.div>

            {/* Email */}
            <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={255}
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="seu.email@dominio.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            {/* Telefone */}
            <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                required
                maxLength={15}
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.telefone
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="(XX) XXXXX-XXXX"
              />
              {errors.telefone && <p className="text-red-400 text-sm mt-1">{errors.telefone}</p>}
            </motion.div>

            {/* Idade */}
            <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Idade</label>
              <input
                type="number"
                name="idade"
                value={formData.idade}
                onChange={handleChange}
                required
                min="11"
                max="120"
                maxLength={3}
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.idade
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="11-120"
              />
              {errors.idade && <p className="text-red-400 text-sm mt-1">{errors.idade}</p>}
            </motion.div>

            {/* Alergia */}
            <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Alergia a Alimentos ou Remédios</label>
              <input
                type="text"
                name="alergia"
                value={formData.alergia}
                onChange={handleChange}
                maxLength={100}
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 transition-all ${
                  errors.alergia
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="ex: Amendoim, Sem restrição"
              />
              {errors.alergia && <p className="text-red-400 text-sm mt-1">{errors.alergia}</p>}
            </motion.div>

            {/* Beliche */}
            <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Posição no Beliche</label>
              <select
                name="beliche"
                value={formData.beliche}
                onChange={handleChange}
                required
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.beliche
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              >
                <option value="">Selecione uma opção</option>
                <option value="cima">Cama de Cima</option>
                <option value="baixo">Cama de Baixo</option>
                <option value="sem_preferencia">Sem Preferência</option>
              </select>
              {errors.beliche && <p className="text-red-400 text-sm mt-1">{errors.beliche}</p>}
            </motion.div>

            {/* Já participou antes */}
            <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Já participou de retiros antes?</label>
              <select
                name="participouAntes"
                value={formData.participouAntes}
                onChange={handleChange}
                required
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.participouAntes
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              >
                <option value="">Selecione uma opção</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
              {errors.participouAntes && <p className="text-red-400 text-sm mt-1">{errors.participouAntes}</p>}
            </motion.div>

            {/* Como conheceu */}
            <motion.div custom={7} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Como conheceu o retiro?</label>
              <select
                name="comoConheceu"
                value={formData.comoConheceu}
                onChange={handleChange}
                required
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.comoConheceu
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              >
                <option value="">Selecione uma opção</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="amigo">Recomendação de Amigo</option>
                <option value="igreja">Igreja</option>
                <option value="outro">Outro</option>
              </select>
              {errors.comoConheceu && <p className="text-red-400 text-sm mt-1">{errors.comoConheceu}</p>}
            </motion.div>

            {/* Tipo de Pagamento */}
            <motion.div custom={8} variants={inputVariants} initial="hidden" animate="visible">
              <label className="block text-blue-200 font-semibold mb-2">Forma de Pagamento</label>
              <select
                name="tipoPagamento"
                value={formData.tipoPagamento}
                onChange={handleChange}
                required
                className={`w-full bg-blue-950/50 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all ${
                  errors.tipoPagamento
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-blue-400/30 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
              >
                <option value="">Selecione uma opção</option>
                <option value="pix">PIX - Pagamento Instantâneo</option>
                <option value="cartao">Cartão de Crédito - Parcelado</option>
                <option value="dinheiro">Dinheiro - Na Chegada</option>
              </select>
              {errors.tipoPagamento && <p className="text-red-400 text-sm mt-1">{errors.tipoPagamento}</p>}
            </motion.div>
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <motion.div
              className="bg-green-500/20 border border-green-400 text-green-300 p-4 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              className="bg-red-500/20 border border-red-400 text-red-300 p-4 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Enviando...' : 'Confirmar Inscrição'}
          </motion.button>
        </motion.form>
      </motion.div>
    </section>
  );
}
