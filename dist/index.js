"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const typeDefs_1 = require("./graphql/typeDefs");
const connect_1 = require("./database/connect");
const index_1 = __importDefault(require("./graphql/resolvers/index"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const http_1 = require("http");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const schema_1 = require("@graphql-tools/schema");
const cors_1 = __importDefault(require("cors"));
const apollo_server_core_1 = require("apollo-server-core");
const app = (0, express_1.default)();
const pubsub = new graphql_subscriptions_1.PubSub();
app.use((0, cors_1.default)({
    origin: "*",
}));
const httpServer = (0, http_1.createServer)(app);
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.typeDefs, resolvers: index_1.default });
const wsServer = new ws_1.WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
const apolloServer = new apollo_server_express_1.ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: ({ req, res }) => ({ req, res, pubsub }),
    plugins: [
        (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
        {
            serverWillStart() {
                return __awaiter(this, void 0, void 0, function* () {
                    return {
                        drainServer() {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield serverCleanup.dispose();
                            });
                        },
                    };
                });
            },
        },
        (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
    ],
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield apolloServer.start();
    apolloServer.applyMiddleware({ app: app });
    try {
        yield (0, connect_1.connectDB)(process.env.MONGO_URI);
        httpServer.listen(process.env.PORT || 4000, () => console.log("Server is up!"));
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
//# sourceMappingURL=index.js.map