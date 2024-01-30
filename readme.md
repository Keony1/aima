# Advanced Inventory Management API (AIMA)

[Report SQL explanation](docs/sql.md)

### Usage

Requirements

- Docker
- Docker Compose

#### Starting the Application in Development Mode

To start the application in development mode, follow these steps:

- Ensure you have Docker and Docker Compose installed.
- Run the following command in your terminal:

```bash
npm run compose:dev
```

This command will create a container for development purposes with a database.

#### Running Unit Tests

To run unit tests, execute the following command:

```bash
npm run test:unit
```

#### Running Integration Tests

To run integration tests, follow these steps:

Enter into the container to have the application environment disposable for testing:

```bash
docker exec -it api-dev sh
```

Once inside the container, run the following command:

```bash
npm run test:integration
```

#### Starting the Application in Production Mode

Simply run

```bash
npm run compose
```

## API

The applications's API documentation is available via [Swagger](https://swagger.io).

Once the application is running, open your browser and navigate to the following url

```http
  GET /api/docs
```

This will display a Swagger UI interface.

### Collection

To import the postman collection, please refer to [aima.postman_collection.json](./docs/aima.postman_collection.json)
