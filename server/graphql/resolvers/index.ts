import { GraphQLDateTime } from 'graphql-iso-date';
import { userResolver } from './userResolvers';
import { chatResolvers } from './chatsResolvers';
import { messageResolver } from './messageResolvers';

export default {
  Date: GraphQLDateTime,
  Query: {
    ...userResolver.Query,
    ...chatResolvers.Query,
    ...messageResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...chatResolvers.Mutation,
    ...messageResolver.Mutation,
  },
  Subscription: {
    ...messageResolver.Subscription,
  },
};
