'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ComoFuncionaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] p-6 pt-12 md:p-12 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto space-y-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Voltar para o Início</span>
        </button>

        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
            Como funciona o Trooka
          </h1>
          
          <div className="space-y-8 text-neutral-300 leading-relaxed text-lg pt-6">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Avalie o seu iPhone atual</h2>
              <p>
                Você entra no Trooka e informa qual é o seu modelo de iPhone atual, o estado de conservação e para qual modelo mais novo você deseja fazer o upgrade.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Os lojistas recebem seu pedido</h2>
              <p>
                Sua solicitação de troca é enviada instantaneamente para todos os lojistas e parceiros cadastrados na sua região que trabalham com venda e troca de iPhones.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. Receba propostas de volta</h2>
              <p>
                Os lojistas competem pela sua preferência enviando orçamentos de quanto eles pagam no seu aparelho atual na troca pelo novo. Você recebe as notificações e pode comparar os valores de volta!
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. Escolha e feche negócio</h2>
              <p>
                Basta selecionar a melhor oferta e entrar em contato direto com o lojista para concluir o negócio. Sem intermediários cobrando taxas abusivas.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
