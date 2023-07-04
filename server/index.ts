import { ApolloServer, ExpressContext } from 'apollo-server-express';
import 'dotenv/config';
import express from 'express';
import { typeDefs } from './graphql/typeDefs';
import { connectDB } from './database/connect';
import resolvers from './graphql/resolvers/index';
import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';

const app = express();
const pubsub = new PubSub();

const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: 'bounded',
  context: ({ req, res }: ExpressContext) => ({ req, res, pubsub }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

const startServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });
  try {
    await connectDB(process.env.MONGO_URI!);
    httpServer.listen(process.env.PORT || 4000, () =>
      console.log('Server is up!')
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
