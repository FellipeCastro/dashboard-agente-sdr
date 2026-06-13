# 📊 SDR IA Dashboard

> Dashboard moderno e responsivo para monitoramento, filtragem e gestão de leads qualificados captados por um agente de Inteligência Artificial no WhatsApp.

O **SDR IA Dashboard** é um painel administrativo desenvolvido em **Next.js 15 (App Router)** e **Supabase** que centraliza a triagem de leads realizada por um robô de pré-vendas (SDR - *Sales Development Representative*) no WhatsApp. A aplicação permite que corretores e administradores qualifiquem leads em tempo real com base no perfil financeiro e tomem o controle de conversas quando necessário.

---

## 🚀 Principais Funcionalidades

1. **Autenticação Segura & Gestão de Acesso**:
   - Controle de rotas protegidas em nível de servidor (`/dashboard/*`) via Next.js Middleware.
   - Integração completa com **Supabase Auth** para Login e Recuperação de Senha.
2. **Dashboard Geral (Overview)**:
   - Indicadores consolidados de triagem: total de leads captados e segmentação por temperatura de conversão.
   - Gráfico interativo mostrando a proporção de leads (**Quentes e Frios**).
   - Tabela de atividades recentes com os últimos contatos sincronizados em tempo real.
3. **Gestão Avançada de Leads**:
   - Listagem completa de contatos com paginação dinâmica e configurável.
   - Filtros de alta granularidade:
     - Busca por texto livre (nome ou telefone).
     - Classificação de temperatura (Quente, Frio).
     - Objetivo/Ação pretendida pelo lead (Agendamento de Visita ou Simulação de Crédito).
     - Renda Declarada (Acima ou Abaixo de R$ 2.500,00).
     - Restrição Cadastral (Com Restrição ou Nome Limpo).
     - Tipologia de imóvel de interesse (Apartamento, Casa, Terreno, Sobrado, Comercial).
     - Filtro por período de cadastro (Datas de início e fim).
4. **Detalhes do Lead & Triagem**:
   - Perfil detalhado de cada lead mostrando as respostas coletadas pela IA durante o fluxo no WhatsApp.
   - **Integração WhatsApp Link**: Botão direto para iniciar conversação com o número do lead via API oficial do WhatsApp (`https://wa.me/...`).
   - **Human-in-the-Loop (Pausa de IA)**: Opção de pausar a automação da IA para um lead específico diretamente do painel, permitindo que um corretor assuma o atendimento manual sem interferências do robô.

---

## 🧠 Motor de Classificação (Lead Scoring Engine)

A qualificação de temperatura de cada lead é computada dinamicamente de acordo com as seguintes regras de negócio, baseadas no perfil financeiro do contato (definido em [lead-score.ts](file:///src/lib/lead-score.ts)):

| Classificação | Critério Financeiro | Ação no Painel | Indicador Visual |
| :--- | :--- | :--- | :--- |
| **🟢 Quente** | Renda acima de R$ 2.500 **E** CPF sem restrição | Prioridade máxima para atendimento | Verde (`bg-emerald-100`) |
| **🔴 Frio** | Outros casos (renda abaixo de R$ 2.500, CPF com restrição ou dados ausentes) | Baixa prioridade / Descartado | Vermelho (`bg-red-100`) |

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

O painel consome a tabela `clientes` do Supabase. A estrutura esperada dos registros é:

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Identificador único do lead |
| `created_at` | `timestamp` | Data e hora de captação |
| `numero_telefone` | `varchar` | Número do telefone com DDI e DDD |
| `nome` | `varchar` | Nome informado pelo lead |
| `acao` | `varchar` | Intenção (`visita` ou `simulacao`) |
| `renda` | `boolean` | `true` se maior que R$ 2.500,00; `false` se menor |
| `restricao` | `boolean` | `true` se possui restrição de crédito; `false` se não |
| `tipo_imovel` | `varchar` | Tipo de imóvel de interesse |
| `pausar_ia` | `boolean` | Indica se o chatbot de IA foi pausado para intervenção humana |

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
