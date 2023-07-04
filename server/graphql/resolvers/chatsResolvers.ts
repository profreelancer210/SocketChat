import { ExpressContext, UserInputError } from 'apollo-server-express';
import Chat from '../../model/Chat';
import Message from '../../model/Message';
import { auth } from '../../util/jwt-auth';
import { IChat } from './interfaces/chatsInterface';

export const chatResolvers = {
  Query: {
    getChatMessages: async (
      _: any,
      { users }: IChat,
      context: ExpressContext
    ) => {
      await auth(context);
      const chat = await Chat.findOne({
        users: {
          $all: users,
        },
        'users.2': {
          $exists: false,
        },
      });

      const chatId = chat?._id;

      const messages = await Message.find({ chatId });

      if (!chat) {
        throw new UserInputError('No chat found');
      }

      return messages;
    },
    getChatImages: async (
      _: any,
      { users }: IChat,
      context: ExpressContext
    ) => {
      await auth(context);
      const chat = await Chat.findOne({
        users: {
          $all: users,
        },
        'users.2': {
          $exists: false,
        },
      });

      const chatId = chat?._id;

      const messages = await Message.find({ chatId });
      const images = messages?.filter(
        (message) => message.messageType !== 'text'
      );

      return images;
    },
  },
  Mutation: {
    createChat: async (_: any, { users }: IChat) => {
      const existChat = await Chat.find({ users });

      if (existChat.length > 0) {
        throw new UserInputError('Chat is already exist!');
      }

      const chat = new Chat({
        users,
        messages: [],
      });

      const res = await chat.save();

      return { ...res._doc, chatId: res._id };
    },
  },
};
