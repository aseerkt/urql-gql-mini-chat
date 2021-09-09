import http from 'http';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import ws from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import schema, { resolvers, typeDefs } from './graphql';

async function startApolloServer() {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    })
  );

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });
  await server.start();
  server.applyMiddleware({ app, cors: false });

  await new Promise((resolve) => {
    const customServer = httpServer.listen({ port: 4000 }, () => {
      const wsServer = new ws.Server({
        server: customServer,
        path: '/graphql',
      });

      useServer(
        // from the previous step
        { schema },
        wsServer
      );
      resolve();
    });
  });
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer().catch(console.error);
