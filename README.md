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

## About

Shurl Express is a web application that allows you to shorten URLs. It was developed as part of a code challenge in a recruitment process.

The Node.js version, as specified in the [Dockerfile](Dockerfile), is `22.x`, which was the latest stable version of Node.js as of the launch of this app.
Since this was a development challenge, tsx was used. Therefore, no building of the app is done on the container.

> Para uma versão em português do README, acesse o [README em português](README_pt-br.md)

### Requirements

Here are some requirements made by the recruiter, simplified:

- Use latest stable version of Node.js
- Use TypeScript
- Implement token-based authentication, with user registration and login
- Shorten URLs with a maximum length of 6 characters for the slug
- Track the number of times each shortened URL is accessed
- Implement logical deletion of URLs
- Registers must have a update timestamp
- Build endpoints to:
  - Shorten URLs (token optional)
  - Access shortened URLs
  - List shortened URLs by user (token required)
  - Update shortened URLs (token required)
  - Delete shortened URLs (token required)

### Extras

- Use Docker Compose to build and run the project
- Implement Swagger documentation
- Configure pre-commit hooks

## Setup

### 1. Clone this repository

```sh
git clone https://github.com/GuilhermeCAz/shurl_express.git
cd shurl_express
```

### 2. Create a `.env` file according to [.env.example](.env.example)

### 3. Build the Docker images and run the containers

```sh
docker compose up --build --detach
```

The following command can be used instead:

```sh
npm run up
```

**Server should now be accessible at `http://localhost:3000`.**

To stop the server, use the following command:

```sh
docker compose down
```

## API Endpoints

### Authentication

- `POST /register`: Register a new user.
- `POST /login`: Log in and obtain a JWT.

### URL Management

- `POST /urls`: Shorten a URL. Requires valid `originalURL` in the request body.
- `GET /urls`: List all URLs associated with the authenticated user.
- `PATCH /urls/:slug`: Update the original URL for a specific slug. Requires valid `originalURL` in the request body.
- `DELETE /urls/:slug`: Logically delete a URL by slug.
- `GET /:slug`: Redirect to the original URL.

## Usage

The following commands can be used to interact with the API. **Alternatively, you can use the Swagger UI at `http://localhost:3000/docs`**.

### Register User | `optional`

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

### Login | `optional` -> returns JWT

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

After logging in, you can use the JWT you received in the Authorization header by adding the following to your request:

```sh
-H 'Authorization: Bearer ${JWT}'
```

This enables associating shortened URLs with the user. Therefore, you are authorized to list, edit and delete URLs shortened by you.

### Shorten URL | `token optional`

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

### List User URLs | `token required`

```sh
curl -X 'GET' \
  'http://localhost:3000/urls' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer ${JWT}'
```

### Update URL | `token required`

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

### Delete URL | `token required`

```sh
curl -X 'DELETE' \
  'http://localhost:3000/urls/${slug}' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer ${JWT}'
```

### Redirect

```sh
curl -X 'GET' \
 'http://localhost:3000/${slug}' \
 -H 'accept: */*' \
```

#### Note

Swagger UI `try it out` button does not work for this request due to CORS policy. Use the browser instead.
