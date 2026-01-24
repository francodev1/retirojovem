# Guia de Integração: MercadoPago + Maquininha da Igreja

## Opções de Integração

### Option 1: Usar o SDK do MercadoPago (Recomendado)
Você pode integrar a maquininha da Igreja (que já é conectada ao MercadoPago) de forma que o pagamento seja processado:

```bash
npm install @mercadopago/sdk-js
```

**Vantagens:**
- ✅ Integração direta com a maquininha
- ✅ Pagamento em tempo real
- ✅ Webhooks para confirmação
- ✅ Suporte a cartão de crédito/débito
- ✅ Relatórios automáticos no dashboard do MP

**Desvantagens:**
- Precisa de credenciais do MercadoPago (Public Key + Access Token)
- Configuração um pouco mais complexa

### Option 2: Usar Checkout Pro do MercadoPago
Redirecionar para o checkout do MercadoPago:

```javascript
// Cliente vê um formulário simples
// Clica em "Pagar"
// É redirecionado para MercadoPago
// Completa o pagamento lá
// Retorna confirmação
```

**Vantagens:**
- ✅ Mais seguro (não armazena dados de cartão)
- ✅ Suporta múltiplos métodos
- ✅ Conformidade PCI-DSS automática

**Desvantagens:**
- Experiência um pouco menos fluida

### Option 3: PIX + MercadoPago
Combinar PIX estático com cartão via MercadoPago:

```
PIX (sem juros)
└─ Direto para conta da Igreja

Cartão (com juros)
└─ Via MercadoPago + Maquininha
```

## O que Você Já Tem

✅ **Maquininha da Igreja** (conectada ao MercadoPago)
- Processe cartões presencialmente OU remotamente
- Receba em conta da Igreja

✅ **PIX Estático**
- Pode gerar QR Code na hora ou usar estático

## Recomendação

**Arquitetura ideal:**
1. **PIX** → Direto para conta via Mercado Pago (grátis para receber)
2. **Cartão** → Via formulário Checkout Pro do MP
3. **Dinheiro** → Confirmação manual no evento

Isso dá a melhor experiência pro usuário e menos taxa pra Igreja!

## Próximos Passos

1. Obter credenciais MercadoPago (já tem? só precisa copiar)
2. Adicionar ao `.env.local`:
   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   ```
3. Implementar o checkout (a gente faz!)

## Taxas do MercadoPago (2025)
- **PIX**: 0% (você recebe 100%)
- **Cartão Débito**: ~1,5%
- **Cartão Crédito (1x)**: ~1,99%
- **Cartão Crédito (parcelado)**: ~2,5% + 1,99% por parcela
