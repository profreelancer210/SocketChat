"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_iso_date_1 = require("graphql-iso-date");
const userResolvers_1 = require("./userResolvers");
const chatsResolvers_1 = require("./chatsResolvers");
const messageResolvers_1 = require("./messageResolvers");
exports.default = {
    Date: graphql_iso_date_1.GraphQLDateTime,
    Query: Object.assign(Object.assign(Object.assign({}, userResolvers_1.userResolver.Query), chatsResolvers_1.chatResolvers.Query), messageResolvers_1.messageResolver.Query),
    Mutation: Object.assign(Object.assign(Object.assign({}, userResolvers_1.userResolver.Mutation), chatsResolvers_1.chatResolvers.Mutation), messageResolvers_1.messageResolver.Mutation),
    Subscription: Object.assign({}, messageResolvers_1.messageResolver.Subscription),
};
