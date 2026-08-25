'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>
          
          <div className="space-y-6 text-neutral-300 leading-relaxed pt-6">
            <p>
              A sua privacidade é importante para nós. É política do Trooka respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Trooka.
            </p>
            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (como conectar você aos lojistas). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
            </p>
            <p>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>
            <p>
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto nos casos necessários para o funcionamento da plataforma (conectar a solicitação ao lojista) ou quando exigido por lei.
            </p>
            <p className="text-sm text-neutral-500 pt-8">
              Esta política é efetiva a partir de Janeiro de 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
