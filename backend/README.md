# Rent a Car Backend

Backend MVC para uma aplicacao de rent-a-car com Node.js, Express, PostgreSQL e Sequelize.

## Requisitos

- Node.js 18+
- PostgreSQL

## Instalacao

1. Copia o ficheiro `.env.example` para `.env` e ajusta as credenciais da base de dados.
2. Instala as dependencias.
3. Inicia o servidor.

```bash
npm install
npm run dev
```

## Endpoints

- `GET /health`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `GET /api/vehicles/available?data_inicio=YYYY-MM-DD&data_fim=YYYY-MM-DD`
- `GET /api/reservations`
- `POST /api/reservations`
- `PATCH /api/reservations/:id/status`
- `POST /api/unavailability`

## Models

- `User`
- `Vehicle`
- `Reservation`
- `Unavailability`

## Notas

- O servidor usa `sequelize.sync()` para criar as tabelas automaticamente em ambiente de desenvolvimento.
- A base de dados configurada por omissao e `rent_a_car`.
- A regra de sobreposicao bloqueia intervalos onde `data_inicio < data_fim_existente` e `data_fim > data_inicio_existente`.