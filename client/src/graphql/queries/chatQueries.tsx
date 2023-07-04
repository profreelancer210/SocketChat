import { gql } from '@apollo/client';

export const GET_CHAT_MESSAGES = gql`
  query ($users: [ID!]!) {
    getChatMessages(users: $users) {
      chatId
      messageContent
      sentAt
      sentBy
      messageType
    }
  }
`;

export const GET_CHAT_IMAGES = gql`
  query ($users: [ID!]!) {
    getChatImages(users: $users) {
      messageContent
    }
  }
`;

export const GET_SUBSCRIPTION_MESSAGES = gql`
  subscription ($chatId: ID!) {
    messageCreated(chatId: $chatId) {
      chatId
      messageContent
      sentAt
      sentBy
      messageType
    }
  }
`;
