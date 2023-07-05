"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sentBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    sentTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'users',
    },
    sentAt: {
        type: Date,
        required: true,
    },
    messageContent: {
        type: String,
        required: true,
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    messageType: {
        type: String,
        required: true,
        default: 'text',
    },
});
exports.default = mongoose_1.default.model('Message', messageSchema);
