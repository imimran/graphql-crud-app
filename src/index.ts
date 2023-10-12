import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser'
import { typeDefs } from './graphql/typeDefs'
import resolvers from './graphql/resolvers'
import { connectToDatabase } from './db';


const app = express();

// connect db
connectToDatabase()


const httpServer = http.createServer(app);

// Set up Apollo Server
const bootstrapServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );

  const Port = process.env.PORT || 4000

  await new Promise<void>((resolve) => httpServer.listen({ port: Port }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000`);
}

bootstrapServer()