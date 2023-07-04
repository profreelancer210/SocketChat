import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  query ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      aboutInfo
      phone
      nickname
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

export const GET_USER = gql`
  query {
    getUser {
      username
      aboutInfo
      nickname
      phone
      backgroundImage
      contacts {
        displayMessage {
          lastMessage
          sentAt
        }
        status
        userId
      }
      id
      token
      profileImage
    }
  }
`;

export const GET_FILTERED_USERS = gql`
  query (
    $all: String
    $contacts: [ID]
    $requested: [ID]
    $searchQuery: String
  ) {
    getFilteredUsers(
      all: $all
      contacts: $contacts
      requested: $requested
      searchQuery: $searchQuery
    ) {
      aboutInfo
      id
      nickname
      phone
      profileImage

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
