import { gql } from '@apollo/client';

export const CREATE_CHAT = gql`
  mutation ($users: [ID!]!) {
    createChat(users: $users) {
      users
      chatId
      messages {
        chatId
        messageContent
        sentAt
        sentBy
      }
    }
  }
`;

export const POST_MESSAGE = gql`
  mutation ($messageContent: String!, $usersId: [ID!]!, $messageType: String!) {
    postMessage(
      messageContent: $messageContent
      usersId: $usersId
      messageType: $messageType
    ) {
      chatId
      messageContent
      sentAt
      sentBy
      messageType
    }
  }
`;
