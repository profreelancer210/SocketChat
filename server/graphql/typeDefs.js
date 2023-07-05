"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  scalar Date
  type User {
    id: ID!
    username: String!
    nickname: String!
    phone: String!
    password: String!
    profileImage: String
    aboutInfo: String
    token: String!
    contacts: [Contact]
    backgroundImage: String
  }

  type Contact {
    status: String
    userId: ID
    displayMessage: DisplayMessage
  }

  type DisplayMessage {
    lastMessage: String
    sentAt: Date
  }

  type Chat {
    chatId: ID!
    users: [ID!]!
    messages: [Message]
  }

  type Message {
    sentBy: ID!
    sentAt: Date!
    sentTo: ID!
    messageContent: String!
    chatId: ID!
    messageType: String!
  }

  type Query {
    login(username: String!, password: String!): User!
    getChatMessages(users: [ID!]!): [Message]
    getChatImages(users: [ID!]!): [Message]
    getFilteredUsers(
      all: String
      contacts: [ID]
      requested: [ID]
      searchQuery: String
    ): [User!]!
    getUser: User!
  }

  type Mutation {
    createUser(
      username: String!
      phone: String!
      password: String!
      nickname: String!
    ): User!
    createChat(users: [ID!]!): Chat!
    postMessage(
      messageContent: String!
      usersId: [ID!]!
      messageType: String!
    ): Message!
    contactRequest(userId: ID!): User!
    acceptContactRequest(userId: ID!): User!
    removeContact(userId: ID!): String!
    updateUser(
      imageUrl: String
      aboutInfo: String
      nickname: String
      phone: String
      backgroundImage: String
    ): User!
  }

  type Subscription {
    messageCreated(chatId: ID!): Message!
  }
`;
