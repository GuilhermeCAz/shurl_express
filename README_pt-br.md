# Shurl Express

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Logo](https://img.shields.io/badge/Node.js-%235FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript Logo](https://img.shields.io/badge/TypeScript-%233178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-black?logo=express)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-%232496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%234169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-%23FE0803?logo=typeorm)](https://typeorm.io/)
[![JWT](https://img.shields.io/badge/JWT-black?logo=jsonwebtokens)](https://jwt.io/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-%2385EA2D?logo=swagger&logoColor=white&color=null)](https://swagger.io/specification/)
[![Prettier](https://img.shields.io/badge/Prettier-darkblue?logo=prettier)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/ESLint-%234B32C3?logo=eslint)](https://eslint.org/)

## Sobre

Shurl Express é uma aplicação web que permite o encurtamento de URLs. Foi desenvolvida como parte de um code challenge em um processo seletivo.

A versão do node utilizada, como especificado na [Dockerfile](Dockerfile), é `22.x`, que é a versão estável mais recente do Node.js até o lançamento deste app.
Como este foi um desafio de desenvolvimento, optou-se pela utilização do tsx. Desta forma, não é feito o build da aplicação no container.

### Requisitos

Aqui são alguns requisitos feitos pelo recrutador, de forma simplificada:

- Usar a versão estável mais recente do Node.js
- Usar TypeScript
- Implementar autenticação baseada em tokens, com cadastro de usuário e login
- Encurtar URLs com um limite de 6 caracteres para o slug
- Contar o número de vezes que cada URL é acessada
- Implementar a exclusão lógica de URLs
- Registros devem ter uma data de atualização
- Construir endpoints para:
  - Encurtar URLs (token opcional)
  - Accessar URLs encurtadas
  - Listar URLs encurtadas pelo usuário (token obrigatório)
  - Atualizar URLs encurtadas (token obrigatório)
  - Deletar URLs encurtadas (token obrigatório)

### Extras

- Usar Docker Compose para construir e executar o projeto
- Implementar documentação Swagger
- Configurar pre-commit hooks

## Configuração

### 1. Clone este repository

```sh
git clone https://github.com/GuilhermeCAz/shurl_express.git
cd shurl_express
```

### 2. Crie um arquivo `.env`, conforme o [.env.example](.env.example)

### 3. Faça o build das imagens e as execute

```sh
docker compose up --build --detach
```

Alternativamente, execute o seguinte comando:

```sh
npm run up
```

**O servidor ficará acessível no endereço `http://localhost:3000`.**

Para interromper o servidor, execute o seguinte comando:

```sh
docker compose down
```

## Endpoints da API

### Autenticação

- `POST /register`: Registrar um usuário.
- `POST /login`: Logar e obter um token JWT.

### Gerenciamento de URLs

- `POST /urls`: Encurtar uma URL. Requer `originalURL` válido no corpo da requisição.
- `GET /urls`: Listar todas as URLs associadas ao usuário.
- `PATCH /urls/:slug`: Atualizar a URL original de um slug. Requer `originalURL` válido no corpo da requisição.
- `DELETE /urls/:slug`: Deletar logicamente uma URL pelo slug.
- `GET /:slug`: Redirecionar para a URL original.

## Uso

Os seguintes comandos podem ser usados para interagir com a API. **Alternativamente, você pode usar o Swagger UI, a partir do endereço `http://localhost:3000/docs`.**

### Registrar usuário | `opcional`

```sh
curl -X 'POST' \
  'http://localhost:3000/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "Password123"
}'
```

### Login | `opcional` -> retorna JWT

```sh
curl -X 'POST' \
  'http://localhost:3000/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "user@example.com",
  "password": "Password123"
}'
```

Após o login, é possível usar o token no cabeçalho das requisições seguintes. Basta adicionar este comando à requisição:

```sh
-H 'Authorization: Bearer ${JWT}'
```

Este comando habilita a associação de URLs com o usuário. Dessa forma, você é autorizado a listar, editar e excluir URLs encurtadas por você.

### Encurtar URL | `token opcional`

```sh
curl -X 'POST' \
  'http://localhost:3000/urls' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ${JWT}' \
  -H 'Content-Type: application/json' \
  -d '{
  "originalURL": "https://example.com"
}'
```

### Listar URLs do Usuário | `token obrigatório`

```sh
curl -X 'GET' \
  'http://localhost:3000/urls' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ${JWT}'
```

### Atualizar URL | `token obrigatório`

```sh
curl -X 'PATCH' \
  'http://localhost:3000/urls/${slug}' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ${JWT}' \
  -H 'Content-Type: application/json' \
  -d '{
  "originalURL": "https://example.com"
}'
```

### Deletar URL | `token obrigatório`

```sh
curl -X 'DELETE' \
  'http://localhost:3000/urls/${slug}' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer ${JWT}'
```

### Redirecionar para URL original

```sh
curl -X 'GET' \
 'http://localhost:3000/${slug}' \
 -H 'accept: */*' \
```

#### Observação

O botão `try it out` do Swagger UI não funciona para esta requisição, devido à política de CORS. Use diretamente o seu navegador.
