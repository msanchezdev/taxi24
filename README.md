<p align="center">
  <img src="assets/logo.png" alt="Taxi24, Your Ride, Your Way" width="100%" style="max-width: 400px;" title="Taxi24, Your Ride, Your Way" />
</p>

# Taxi24

Taxi24 is a startup focused on revolutionizing the transportation industry by providing a white-label solution. The platform provides a set of APIs that can be used by other companies to manage their passenger fleet, simplifying the process and streamlining operations.

## Table of Contents

- [Taxi24](#taxi24)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Pre-requisites](#pre-requisites)
    - [Running locally](#running-locally)
  - [Testing](#testing)
  - [Usage](#usage)
    - [Multi-tenancy](#multi-tenancy)
  - [License](#license)

## Installation

To use Taxi24, follow these steps:

### Pre-requisites

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) _(optional)_
- [Docker Compose](https://docs.docker.com/compose/) _(recommended if using Docker)_
- [MongoDB](https://www.mongodb.com/)
  - Recommended to use Docker and Docker Compose
  - Alternatively, you can install MongoDB locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Running locally

1. Clone the repository
2. Install dependencies using `yarn install`
3. Copy the `.env.example` file to `.env` and fill in the required values
4. (If using MongoDB locally) Run the database using one of the following commands:

   ```bash
   # using Docker Compose
   $ docker-compose up mongo -d

   # using Docker
   $ docker run -d -p 27017:27017 -v /path/to/data:/data/db mongo

   # using MongoDB
   $ mongod
   ```

   _(If using MongoDB Atlas) Replace the `MONGO_URI` value in `.env` with the connection string provided by MongoDB Atlas_

5. Run the application using one of the following commands:

   ```bash
   # development
   $ yarn run start

   # watch mode
   $ yarn run start:dev

   # production mode
   $ yarn run start:prod

   # or with Docker Compose
   $ docker-compose up api -d # you can just run docker-compose up -d to start both the API and the database
   ```

   <!-- TODO: 6. Open [http://localhost:3000](http://localhost:3000) to view the Swagger documentation. -->

## Testing

**Pre-requisites**

- Create a `.env.test` file for tests' environment variables\*\*
- Have the database running (see [Running locally](#running-locally))

To run the tests, use one of the following commands:

```bash
$ yarn run test

# test coverage
$ yarn run test:cov
```

## Usage

### Multi-tenancy

Taxi24 supports multi-tenancy, allowing multiple companies to use the platform at the same time. To use the platform, you must first create a company and then use the company's API key to access the APIs.

## License

This project is licensed for the purpose of evaluating the owner only. Under no circumstances may this project be used publicly, commercially or for any other purpose without the express written consent of the owner.

This license grants the licensee a non-exclusive, non-transferable, limited license to use the software solely for the purpose of evaluating the owner. Any other use, including but not limited to reproduction, modification, distribution, or sale of the software, is strictly prohibited.

The owner of this software is not responsible for any damages or liabilities arising from the use of this software, including but not limited to direct, indirect, incidental, or consequential damages.

By using this software, the licensee agrees to be bound by the terms of this license.

More details can be found in the [LICENSE](LICENSE) file.
