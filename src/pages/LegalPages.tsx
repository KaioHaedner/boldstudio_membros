import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, HelpCircle } from 'lucide-react'
import { Footer } from '@/components/Footer'

const ATUALIZADO = 'Junho de 2026'
const EMAIL_SUPORTE = 'suporte@boldstudiobrasil.com'
const EMAIL_CONTATO = 'bold@boldstudiobrasil.com'
const HOME_INSTITUCIONAL = '/home-bold-studio-sinop-brasil'

function LegalShell({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bold-black text-bold-white">
      <header className="border-b border-bold-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to={HOME_INSTITUCIONAL} className="flex items-center gap-2">
            <img src="/brand/logo-boldstudio.webp" alt="Bold Studio Brasil" className="h-6 w-auto object-contain" />
          </Link>
          <Link
            to={HOME_INSTITUCIONAL}
            className="inline-flex items-center gap-1 text-sm text-bold-white/60 hover:text-bold-yellow transition"
          >
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
      <p>
        Bem-vindo à <strong className="text-bold-white">Bold Studio Brasil</strong>, estúdio de produção
        audiovisual sediado em Sinop, Mato Grosso. Estes Termos de Uso regem o uso do nosso site institucional,
        dos nossos canais de contato (incluindo o assistente RecIA) e da nossa plataforma de cursos. Ao navegar,
        enviar um formulário ou contratar um serviço, você concorda com as condições abaixo. Leia com atenção.
      </p>

      <Secao titulo="1. Quem somos">
        <p>
          A Bold Studio Brasil presta serviços de captação e produção audiovisual (vídeos institucionais,
          publicitários, cobertura de eventos e conteúdo para empresas) e oferece formação em audiovisual por
          meio de cursos online. Operamos sob a marca "Bold Studio" e pelo domínio boldstudiobrasil.com.
        </p>
      </Secao>

      <Secao titulo="2. Uso do site e dos canais de contato">
        <p>
          O site institucional é de acesso livre e informativo. Ao preencher o formulário de contato ou
          conversar com a RecIA, você declara que os dados informados são verdadeiros e que tem capacidade legal
          para fornecê-los. É proibido usar nossos canais para enviar conteúdo ilícito, ofensivo, spam ou que
          viole direitos de terceiros.
        </p>
      </Secao>

      <Secao titulo="3. Serviços audiovisuais">
        <p>
          Propostas, prazos, escopo e valores de cada projeto audiovisual são definidos em orçamento ou contrato
          específico, que prevalece sobre estes Termos no que for divergente. O agendamento de uma conversa pelo
          site não constitui contratação nem garante disponibilidade de data.
        </p>
      </Secao>

      <Secao titulo="4. Plataforma de cursos">
        <p>
          O acesso ao conteúdo dos cursos é pessoal e intransferível, liberado após a confirmação da compra. É
          proibido compartilhar login, senha ou conteúdo com terceiros. Limitamos o uso a até 3 dispositivos por
          aluno para sua segurança e proteção do material.
        </p>
      </Secao>

      <Secao titulo="5. Propriedade intelectual">
        <p>
          Todo o material do site, dos cursos e das produções (vídeos, imagens, textos, marca, identidade visual
          e materiais de apoio) é protegido por direitos autorais. É vedada a reprodução, distribuição, revenda ou
          divulgação, total ou parcial, sem autorização expressa e por escrito da Bold Studio Brasil.
        </p>
      </Secao>

      <Secao titulo="6. Pagamentos, acesso e reembolso">
        <p>
          As compras de cursos são processadas por gateways parceiros e o acesso é liberado automaticamente após a
          aprovação do pagamento. Em caso de estorno ou chargeback, o acesso pode ser suspenso. Você pode solicitar
          reembolso em até 7 dias corridos a partir da compra, conforme o direito de arrependimento do Código de
          Defesa do Consumidor.
        </p>
      </Secao>

      <Secao titulo="7. Limitação de responsabilidade">
        <p>
          Empregamos esforços para manter o site disponível e seguro, mas não garantimos funcionamento
          ininterrupto ou livre de erros. Não nos responsabilizamos por indisponibilidades de terceiros
          (hospedagem, gateways, provedores de e-mail) nem por decisões tomadas com base em conteúdo meramente
          informativo, inclusive respostas geradas pela RecIA.
        </p>
      </Secao>

      <Secao titulo="8. Suspensão e alterações">
        <p>
          Podemos suspender contas que violem estes termos, especialmente em caso de compartilhamento indevido de
          acesso. Estes Termos podem ser atualizados a qualquer momento; a versão vigente é sempre a publicada
          nesta página, com a data de atualização indicada acima.
        </p>
      </Secao>

      <Secao titulo="9. Contato">
        <p>
          Dúvidas sobre estes termos:{' '}
          <a href={`mailto:${EMAIL_SUPORTE}`} className="text-bold-yellow hover:underline">{EMAIL_SUPORTE}</a>.
        </p>
      </Secao>
    </LegalShell>
  )
}

/* ============== POLITICA DE PRIVACIDADE ============== */
export function PrivacidadePage() {
  return (
    <LegalShell titulo="Política de Privacidade">
      <p>
        A Bold Studio Brasil respeita sua privacidade e trata seus dados pessoais conforme a Lei Geral de Proteção
        de Dados (LGPD — Lei 13.709/2018). Esta política explica quais dados coletamos, por que coletamos, como
        usamos e protegemos, e quais são os seus direitos.
      </p>

      <Secao titulo="1. Dados que coletamos">
        <p>
          <strong className="text-bold-white">No site institucional e na RecIA:</strong> nome, e-mail,
          WhatsApp/telefone, cidade e estado, e o conteúdo das mensagens que você nos envia.
          <br />
          <strong className="text-bold-white">Na plataforma de cursos:</strong> nome, e-mail, telefone, CPF e
          dados de acesso (IP, dispositivo, navegador).
          <br />
          <strong className="text-bold-white">Automaticamente:</strong> dados técnicos de navegação e cookies
          (veja a Política de Cookies).
        </p>
      </Secao>

      <Secao titulo="2. Por que coletamos (finalidade e base legal)">
        <p>
          Tratamos seus dados para: responder seu contato e elaborar orçamentos (execução de procedimentos
          preliminares a contrato); liberar e operar o acesso aos cursos (execução de contrato); enviar
          comunicações sobre seu atendimento ou compra; cumprir obrigações legais; e, com seu consentimento,
          enviar novidades e ações de marketing. Você pode retirar o consentimento a qualquer momento.
        </p>
      </Secao>

      <Secao titulo="3. Como usamos e por quanto tempo guardamos">
        <p>
          Usamos os dados estritamente para as finalidades acima. Leads de contato são guardados pelo tempo
          necessário ao atendimento e ao relacionamento comercial; dados de alunos, enquanto durar a relação e
          pelos prazos legais aplicáveis. Após esses prazos, os dados são eliminados ou anonimizados.
        </p>
      </Secao>

      <Secao titulo="4. Compartilhamento">
        <p>
          Não vendemos seus dados. Compartilhamos apenas com parceiros essenciais à operação — provedor de banco de
          dados e hospedagem (Supabase), provedor de e-mail transacional (Resend), gateway de pagamento e
          hospedagem de vídeo — sempre na medida necessária e sob obrigação de confidencialidade.
        </p>
      </Secao>

      <Secao titulo="5. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia em trânsito,
          controle de acesso e regras de segurança em nível de linha no banco (RLS), de forma que os dados de
          contato só sejam acessíveis pela equipe autorizada da Bold Studio.
        </p>
      </Secao>

      <Secao titulo="6. Seus direitos (LGPD)">
        <p>
          Você pode, a qualquer momento: confirmar a existência de tratamento; acessar, corrigir ou atualizar seus
          dados; solicitar a portabilidade, a anonimização ou a exclusão; e revogar consentimentos. Para exercer
          esses direitos, fale com nosso encarregado pelo e-mail abaixo.
        </p>
      </Secao>

      <Secao titulo="7. Encarregado (DPO)">
        <p>
          Solicitações sobre dados pessoais:{' '}
          <a href={`mailto:${EMAIL_SUPORTE}`} className="text-bold-yellow hover:underline">{EMAIL_SUPORTE}</a>.
          Responderemos no menor prazo possível, observados os limites da LGPD.
        </p>
      </Secao>
    </LegalShell>
  )
}

/* ============== POLITICA DE COOKIES ============== */
export function CookiesPage() {
  return (
    <LegalShell titulo="Política de Cookies">
      <p>
        Usamos cookies e tecnologias similares para fazer o site funcionar, lembrar suas preferências e entender
        como nossas páginas são usadas. Esta política explica o que são, quais usamos e como você pode gerenciá-los.
      </p>

      <Secao titulo="1. O que são cookies">
        <p>
          Cookies são pequenos arquivos guardados no seu navegador quando você visita um site. Eles ajudam a
          lembrar suas escolhas, manter você conectado com segurança e medir o desempenho das páginas.
        </p>
      </Secao>

      <Secao titulo="2. Tipos que usamos">
        <p>
          <strong className="text-bold-white">Essenciais:</strong> necessários para o site funcionar —
          autenticação, sessão, segurança e o registro da sua escolha de cookies. Não podem ser desativados.
          <br />
          <strong className="text-bold-white">Funcionais:</strong> lembram preferências como idioma e progresso
          das aulas, melhorando sua experiência.
          <br />
          <strong className="text-bold-white">Analíticos:</strong> ajudam a entender, de forma agregada, como o
          site é usado, para melhorarmos o conteúdo. Só são ativados se você aceitar.
        </p>
      </Secao>

      <Secao titulo="3. Como gerenciar">
        <p>
          Na sua primeira visita, exibimos uma barra de cookies onde você pode <strong className="text-bold-white">aceitar</strong> ou{' '}
          <strong className="text-bold-white">gerenciar</strong> os cookies não essenciais. Você pode rever sua
          escolha a qualquer momento limpando os dados do site no navegador. Também é possível bloquear ou apagar
          cookies nas configurações do próprio navegador — lembrando que, sem os cookies essenciais, alguns
          recursos podem deixar de funcionar.
        </p>
      </Secao>

      <Secao titulo="4. Cookies de terceiros">
        <p>
          Alguns parceiros essenciais (hospedagem, vídeo, pagamento) podem definir cookies próprios quando você usa
          recursos integrados. Esses cookies são regidos pelas políticas dos respectivos provedores.
        </p>
      </Secao>
    </LegalShell>
  )
}

/* ============== USO DA IA (RecIA) ============== */
export function UsoIAPage() {
  return (
    <LegalShell titulo="Uso da IA — RecIA">
      <p>
        A <strong className="text-bold-white">RecIA</strong> é a assistente virtual da Bold Studio Brasil,
        disponível no nosso site institucional. Esta página explica, de forma transparente, o que ela faz, quais
        dados coleta e como protegemos essas informações.
      </p>

      <Secao titulo="1. O que é a RecIA">
        <p>
          A RecIA é um assistente de atendimento que ajuda você a conhecer melhor a Bold Studio, tirar dúvidas
          sobre nossos serviços de audiovisual e iniciar uma conversa com a nossa equipe. Ela funciona como um
          primeiro canal de contato, de forma rápida e amigável.
        </p>
      </Secao>

      <Secao titulo="2. Quais dados ela coleta">
        <p>
          Para que possamos retornar o seu contato, a RecIA solicita: <strong className="text-bold-white">nome,
          WhatsApp, e-mail e cidade/estado</strong>. Também registramos o conteúdo da conversa e dados técnicos
          básicos (como o navegador utilizado). Você só informa esses dados se quiser iniciar o atendimento.
        </p>
      </Secao>

      <Secao titulo="3. Como usamos esses dados">
        <p>
          Usamos as informações exclusivamente para responder seu contato, entender sua necessidade e elaborar uma
          proposta. Não vendemos nem cedemos seus dados para terceiros com finalidade de marketing. O envio dos
          dados pela RecIA equivale a uma solicitação de contato comercial.
        </p>
      </Secao>

      <Secao titulo="4. Onde e como guardamos">
        <p>
          Os dados enviados pela RecIA são armazenados de forma segura no nosso banco de dados (Supabase), com
          regras de acesso em nível de linha (RLS): qualquer visitante pode enviar um contato, mas somente a
          equipe autorizada da Bold Studio consegue visualizar os leads, em um painel administrativo restrito. A
          comunicação é criptografada em trânsito.
        </p>
      </Secao>

      <Secao titulo="5. Limites da RecIA">
        <p>
          As respostas da RecIA têm caráter informativo e podem conter imprecisões. Elas não substituem um
          atendimento personalizado nem constituem proposta comercial formal — valores, prazos e escopo são sempre
          confirmados pela nossa equipe. Não compartilhe com a RecIA dados sensíveis (como documentos, senhas ou
          dados de cartão).
        </p>
      </Secao>

      <Secao titulo="6. Seus direitos">
        <p>
          Você pode solicitar o acesso, a correção ou a exclusão dos dados enviados pela RecIA a qualquer momento,
          conforme nossa{' '}
          <Link to="/privacidade" className="text-bold-yellow hover:underline">Política de Privacidade</Link>. Basta
          escrever para{' '}
          <a href={`mailto:${EMAIL_CONTATO}`} className="text-bold-yellow hover:underline">{EMAIL_CONTATO}</a>.
        </p>
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
