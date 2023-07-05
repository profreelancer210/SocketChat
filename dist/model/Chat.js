"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    users: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'users',
        required: true,
    },
    messages: [
        {
            sentBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'users',
                required: true,
            },
            messageContent: {
                type: String,
                required: true,
            },
            sentAt: {
                type: Date,
                required: true,
            },
            messageType: {
                type: String,
                required: true,
                default: 'text',
            },
        },
    ],
});
exports.default = mongoose_1.default.model('Chat', chatSchema);
//# sourceMappingURL=Chat.js.map