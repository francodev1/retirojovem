import Hero from '@/components/Hero';
import ApresentacaoRetiro from '@/components/ApresentacaoRetiro';
import CarrosselLocal from '@/components/CarrosselLocal';
import InscricaoForm from '@/components/InscricaoForm';

export const metadata = {
  title: 'Retiro Closer - Experiência Transformadora para Jovens Cristãos',
  description: 'Inscreva-se no Retiro Closer, uma experiência única para jovens cristãos de 13 a 30 anos.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Hero />
      <ApresentacaoRetiro />
      <CarrosselLocal />
      <InscricaoForm />
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-blue-400/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-300 mb-2">© 2026 Retiro Closer. Todos os direitos reservados.</p>
          <p className="text-blue-200 text-sm">
            Desenvolvido com ❤️ para jovens cristãos apaixonados
          </p>
        </div>
      </footer>
    </main>
  );
}
