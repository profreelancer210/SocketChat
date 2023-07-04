import { ExpressContext, UserInputError } from 'apollo-server-express';
import { PubSub, withFilter } from 'graphql-subscriptions';
import mongoose from 'mongoose';
import Chat from '../../model/Chat';
import Message from '../../model/Message';
import User from '../../model/User';
import { auth } from '../../util/jwt-auth';

interface IMessageProps {
  messageContent: string;
  chatId: mongoose.Schema.Types.ObjectId;
  usersId: Array<mongoose.Schema.Types.ObjectId>;
  messageType: 'text' | 'image/jpeg' | 'image/png' | null;
  lastMessage: string | null;
}

interface IExpressContext extends ExpressContext {
  pubsub?: any;
}

const pubsub = new PubSub();

export const messageResolver = {
  Query: {},
  Mutation: {
    postMessage: async (
      _: any,
      { messageContent, usersId, messageType }: IMessageProps,
      context: IExpressContext
    ) => {
      const userAuth = await auth(context);
      const user = (await User.find({ _id: usersId })).filter(
        (user) => user._id.toString() !== userAuth?._id.toString()
      );

      const userAuthContact = userAuth?.contacts.filter(
        (contact) => contact.userId.toString() === user[0]?._id.toString()
      );

      const userContact = user[0].contacts.filter(
        (contact) => contact.userId.toString() === userAuth?._id.toString()
      );

      const chat = await Chat.findOne({
        users: {
          $all: usersId,
        },
        'users.2': {
          $exists: false,
        },
      });

      if (!chat) {
        throw new UserInputError('No chat found');
      }

      if (!messageContent) {
        throw new UserInputError('Messages can not be empty');
      }

      const newMessage = new Message({
        sentBy: userAuth?.id,
        sentTo: user[0]._id,
        messageContent,
        sentAt: new Date(),
        chatId: chat._id,
        messageType,
      });

      chat.messages.push({
        sentBy: userAuth?.id,
        messageContent,
        sentAt: new Date(),
        messageType,
      });

      if (userAuthContact && chat?.messages.length > 0) {
        const isImage = chat?.messages.slice(-1).pop()?.messageType !== 'text';
        const lastMessage = chat?.messages.slice(-1).pop()?.messageContent;
        const messageObject = {
          lastMessage: isImage ? 'Image 📷' : lastMessage!,
          sentAt: new Date(),
        };
        userAuthContact[0].displayMessage = messageObject;
        userContact[0].displayMessage = messageObject;
      }

      await newMessage.save();
      await chat.save();
      await user[0].save();
      await userAuth?.save();

      pubsub.publish('POST_MESSAGE', {
        messageCreated: newMessage,
      });

      return newMessage;
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('POST_MESSAGE'),
        (payload, variables) => {
          return payload.messageCreated.chatId.toString() === variables.chatId;
        }
      ),
    },
  },
};
