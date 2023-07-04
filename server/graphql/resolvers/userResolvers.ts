import { UserInputError, ExpressContext } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";

import User from "../../model/User";
import { auth } from "../../util/jwt-auth";
import { IUserInfo, IFilter, IUpdateUser } from "./interfaces/userInterfaces";

const pubsub = new PubSub();
export const userResolver = {
  Query: {
    login: async (_: any, { username, password }: IUserInfo) => {
      const user = await User.findOne({ username });
      if (!username || !password) {
        throw new UserInputError("One of the fields is empty");
      }
      if (!user) {
        throw new UserInputError("Wrong Credentials");
      }

      return { ...user._doc, id: user._id, token: user.createJWT() };
    },
    getFilteredUsers: async (
      _: any,
      { all, contacts, requested, searchQuery }: IFilter,
      context: ExpressContext
    ) => {
      const userAuth = await auth(context);
      const query = <IFilter>{};

      const contactId = userAuth?.contacts
        .filter((contact) => contact.status === "contact")
        .map((c) => c.userId);

      const requestedId = userAuth?.contacts
        .filter((contact) => contact.status === "requested")
        .map((c) => c.userId);

      if (all && !contacts && !requested) {
        query.all = all;
      }

      if (contacts) {
        query._id = contactId;
      }
      if (requested) {
        query._id = requestedId;
      }

      let queryResult = User.find(query);

      if (searchQuery) {
        queryResult = User.find({
          nickname: { $regex: searchQuery, $options: "i" },
        });
      }

      const result = await queryResult;

      return result.filter(
        (user) => userAuth?._id.toString() !== user._id.toString()
      );
    },

    getUser: async (_: any, {}, context: ExpressContext) => {
      const user = await auth(context);
      return { ...user?._doc, id: user?._id, token: user?.createJWT() };
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      { username, password, nickname, phone }: IUserInfo
    ) => {
      const existUser = await User.findOne({ username });
      if (!username || !password) {
        throw new UserInputError("One of the fields is empty");
      }
      if (existUser) {
        throw new UserInputError("User is already exist");
      }

      const user = new User({
        username,
        nickname,
        phone,
        password,
      });

      const res = await user.save();

      return { ...res._doc, id: res._id, token: res.createJWT() };
    },

    contactRequest: async (
      _: any,
      { userId }: IUserInfo,
      context: ExpressContext
    ) => {
      const userAuth = await auth(context);
      const user = await User.findById(userId);

      const alreadyRequested = userAuth?.contacts.filter(
        (contact) =>
          contact.status === "requested" &&
          contact.userId.toString() === userId.toString()
      );

      if (!user) {
        throw new UserInputError("No user found");
      }

      if (alreadyRequested !== undefined && alreadyRequested.length > 0) {
        throw new UserInputError(
          "You already made a friend request with that user"
        );
      }

      userAuth?.contacts.push({
        status: "pending",
        userId,
        displayMessage: {
          lastMessage: "Has sent you a friend request.",
          sentAt: new Date(),
        },
      });
      user?.contacts.push({
        status: "requested",
        userId: userAuth?._id,
        displayMessage: {
          lastMessage: "A friend request has been sent.",
          sentAt: new Date(),
        },
      });

      await user.save();
      await userAuth?.save();

      return { ...userAuth?._doc, id: userAuth?._id };
    },
    acceptContactRequest: async (
      _: any,
      { userId }: IUserInfo,
      context: ExpressContext
    ) => {
      const userAuth = await auth(context);

      const pendingUser = await User.findById(userId);
      const permissionCheck = userAuth?.contacts.filter(
        (contact) =>
          contact.status === "pending" &&
          contact.userId.toString() === userId.toString()
      );

      const alreadyContact = userAuth?.contacts.filter(
        (contact) =>
          contact.status === "contact" &&
          contact.userId.toString() === userId.toString()
      );

      if (!pendingUser) {
        throw new UserInputError("No user found");
      }

      if (alreadyContact !== undefined && alreadyContact.length > 0) {
        throw new UserInputError("This user is already in your contacts list");
      }

      if (permissionCheck !== undefined && permissionCheck.length > 0) {
        throw new UserInputError("Permission denied!");
      }

      if (userAuth) {
        userAuth.contacts = userAuth?.contacts.filter(
          (contact) => contact.userId.toString() !== userId.toString()
        );
        pendingUser.contacts = pendingUser.contacts.filter(
          (contact) => contact.userId.toString() !== userAuth?._id.toString()
        );
      }

      pendingUser.contacts.push({
        status: "contact",
        userId: userAuth?._id,
        displayMessage: {
          lastMessage: "New contact! Say Hello!",
          sentAt: new Date(),
        },
      });
      userAuth?.contacts.push({
        status: "contact",
        userId,
        displayMessage: {
          lastMessage: "New contact! Say Hello!",
          sentAt: new Date(),
        },
      });

      await userAuth?.save();
      await pendingUser.save();

      return { ...userAuth?._doc, id: userAuth?.id };
    },
    updateUser: async (
      _: any,
      { imageUrl, nickname, phone, aboutInfo, backgroundImage }: IUpdateUser,
      context: ExpressContext
    ) => {
      const userAuth = await auth(context);

      if (userAuth) {
        userAuth.profileImage = imageUrl || userAuth.profileImage;
        userAuth.nickname = nickname || userAuth.nickname;
        userAuth.phone = phone || userAuth.phone;
        userAuth.aboutInfo = aboutInfo || userAuth.aboutInfo;
        userAuth.backgroundImage = backgroundImage || userAuth.backgroundImage;
      }
      await userAuth?.save();
      return {
        ...userAuth?._doc,
        id: userAuth?._id,
        token: userAuth?.createJWT(),
      };
    },
    removeContact: async (
      _: any,
      { userId }: IUserInfo,
      context: ExpressContext
    ) => {
      const userAuth = await auth(context);
      const user = await User.findById(userId);

      if (!user) {
        throw new UserInputError("No user found");
      }

      if (userAuth) {
        userAuth.contacts = userAuth?.contacts.filter(
          (contact) => contact.userId.toString() !== userId.toString()
        );
        user.contacts = user?.contacts.filter(
          (contact) => contact.userId.toString() !== userAuth?._id.toString()
        );
      }
      await user.save();
      await userAuth?.save();

      return `You have removed successfuly ${user?.nickname} from your contact list`;
    },
  },
};
