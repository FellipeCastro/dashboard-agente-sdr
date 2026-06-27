# 📊 SDR IA Dashboard

> Dashboard moderno e responsivo para monitoramento, filtragem e gestão de leads qualificados captados por um agente de Inteligência Artificial no WhatsApp.

O **SDR IA Dashboard** é um painel administrativo desenvolvido em **Next.js 15 (App Router)** e **Supabase** que centraliza a triagem de leads realizada por um robô de pré-vendas (SDR - *Sales Development Representative*) no WhatsApp. A aplicação permite que corretores e administradores qualifiquem leads em tempo real e acompanhem as visitas e interações.

---

## 🚀 Principais Funcionalidades

1. **Autenticação Segura & Gestão de Acesso**:
   - Controle de rotas protegidas em nível de servidor (`/dashboard/*`) via Next.js Middleware.
   - Integração completa com **Supabase Auth** para Login e Recuperação de Senha.
2. **Dashboard Geral (Overview)**:
   - Indicadores consolidados de triagem: total de leads captados e segmentação por status de atendimento.
   - Gráfico interativo mostrando a proporção de status de visitas (**Em atendimento** vs **Aguardando consultor**).
   - Tabela de atividades recentes com os últimos contatos sincronizados em tempo real.
3. **Gestão Avançada de Leads**:
   - Listagem completa de contatos com paginação dinâmica e configurável.
   - Filtros de alta granularidade:
     - Busca por texto livre (nome ou telefone).
     - Intenção (Comprar ou Alugar).
     - Transação (Compra ou Aluguel).
     - Status de Visita (Em atendimento, Aguardando consultor).
     - Tipologia de imóvel de interesse (Apartamento, Casa, Terreno, Sobrado, Comercial).
     - Filtro por período de cadastro (Datas de início e fim).
4. **Detalhes do Lead & Triagem**:
   - Perfil detalhado de cada lead mostrando as respostas coletadas pela IA durante o fluxo no WhatsApp, bem como um resumo do Histórico de Atendimento.
   - **Integração WhatsApp Link**: Botão direto para iniciar conversação com o número do lead via API oficial do WhatsApp (`https://wa.me/...`).

---

## 🧠 Fluxo de Atendimento e Triagem

O painel reflete o funil de atendimento e a triagem inicial feita pela inteligência artificial. Os leads são avaliados quanto à intenção, o tipo de transação desejada (compra/aluguel) e capacidade de investimento (faixa de preço). 

Através do campo **Status de Visita**, os corretores conseguem identificar rapidamente se a IA ainda está interagindo com o lead (**Em atendimento**) ou se o contato já foi devidamente triado e está pronto para agendamento manual (**Aguardando consultor**).

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

A arquitetura do projeto foi estruturada para máxima performance, segurança e responsividade:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React Server Components)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI & Componentes**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Gerenciamento de Tabelas**: [TanStack Table v8](https://tanstack.com/table)
- **Banco de Dados & Autenticação**: [Supabase](https://supabase.com/) (com `@supabase/ssr` e `@supabase/supabase-js`)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 🗄️ Estrutura do Banco de Dados

O painel consome a tabela `leads` do Supabase. A estrutura esperada dos registros é:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Identificador único do lead |
| `created_at` | `timestamp` | Data e hora de captação |
| `nome` | `varchar` | Nome completo do contato |
| `email` | `varchar` | Email do contato |
| `telefone` | `varchar` | Número de WhatsApp |
| `intencao` | `varchar` | Intenção informada (Ex: Comprar, Alugar) |
| `transacao` | `varchar` | Tipo de transação (Ex: Compra, Aluguel) |
| `tipo_imovel` | `varchar` | Tipo de imóvel (Ex: Apartamento, Casa) |
| `quartos` | `varchar` | Quantidade de quartos solicitados |
| `bairro_ou_regiao` | `varchar` | Região de interesse |
| `faixa_de_preco` | `numeric` | Faixa de preço/capacidade financeira identificada |
| `imovel_de_interesse` | `varchar` | Imóvel/Empreendimento específico mencionado |
| `data_visita` | `varchar` | Data/horário sugerido para visita |
| `status_visita` | `varchar` | Status de atendimento (Ex: 'Em atendimento', 'Aguardando consultor') |
| `proximo_passo` | `text` | Recomendação do próximo passo do funil |
| `historico` | `text` | Resumo da conversa e das interações gerado pela IA |

---

## ⚙️ Instalação e Execução

### Pré-requisitos
Certifique-se de ter o **Node.js** instalado (versão v18 ou superior recomendada).

### 1. Clonar o Repositório e Instalar Dependências
```bash
# Navegue até a pasta do projeto e instale as dependências
npm install
```

### 2. Configurar as Variáveis de Ambiente
Duplique o arquivo `.env.local.example` para `.env.local` na raiz do projeto:
```bash
cp .env.local.example .env.local
```
Preencha as variáveis com as credenciais do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-supabase.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anonima
```

### 3. Rodar em Ambiente de Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 4. Compilar para Produção
```bash
npm run build
npm run start
```

---

## 🎨 Próximos Recursos (Roadmap)
- [ ] Edição dinâmica de prompts do robô diretamente pelo painel.
- [ ] Configuração de regras de triagem customizadas por empreendimento.
- [ ] Integração de webhook para sincronização automática com CRMs externos (ex: RD Station, Hubspot).
