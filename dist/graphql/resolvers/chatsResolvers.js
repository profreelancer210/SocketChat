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
exports.chatResolvers = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const Chat_1 = __importDefault(require("../../model/Chat"));
const Message_1 = __importDefault(require("../../model/Message"));
const jwt_auth_1 = require("../../util/jwt-auth");
exports.chatResolvers = {
    Query: {
        getChatMessages: (_, { users }, context) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, jwt_auth_1.auth)(context);
            const chat = yield Chat_1.default.findOne({
                users: {
                    $all: users,
                },
                'users.2': {
                    $exists: false,
                },
            });
            const chatId = chat === null || chat === void 0 ? void 0 : chat._id;
            const messages = yield Message_1.default.find({ chatId });
            if (!chat) {
                throw new apollo_server_express_1.UserInputError('No chat found');
            }
            return messages;
        }),
        getChatImages: (_, { users }, context) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, jwt_auth_1.auth)(context);
            const chat = yield Chat_1.default.findOne({
                users: {
                    $all: users,
                },
                'users.2': {
                    $exists: false,
                },
            });
            const chatId = chat === null || chat === void 0 ? void 0 : chat._id;
            const messages = yield Message_1.default.find({ chatId });
            const images = messages === null || messages === void 0 ? void 0 : messages.filter((message) => message.messageType !== 'text');
            return images;
        }),
    },
    Mutation: {
        createChat: (_, { users }) => __awaiter(void 0, void 0, void 0, function* () {
            const existChat = yield Chat_1.default.find({ users });
            if (existChat.length > 0) {
                throw new apollo_server_express_1.UserInputError('Chat is already exist!');
            }
            const chat = new Chat_1.default({
                users,
                messages: [],
            });
            const res = yield chat.save();
            return Object.assign(Object.assign({}, res._doc), { chatId: res._id });
        }),
    },
};
//# sourceMappingURL=chatsResolvers.js.map