# Coursera Server

A NestJS backend application for managing courses.

## Prerequisites

- Node.js (v16 or higher)
- Bun package manager
- MongoDB running locally or accessible remotely

## Installation

```bash
# Install dependencies
bun install
```

## Configuration

The application is configured to connect to MongoDB at `mongodb://localhost:27017/coursera`. If you need to change this connection string, edit the `src/database/database.module.ts` file.

## Running the Application

```bash
# Development mode with auto-reload
bun run start:dev

# Run in debug mode
bun run start:debug

# Standard development mode
bun run start

# Production mode
bun run start:prod
```

The application will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

Once running, you can access:
- API at: http://localhost:3000
- API Documentation (Swagger): http://localhost:3000/api-docs

## Running with Docker

### Prerequisites
- Docker and Docker Compose installed on your system

### Development Setup
```bash
# Build and start the application with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f api
```

### Environment Variables
The application requires the following environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: (Optional) Port to run the application on (default: 3000)

For local development, create a `.env` file in the project root with these variables. For production deployment, set these variables in your deployment environment.

### Production Deployment
When deploying to production:
1. Ensure environment variables are set in your hosting environment
2. Do not include the `.env` file in your deployment
3. Build the Docker image: `docker build -t coursera-server .`
4. Run the container with proper environment variables:
   ```bash
   docker run -d -p 3000:3000 \
     -e MONGO_URI=your_mongo_uri \
     -e JWT_SECRET=your_jwt_secret \
     coursera-server
   ```

## Deployment with Docker Compose

For development or staging environments, you can use Docker Compose which includes a MongoDB instance:

```bash
# Start the services
docker-compose up -d

# Stop the services
docker-compose down

# View logs
docker-compose logs -f
```

## Troubleshooting Docker Deployment

If you encounter issues with MongoDB connection:

1. Verify your MongoDB URI is correctly formatted (should start with `mongodb://` or `mongodb+srv://`)
2. If using a local MongoDB with Docker, use `host.docker.internal` instead of `localhost` to access the host machine
3. Ensure your MongoDB instance is accessible from the container network
4. Check logs for connection errors using: `docker logs <container_id>`

## API Endpoints

- `GET /courses` - Get all courses
- `GET /courses/:id` - Get a specific course by ID
- `POST /courses` - Create a new course

## Example Course Payload

```json
{
  "title": "Introduction to NestJS",
  "description": "Learn the basics of NestJS framework",
  "instructor": "John Doe",
  "duration": 120
}
```

## Project Structure

- `src/courses` - Course module with controller, service, and schema
- `src/database` - Database module for MongoDB connection
- `src/logger` - Winston logger configuration
- `src/users` - User management module
- `src/auth` - Authentication and authorization module

## Error Handling

The application uses Winston for error logging. Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ bun install
```

## Compile and run the project

```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod
```

## Run tests

```bash
# Unit tests
bun run test

# Watch mode for tests
bun run test:watch

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ bun install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
