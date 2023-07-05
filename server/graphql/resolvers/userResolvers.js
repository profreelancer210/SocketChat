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
exports.userResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const User_1 = __importDefault(require("../../model/User"));
const jwt_auth_1 = require("../../util/jwt-auth");
const pubsub = new graphql_subscriptions_1.PubSub();
exports.userResolver = {
    Query: {
        login: (_, { username, password }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ username });
            if (!username || !password) {
                throw new apollo_server_express_1.UserInputError("One of the fields is empty");
            }
            if (!user) {
                throw new apollo_server_express_1.UserInputError("Wrong Credentials");
            }
            return Object.assign(Object.assign({}, user._doc), { id: user._id, token: user.createJWT() });
        }),
        getFilteredUsers: (_, { all, contacts, requested, searchQuery }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            const query = {};
            const contactId = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.status === "contact").map((c) => c.userId);
            const requestedId = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.status === "requested").map((c) => c.userId);
            if (all && !contacts && !requested) {
                query.all = all;
            }
            if (contacts) {
                query._id = contactId;
            }
            if (requested) {
                query._id = requestedId;
            }
            let queryResult = User_1.default.find(query);
            if (searchQuery) {
                queryResult = User_1.default.find({
                    nickname: { $regex: searchQuery, $options: "i" },
                });
            }
            const result = yield queryResult;
            return result.filter((user) => (userAuth === null || userAuth === void 0 ? void 0 : userAuth._id.toString()) !== user._id.toString());
        }),
        getUser: (_, {}, context) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, jwt_auth_1.auth)(context);
            return Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user._doc), { id: user === null || user === void 0 ? void 0 : user._id, token: user === null || user === void 0 ? void 0 : user.createJWT() });
        }),
    },
    Mutation: {
        createUser: (_, { username, password, nickname, phone }) => __awaiter(void 0, void 0, void 0, function* () {
            const existUser = yield User_1.default.findOne({ username });
            if (!username || !password) {
                throw new apollo_server_express_1.UserInputError("One of the fields is empty");
            }
            if (existUser) {
                throw new apollo_server_express_1.UserInputError("User is already exist");
            }
            const user = new User_1.default({
                username,
                nickname,
                phone,
                password,
            });
            const res = yield user.save();
            return Object.assign(Object.assign({}, res._doc), { id: res._id, token: res.createJWT() });
        }),
        contactRequest: (_, { userId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            const user = yield User_1.default.findById(userId);
            const alreadyRequested = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.status === "requested" &&
                contact.userId.toString() === userId.toString());
            if (!user) {
                throw new apollo_server_express_1.UserInputError("No user found");
            }
            if (alreadyRequested !== undefined && alreadyRequested.length > 0) {
                throw new apollo_server_express_1.UserInputError("You already made a friend request with that user");
            }
            userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.push({
                status: "pending",
                userId,
                displayMessage: {
                    lastMessage: "Has sent you a friend request.",
                    sentAt: new Date(),
                },
            });
            user === null || user === void 0 ? void 0 : user.contacts.push({
                status: "requested",
                userId: userAuth === null || userAuth === void 0 ? void 0 : userAuth._id,
                displayMessage: {
                    lastMessage: "A friend request has been sent.",
                    sentAt: new Date(),
                },
            });
            yield user.save();
            yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.save());
            return Object.assign(Object.assign({}, userAuth === null || userAuth === void 0 ? void 0 : userAuth._doc), { id: userAuth === null || userAuth === void 0 ? void 0 : userAuth._id });
        }),
        acceptContactRequest: (_, { userId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            const pendingUser = yield User_1.default.findById(userId);
            const permissionCheck = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.status === "pending" &&
                contact.userId.toString() === userId.toString());
            const alreadyContact = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.status === "contact" &&
                contact.userId.toString() === userId.toString());
            if (!pendingUser) {
                throw new apollo_server_express_1.UserInputError("No user found");
            }
            if (alreadyContact !== undefined && alreadyContact.length > 0) {
                throw new apollo_server_express_1.UserInputError("This user is already in your contacts list");
            }
            if (permissionCheck !== undefined && permissionCheck.length > 0) {
                throw new apollo_server_express_1.UserInputError("Permission denied!");
            }
            if (userAuth) {
                userAuth.contacts = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.userId.toString() !== userId.toString());
                pendingUser.contacts = pendingUser.contacts.filter((contact) => contact.userId.toString() !== (userAuth === null || userAuth === void 0 ? void 0 : userAuth._id.toString()));
            }
            pendingUser.contacts.push({
                status: "contact",
                userId: userAuth === null || userAuth === void 0 ? void 0 : userAuth._id,
                displayMessage: {
                    lastMessage: "New contact! Say Hello!",
                    sentAt: new Date(),
                },
            });
            userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.push({
                status: "contact",
                userId,
                displayMessage: {
                    lastMessage: "New contact! Say Hello!",
                    sentAt: new Date(),
                },
            });
            yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.save());
            yield pendingUser.save();
            return Object.assign(Object.assign({}, userAuth === null || userAuth === void 0 ? void 0 : userAuth._doc), { id: userAuth === null || userAuth === void 0 ? void 0 : userAuth.id });
        }),
        updateUser: (_, { imageUrl, nickname, phone, aboutInfo, backgroundImage }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            if (userAuth) {
                userAuth.profileImage = imageUrl || userAuth.profileImage;
                userAuth.nickname = nickname || userAuth.nickname;
                userAuth.phone = phone || userAuth.phone;
                userAuth.aboutInfo = aboutInfo || userAuth.aboutInfo;
                userAuth.backgroundImage = backgroundImage || userAuth.backgroundImage;
            }
            yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.save());
            return Object.assign(Object.assign({}, userAuth === null || userAuth === void 0 ? void 0 : userAuth._doc), { id: userAuth === null || userAuth === void 0 ? void 0 : userAuth._id, token: userAuth === null || userAuth === void 0 ? void 0 : userAuth.createJWT() });
        }),
        removeContact: (_, { userId }, context) => __awaiter(void 0, void 0, void 0, function* () {
            const userAuth = yield (0, jwt_auth_1.auth)(context);
            const user = yield User_1.default.findById(userId);
            if (!user) {
                throw new apollo_server_express_1.UserInputError("No user found");
            }
            if (userAuth) {
                userAuth.contacts = userAuth === null || userAuth === void 0 ? void 0 : userAuth.contacts.filter((contact) => contact.userId.toString() !== userId.toString());
                user.contacts = user === null || user === void 0 ? void 0 : user.contacts.filter((contact) => contact.userId.toString() !== (userAuth === null || userAuth === void 0 ? void 0 : userAuth._id.toString()));
            }
            yield user.save();
            yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.save());
            return `You have removed successfuly ${user === null || user === void 0 ? void 0 : user.nickname} from your contact list`;
        }),
    },
};
