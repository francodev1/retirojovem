// Validação e sanitização de dados seguindo OWASP

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  data?: Record<string, any>;
}

// Sanitizar strings contra XSS
export function sanitizeString(value: string, maxLength: number = 255): string {
  if (typeof value !== 'string') return '';
  
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, (char) => {
      const map: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return map[char];
    });
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// Validar telefone brasileira
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\d{2})?\d{8,9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
}

// Validar idade (mínimo 11 anos)
export function isValidAge(age: string): boolean {
  const num = parseInt(age);
  return !isNaN(num) && num >= 11 && num <= 120;
}

// Validar dados do formulário
export function validateFormData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitized: Record<string, any> = {};

  // Nome
  if (!data.nome || typeof data.nome !== 'string') {
    errors.push('Nome é obrigatório');
  } else if (data.nome.length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  } else {
    sanitized.nome = sanitizeString(data.nome, 100);
  }

  // Email
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Email inválido');
  } else {
    sanitized.email = sanitizeString(data.email, 255);
  }

  // Telefone
  if (!data.telefone || !isValidPhone(data.telefone)) {
    errors.push('Telefone inválido');
  } else {
    sanitized.telefone = data.telefone.replace(/\D/g, '');
  }

  // Idade
  if (!data.idade || !isValidAge(data.idade)) {
    errors.push('Idade deve estar entre 11 e 120 anos');
  } else {
    sanitized.idade = parseInt(data.idade);
  }

  // Alergia (opcional, mas sanitizar)
  if (data.alergia) {
    sanitized.alergia = sanitizeString(data.alergia, 200);
  } else {
    sanitized.alergia = '';
  }

  // Beliche (validar valores permitidos)
  const beliheOptions = ['cima', 'baixo', 'sem_preferencia'];
  if (!data.beliche || !beliheOptions.includes(data.beliche)) {
    errors.push('Beliche inválido');
  } else {
    sanitized.beliche = data.beliche;
  }

  // Experiência anterior
  const simNaoOptions = ['sim', 'nao'];
  if (!data.participouAntes || !simNaoOptions.includes(data.participouAntes)) {
    errors.push('Campo de experiência inválido');
  } else {
    sanitized.participouAntes = data.participouAntes;
  }

  // Como conheceu
  const comoOptions = ['instagram', 'facebook', 'whatsapp', 'amigo', 'igreja', 'outro'];
  if (!data.comoConheceu || !comoOptions.includes(data.comoConheceu)) {
    errors.push('Campo "Como soube" inválido');
  } else {
    sanitized.comoConheceu = data.comoConheceu;
  }

  // Tipo de pagamento
  const pagamentoOptions = ['pix', 'cartao', 'dinheiro'];
  if (!data.tipoPagamento || !pagamentoOptions.includes(data.tipoPagamento)) {
    errors.push('Tipo de pagamento inválido');
  } else {
    sanitized.tipoPagamento = data.tipoPagamento;
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? sanitized : undefined,
  };
}

// Validar valor de pagamento
export function isValidPaymentAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && amount <= 100000;
}
