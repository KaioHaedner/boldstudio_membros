import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from 'lucide-react'
import { Footer } from '@/components/Footer'

const ATUALIZADO = 'Junho de 2026'
const EMAIL_SUPORTE = 'suporte@boldstudiobrasil.com'

function LegalShell({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bold-black text-bold-white">
      <header className="border-b border-bold-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/brand/logo-primary.png" alt="bold." className="h-7 w-auto" />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-bold-white/60 hover:text-bold-yellow transition">
            <ArrowLeft size={14} /> Voltar
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{titulo}</h1>
        <p className="mt-2 text-sm text-bold-white/40">Última atualização: {ATUALIZADO}</p>
        <div className="mt-8 space-y-6 text-sm text-bold-white/70 leading-relaxed">{children}</div>
      </main>

      <Footer />
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-bold text-bold-white">{titulo}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

/* ============== TERMOS DE USO ============== */
export function TermosPage() {
  return (
    <LegalShell titulo="Termos de Uso">
      <p>Bem-vindo à BOLDSTUDIO. Ao acessar e usar nossa plataforma de cursos, você concorda com estes Termos de Uso. Leia com atenção.</p>
      <Secao titulo="1. Acesso e conta">
        <p>O acesso ao conteúdo é pessoal e intransferível, liberado após a confirmação da compra. É proibido compartilhar login, senha ou conteúdo com terceiros. Limitamos o uso a até 3 dispositivos por aluno para sua segurança.</p>
      </Secao>
      <Secao titulo="2. Uso do conteúdo">
        <p>Todo o material (vídeos, textos, materiais de apoio) é protegido por direitos autorais e de uso exclusivo do aluno. É vedada a reprodução, distribuição, revenda ou divulgação, total ou parcial, sem autorização expressa.</p>
      </Secao>
      <Secao titulo="3. Pagamentos e acesso">
        <p>As compras são processadas por gateways parceiros. O acesso é liberado automaticamente após a aprovação do pagamento. Em caso de estorno ou chargeback, o acesso pode ser suspenso.</p>
      </Secao>
      <Secao titulo="4. Reembolso">
        <p>Você pode solicitar reembolso em até 7 dias corridos a partir da compra, conforme o Código de Defesa do Consumidor (direito de arrependimento).</p>
      </Secao>
      <Secao titulo="5. Suspensão">
        <p>Reservamo-nos o direito de suspender contas que violem estes termos, especialmente o compartilhamento indevido de acesso.</p>
      </Secao>
      <Secao titulo="6. Contato">
        <p>Dúvidas sobre estes termos: <a href={`mailto:${EMAIL_SUPORTE}`} className="text-bold-yellow hover:underline">{EMAIL_SUPORTE}</a>.</p>
      </Secao>
    </LegalShell>
  )
}

/* ============== POLITICA DE PRIVACIDADE ============== */
export function PrivacidadePage() {
  return (
    <LegalShell titulo="Política de Privacidade">
      <p>A BOLDSTUDIO respeita sua privacidade e trata seus dados conforme a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>
      <Secao titulo="1. Dados que coletamos">
        <p>Nome, e-mail, telefone/WhatsApp, CPF e dados de acesso (IP, dispositivo) — necessários para liberar o acesso, dar suporte e garantir a segurança da sua conta.</p>
      </Secao>
      <Secao titulo="2. Como usamos">
        <p>Para autenticar seu acesso, processar pagamentos, personalizar sua experiência, enviar comunicações sobre o curso e cumprir obrigações legais.</p>
      </Secao>
      <Secao titulo="3. Compartilhamento">
        <p>Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais (gateway de pagamento, hospedagem de vídeo, e-mail) sob contrato e na medida necessária.</p>
      </Secao>
      <Secao titulo="4. Seus direitos">
        <p>Você pode acessar, corrigir, exportar ou solicitar a exclusão dos seus dados a qualquer momento, além de revogar consentimentos. Basta entrar em contato pelo nosso suporte.</p>
      </Secao>
      <Secao titulo="5. Segurança">
        <p>Adotamos medidas técnicas (criptografia, controle de acesso, RLS) para proteger seus dados contra acesso não autorizado.</p>
      </Secao>
      <Secao titulo="6. Encarregado (DPO)">
        <p>Solicitações sobre dados pessoais: <a href={`mailto:${EMAIL_SUPORTE}`} className="text-bold-yellow hover:underline">{EMAIL_SUPORTE}</a>.</p>
      </Secao>
    </LegalShell>
  )
}

/* ============== POLITICA DE COOKIES ============== */
export function CookiesPage() {
  return (
    <LegalShell titulo="Política de Cookies">
      <p>Usamos cookies e tecnologias similares para fazer a plataforma funcionar e melhorar sua experiência.</p>
      <Secao titulo="1. O que são cookies">
        <p>Pequenos arquivos guardados no seu navegador que ajudam a lembrar suas preferências e manter você conectado com segurança.</p>
      </Secao>
      <Secao titulo="2. Tipos que usamos">
        <p><strong className="text-bold-white">Essenciais:</strong> autenticação, sessão e segurança (não podem ser desativados). <br />
        <strong className="text-bold-white">Funcionais:</strong> preferências, progresso das aulas. <br />
        <strong className="text-bold-white">Analíticos:</strong> entender o uso pra melhorar o conteúdo.</p>
      </Secao>
      <Secao titulo="3. Gerenciamento">
        <p>Você pode bloquear ou apagar cookies nas configurações do seu navegador. Alguns recursos podem deixar de funcionar sem os cookies essenciais.</p>
      </Secao>
    </LegalShell>
  )
}

/* ============== SUPORTE / CENTRAL DE AJUDA ============== */
export function SuportePage() {
  return (
    <LegalShell titulo="Suporte">
      <p>Precisa de ajuda? Estamos aqui pra você. Escolha o melhor canal:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
        <a href={`mailto:${EMAIL_SUPORTE}`} className="rounded-xl border border-bold-white/10 bg-bold-gray/40 p-5 hover:border-bold-yellow/40 transition">
          <Mail className="text-bold-yellow mb-2" size={22} />
          <h3 className="font-semibold text-bold-white">E-mail</h3>
          <p className="text-xs text-bold-white/55 mt-1">{EMAIL_SUPORTE}</p>
        </a>
        <a href="https://wa.me/5566996402088" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-bold-white/10 bg-bold-gray/40 p-5 hover:border-bold-yellow/40 transition">
          <MessageCircle className="text-bold-yellow mb-2" size={22} />
          <h3 className="font-semibold text-bold-white">WhatsApp</h3>
          <p className="text-xs text-bold-white/55 mt-1">Atendimento em horário comercial</p>
        </a>
      </div>
      <Secao titulo="Perguntas frequentes">
        <div className="space-y-3">
          <p><HelpCircle size={14} className="inline text-bold-yellow mr-1" /> <strong className="text-bold-white">Não recebi meu acesso.</strong> Verifique o spam do e-mail usado na compra. Se não chegar em 1h, fale com a gente.</p>
          <p><HelpCircle size={14} className="inline text-bold-yellow mr-1" /> <strong className="text-bold-white">Esqueci a senha.</strong> Use "Esqueci minha senha" na tela de login.</p>
          <p><HelpCircle size={14} className="inline text-bold-yellow mr-1" /> <strong className="text-bold-white">Atingi o limite de dispositivos.</strong> Fale com o suporte pra liberar um aparelho.</p>
        </div>
      </Secao>
    </LegalShell>
  )
}
