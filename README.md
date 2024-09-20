## A aplicação consiste em um api de gerenciamento de campanhas.

Este projeto é uma aplicação web construída com Next.js 14, utilizando Docker, Prisma como ORM e PostgreSQL como banco de dados. Também inclui testes automatizados para garantir a qualidade do código.

## Pré-requisitos

Antes de começar, verifique se você tem os seguintes pré-requisitos instalados:

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (recomendado: versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

Configurando Variáveis de Ambiente


## Crie um arquivo .env na raiz do projeto com as variáveis semelhantes ao de .env.example, que está na raiz do projeto.

## Configurando Docker
O projeto já inclui um Dockerfile e um docker-compose.yml. Você pode iniciar a aplicação com o seguinte comando:
    docker-compose up --build

Após a instalação do Docker, é necessário executar os comandos do Prisma:
    npx prisma migrate dev
    npx prisma generate 

Com isso, você pode executar os comandos para iniciar a aplicação:
    npm run build 
    npm run dev

A aplicação inclui testes dos endpoints. Para executá-los, basta iniciar:
    npm run test
