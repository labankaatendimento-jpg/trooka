'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function TermosPage() {
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
            Termos de Uso
          </h1>
          
          <div className="space-y-6 text-neutral-300 leading-relaxed pt-6">
            <h2 className="text-xl font-bold text-white">1. Termos</h2>
            <p>
              Ao acessar ao site Trooka, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">2. Uso da Licença</h2>
            <p>
              O Trooka é uma plataforma de intermediação e conexão entre consumidores e lojistas. Não nos responsabilizamos pelos acordos firmados diretamente entre as partes, qualidade dos produtos ou garantia de serviços, sendo estes de inteira responsabilidade do lojista fornecedor.
            </p>

            <h2 className="text-xl font-bold text-white mt-8">3. Isenção de responsabilidade</h2>
            <p>
              Os materiais no site da Trooka são fornecidos 'como estão'. Trooka não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
