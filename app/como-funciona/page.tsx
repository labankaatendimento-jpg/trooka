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
                Você entra no Trooka e informa qual é o seu modelo de iPhone atual, o estado de conservação e para qual modelo mais novo deseja fazer o upgrade. Na mesma hora, o sistema te dá uma estimativa de preço do seu usado e o preço médio do upgrade.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Solicite ofertas exclusivas</h2>
              <p>
                Gostou da estimativa? Se você quiser receber orçamentos reais, basta colocar os seus dados de contato no final do chat. Assim, o seu pedido de troca será enviado para lojistas e parceiros cadastrados na sua região.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. Receba propostas no WhatsApp</h2>
              <p>
                Os lojistas competem pela sua preferência analisando o seu aparelho e enviando orçamentos reais de quanto eles pagam no seu usado para a troca. Você recebe as ofertas diretamente no seu WhatsApp, não precisando acompanhar nada pela plataforma, e pode comparar quem paga mais!
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">4. Escolha e feche negócio</h2>
              <p>
                Basta selecionar a melhor oferta e negociar diretamente com o lojista para concluir a compra e venda. Sem intermediários cobrando taxas abusivas.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
