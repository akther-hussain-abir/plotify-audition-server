import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PhaseResolver } from './resolver';

async function bootstrap() {
  const app = express();

  const schema = await buildSchema({
    resolvers: [PhaseResolver],
  });

  const server = new ApolloServer({ schema });

  await server.start();
  await server.applyMiddleware({ app });

  const PORT = 4000;

  app.listen({ port: PORT }, () => {
    console.log(`Awesome, Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

bootstrap();
