"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const Chat_1 = __importDefault(require("../../model/Chat"));
const Message_1 = __importDefault(require("../../model/Message"));
const User_1 = __importDefault(require("../../model/User"));
const jwt_auth_1 = require("../../util/jwt-auth");
const pubsub = new graphql_subscriptions_1.PubSub();
exports.messageResolver = {
    Query: {},
    Mutation: {
        postMessage: (_, { messageContent, usersId, messageType }, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            const user = (yield User_1.default.find({ _id: usersId })).filter((user) => user._id.toString() !== (userAuth === null || userAuth === void 0 ? void 0 : userAuth._id.toString()));
            const userAuthContact = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => { var _a; return contact.userId.toString() === ((_a = user[0]) === null || _a === void 0 ? void 0 : _a._id.toString()); });
            const userContact = user[0].contacts.filter((contact) => contact.userId.toString() === (userAuth === null || userAuth === void 0 ? void 0 : userAuth._id.toString()));
            const chat = yield Chat_1.default.findOne({
                users: {
                    $all: usersId,
                },
                'users.2': {
                    $exists: false,
                },
            });
            if (!chat) {
                throw new apollo_server_express_1.UserInputError('No chat found');
            }
            if (!messageContent) {
                throw new apollo_server_express_1.UserInputError('Messages can not be empty');
            }
            const newMessage = new Message_1.default({
                sentBy: userAuth === null || userAuth === void 0 ? void 0 : userAuth.id,
                sentTo: user[0]._id,
                messageContent,
                sentAt: new Date(),
                chatId: chat._id,
                messageType,
            });
            chat.messages.push({
                sentBy: userAuth === null || userAuth === void 0 ? void 0 : userAuth.id,
                messageContent,
                sentAt: new Date(),
                messageType,
            });
            if (userAuthContact && (chat === null || chat === void 0 ? void 0 : chat.messages.length) > 0) {
                const isImage = ((_a = chat === null || chat === void 0 ? void 0 : chat.messages.slice(-1).pop()) === null || _a === void 0 ? void 0 : _a.messageType) !== 'text';
                const lastMessage = (_b = chat === null || chat === void 0 ? void 0 : chat.messages.slice(-1).pop()) === null || _b === void 0 ? void 0 : _b.messageContent;
                const messageObject = {
                    lastMessage: isImage ? 'Image 📷' : lastMessage,
                    sentAt: new Date(),
                };
                userAuthContact[0].displayMessage = messageObject;
                userContact[0].displayMessage = messageObject;
            }
            yield newMessage.save();
            yield chat.save();
            yield user[0].save();
            yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.save());
            pubsub.publish('POST_MESSAGE', {
                messageCreated: newMessage,
            });
            return newMessage;
        }),
    },
    Subscription: {
        messageCreated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)(() => pubsub.asyncIterator('POST_MESSAGE'), (payload, variables) => {
                return payload.messageCreated.chatId.toString() === variables.chatId;
            }),
        },
    },
};
