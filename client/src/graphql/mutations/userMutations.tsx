import { gql } from "@apollo/client";

export const APPROVE_CONTACT_REQUEST = gql`
  mutation ($userId: ID!) {
    acceptContactRequest(userId: $userId) {
      id
    }
  }
`;

export const CONTACT_REQUEST = gql`
  mutation ($userId: ID!) {
    contactRequest(userId: $userId) {
      id
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation (
    $aboutInfo: String
    $imageUrl: String
    $nickname: String
    $backgroundImage: String
  ) {
    updateUser(
      aboutInfo: $aboutInfo
      imageUrl: $imageUrl
      nickname: $nickname
      backgroundImage: $backgroundImage
    ) {
      id
      aboutInfo
      nickname
      profileImage
      token
      username
      contacts {
        displayMessage {
          lastMessage
          sentAt
        }
        status
        userId
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation (
    $username: String!
    $password: String!
    $nickname: String!
    $phone: String!
  ) {
    createUser(
      username: $username
      password: $password
      nickname: $nickname
      phone: $phone
    ) {
      username
      aboutInfo
      nickname
      phone
      contacts {
        displayMessage {
          lastMessage
          sentAt
        }
        status
        userId
      }
      id
      backgroundImage
      token
      profileImage
    }
  }
`;
