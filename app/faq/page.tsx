'use client'

import { ArrowLeft, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const FAQS = [
  {
    q: "O Trooka é gratuito para consumidores?",
    a: "Sim! Fazer o pedido de avaliação do seu iPhone usado e receber orçamentos de lojistas é 100% gratuito para você."
  },
  {
    q: "Como o lojista entra em contato comigo?",
    a: "O lojista enviará uma proposta de volta para o seu WhatsApp. Você poderá analisar as ofertas recebidas e escolher a melhor proposta para fechar negócio. O chat interno do Trooka é utilizado apenas no início para fazer a avaliação do seu aparelho e gerar uma estimativa."
  },
  {
    q: "Os lojistas são verificados?",
    a: "Sim, todos os parceiros cadastrados na plataforma passam por um processo de verificação da equipe do Trooka para garantir a sua segurança."
  },
  {
    q: "Como posso cadastrar minha loja?",
    a: "Basta acessar o menu e clicar em 'Cadastrar sua loja'. O processo é rápido, simples e permite que você comece a receber propostas de pessoas querendo trocar de iPhone na sua região quase imediatamente."
  }
]

export default function FAQPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

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
            Dúvidas Frequentes
          </h1>
          
          <div className="space-y-4 pt-6">
            {FAQS.map((faq, index) => (
              <div 
                key={index}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-lg">{faq.q}</span>
                  <ChevronDown 
                    className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-neutral-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
