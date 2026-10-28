# 🎬 Overlabs - Teste Técnico (Backend Node.js)

Este repositório contém a solução do teste técnico para a vaga de assistente backend na **Overlabs**. A aplicação consiste em uma API REST desenvolvida em **Node.js** com **TypeScript**, **Express** e **Vitest**, responsável por consumir uma API de metadados de filmes, processar e transformar as informações conforme as regras de negócio especificadas, e disponibilizá-las no endpoint `GET /filmes`.
O documento sugere a utilização de algumas IAs. Pessoalmente, utilizei o antigravity pelo terminal, pois acelerou muito o processo de desenvolvimento principalmente na parte de testes e docs. Considero essencial a utilização de forma controlada, pela velocidade na hora de codar e por ser um excelente tira-dúvidas.
Optei por criar um readme completo, contemplando desde as stacks utilizadas, decisões tomadas... até a estrutura do projeto e suas respostas esperadas. Um ponto de destaque foi o elenco, pois observei que não existe uma tratativa quanto a este quesito, então optei por deixá-lo opcional.

---

## 📑 Sumário

- [Relato dos Passos e Decisões Técnicas](#-relato-dos-passos-e-decisões-técnicas)
- [Regras de Negócio e Transformações](#-regras-de-negócio-e-transformações)
- [Arquitetura e Estrutura de Pastas](#-arquitetura-e-estrutura-de-pastas)
- [Stack Tecnológica](#-stack-tecnológica)
- [Como Instalar e Rodar](#-como-instalar-e-rodar)
- [Executando os Testes](#-executando-os-testes)
- [Endpoints da API](#-endpoints-da-api)

---

## 🧭 Relato dos Passos e Decisões Técnicas

Atendendo ao **Objetivo 1** do desafio (*"Crie um documento relatando os passos que você trilhou para chegar no resultado final"*), abaixo detalho toda a trajetória de desenvolvimento:

### 1. Análise dos Requisitos e Exploração dos Dados
- Leitura e interpretação do documento de especificação (`Desafio_Estagio_Backend_NodeJS.pdf`).
- Realização de requisições exploratórias à API externa fornecida no desafio para mapear os tipos e variações dos dados:
  - Formato monetário com strings contendo milhões e bilhões (ex.: `"$6 milhões"`, `"$1.142 bilhão"`, `"$2.208 bilhões"`).
  - Listas de premiações com relevância numérica.
  - Variação de idiomas nas sinopses (`pt-br`, `en`, `fr`, etc.), identificando casos onde filmes possuem apenas inglês (ex.: *O Senhor dos Anéis*) ou apenas francês (ex.: *Matrix*).

### 2. Escolha da Stack e Ferramental
- **TypeScript**: Adotado para fornecer tipagem estática rigorosa, garantindo segurança ao manipular contratos de dados brutos e parseados, além de evitar erros em tempo de execução.
- **Express**: Framework web minimalista, amplamente utilizado no ecossistema Node.js, ideal para a criação de rotas e middlewares de forma clara, algo que já utilizei em projetos anteriores.
- **Vitest**: Test runner moderno, foi mais um "plus" que achei interessante implementar com a ajuda do antigravity, para acelerar o desenvolvimento.
- **Supertest**: Para testes de integração de ponta a ponta simulando requisições HTTP nas rotas da aplicação.
- **TSX**: Executor ágil de TypeScript para o ambiente de desenvolvimento (`watch mode`).

### 3. Modularização e Funções Puras (Princípios SOLID)
Optei por isolar cada regra de transformação em módulos utilitários e funções puras (fáceis de testar e livres de efeitos colaterais):
- `currencyParser`: Responsável por converter strings como `"$6 milhões"` e `"$1.142 bilhão"` em números reais, calcular a diferença (`bilheteria - orcamento`) e formatar a saída em string legível (`"$239 milhões"`, `"$1.048 bilhões"`).
- `synopsisParser`: Implementa o algoritmo de busca prioritária da sinopse (`pt-br` ➔ `en` ➔ primeira ocorrência).
- `awardParser`: Varre os prêmios identificando o de maior relevância via `Array.prototype.reduce`.
- `ratingParser`: Localiza a avaliação com fonte `"IMDb"` e formata o valor numérico para string.
- `movieParser`: Orquestra todas as transformações de um filme bruto para a entidade final parseada.

> **Observação sobre o campo `elenco`:**  
> No item 2 da descrição do teste, é solicitada a remoção das propriedades `locações`, `poster` e `trailer`. No entanto, no JSON de exemplo de saída esperado (`Resultado esperado de filme parseado`), o campo `elenco` também não aparece.  
> Por padrão, a API segue rigorosamente o formato do JSON de exemplo esperado (sem `elenco`), mas oferece o parâmetro opcional `?includeElenco=true` caso seja desejado manter essa propriedade.

### 4. Camada de Serviço e Cliente HTTP
- Criação de `MovieApiClient` com timeout defensivo de 10 segundos via `AbortSignal.timeout` e tratamento resiliente de erros de rede.
- Criação de `MovieService` aplicando injeção de dependência para desacoplar a requisição externa da lógica de negócio.

### 5. Camada HTTP e Tratamento de Erros
- Implementação de `MovieController`, middlewares para CORS, parsing de JSON e um middleware global de captura e resposta de erros padronizados.

### 6. Garantia de Qualidade com Testes Automatizados
- Cobertura completa com testes unitários para todas as funções de parsing e cálculo.
- Testes de integração validando a rota `/filmes`, garantindo que os campos removidos não estejam presentes e que os campos novos atendam aos tipos e valores especificados.

---

## ⚙️ Regras de Negócio e Transformações

| Propriedade Original | Nova Propriedade | Regra Aplicada |
| :--- | :--- | :--- |
| `orcamento` + `bilheteria` | `lucro` | Calcula `bilheteria - orcamento` e formata como string (ex.: `"$239 milhões"` ou `"$1.048 bilhões"`). |
| `premios` | `maiorPremiacao` | Identifica o item com maior valor de `relevancia` e retorna o `nome`. |
| `duracao` | `duracaoSegundos` | Converte minutos para segundos (`minutos * 60`). |
| `ratings` | `notaIMDb` | Extrai a avaliação de fonte `IMDb` como string (ex.: `"9.2"`). |
| `sinopse` | `sinopse` | Seleciona apenas 1 sinopse: prioriza `pt-br`, senão `en`, senão a primeira disponível. |
| `locacoes`, `poster`, `trailer` | *(removidas)* | Excluídas do objeto de saída. |

---

## 🏗 Arquitetura e Estrutura de Pastas

```text
desafio-overlabs/
├── dist/                     # Código compilado em JavaScript (gerado no build)
├── src/
│   ├── @types/ / types/      # Interfaces TypeScript (RawMovie, ParsedMovie, etc.)
│   ├── config/               # Configuração e variáveis de ambiente (env.ts)
│   ├── controllers/          # Controladores HTTP (movieController.ts)
│   ├── services/             # Regras de negócio e cliente da API externa
│   ├── utils/                # Funções puras de transformação e parsing
│   ├── app.ts                # Configuração do Express, middlewares e rotas
│   └── server.ts             # Ponto de entrada (inicialização do servidor HTTP)
├── tests/
│   ├── unit/                 # Testes unitários de parsers, moeda, prêmios e sinopse
│   └── integration/          # Testes de integração da rota /filmes com supertest
├── .env.example              # Exemplo das variáveis de ambiente
├── package.json              # Dependências e scripts do projeto
├── tsconfig.json             # Configuração do TypeScript
└── README.md                 # Documentação e relatório técnico
```

---

## 🛠 Stack Tecnológica

- **Node.js** (v20+)
- **TypeScript** (v5+)
- **Express** (v5)
- **Vitest** (Test Runner)
- **Supertest** (Testes HTTP de integração)
- **TSX** (Execução TypeScript em desenvolvimento)
- **Cors** & **Dotenv**

---

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 20 ou superior instalado.
- [npm](https://www.npmjs.com/) instalado.

### 1. Clonar e instalar dependências
```bash
git clone <url-do-repositorio>
cd desafio-overlabs
npm install
```

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
*(Preencha a variável `FILMES_API_URL` no `.env` com a URL fornecida na descrição do teste).*

### 3. Executar em modo desenvolvimento
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

### 4. Executar em modo produção
```bash
npm run build
npm start
```

---

## 🧪 Executando os Testes

Para rodar todos os testes automatizados (unitários e de integração):

```bash
npm test
```

Para rodar em modo watch (assistindo alterações nos arquivos):

```bash
npm run test:watch
```

---

## 📡 Endpoints da API

### `GET /filmes`
Retorna a lista de filmes consumida da API externa e transformada conforme os requisitos.

#### Exemplo de Resposta (Status 200 OK):
```json
[
  {
    "titulo": "O Poderoso Chefão",
    "ano": 1972,
    "diretor": "Francis Ford Coppola",
    "genero": [
      "Crime",
      "Drama"
    ],
    "duracaoSegundos": 10500,
    "notaIMDb": "9.2",
    "lucro": "$239 milhões",
    "maiorPremiacao": "Oscar de Melhor Filme",
    "sinopse": "Um chefão da máfia tenta transferir o controle de seu império clandestino para seu filho relutante."
  },
  {
    "titulo": "Interestelar",
    "ano": 2014,
    "diretor": "Christopher Nolan",
    "genero": [
      "Aventura",
      "Drama",
      "Ficção Científica"
    ],
    "duracaoSegundos": 10140,
    "notaIMDb": "8.6",
    "lucro": "$512 milhões",
    "maiorPremiacao": "Oscar de Melhores Efeitos Visuais",
    "sinopse": "Um grupo de exploradores espaciais viaja através de um buraco de minhoca em busca de um novo lar para a humanidade."
  }
]
```

#### Parâmetros de Consulta (Query Params):
- `includeElenco=true`: *(Opcional)* Inclui a lista de atores (`elenco`) no retorno de cada filme.

---

### `GET /`
Endpoint de healthcheck para verificar o status e a saúde da aplicação.
```json
{
  "status": "ok",
  "message": "API de Filmes Overlabs - Desafio Técnico",
  "endpoint": "/filmes"
}
```
