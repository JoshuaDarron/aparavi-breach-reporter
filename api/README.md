# API

This api provides the business logic that interacts with the data stored in PostgreSQL. We're utilizing the REST api framework, providing routes for the client to work with.

## Summary

  - [Getting Started](#getting-started)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)
  
## Getting Started

These instructions will get you a copy of the api up and running on
your local machine for development and testing purposes.

### Prerequisites

  - [Node.js](https://nodejs.org/en/download/) - Javascript framework, used to compile
    and run the api code
  - [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) - Node 
    package manager
  - [MongoDB](https://www.mongodb.com/try/download/community/) - Database used for the 
    ability to query large amounts of data

### Environment Setup

Step 1: Navigate to api directory

    cd ./pageturnreviews/api

Step 2: Create .env file

    touch .env

Step 3: Copy & Paste example into .env

    ; Environment
    NODE_ENV=development | production
    PORT=3000
    ; OpenAI
    OPENAI_API_KEY=token
    ; DB
    DB_DIALECT=postgresql
    DB_HOST=127.0.0.1
    DB_NAME=page_turn_reviews
    DB_USER=postgres
    DB_PASSWORD=password

Step 4: Install packages

    npm install

Step 5: Initialize database tables

    npm run migrate:up

Step 6: Start development server

    npm run serve

Step 7: Build project

    npm run build

## Other Setups

  - **Client** - [Setup](../client)

## Authors

  - **Joshua Phillips** - *Portfolio* -
    [joshuadarron.com](https://joshuadarron.com/)

## License

This project is licensed under the [CC0 1.0 Universal](../LICENSE.md)
Creative Commons License - see the [LICENSE.md](../LICENSE.md) file for
details

## Acknowledgments

  - Hat tip to anyone whose code was used
