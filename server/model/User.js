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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const contactsSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
    },
    displayMessage: {
        lastMessage: { type: String },
        sentAt: { type: Date },
    },
});
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        minLength: 6,
        maxLength: 14,
        required: [true, "Please provide username"],
    },
    phone: {
        type: String,
        minLength: 10,
        maxLength: 22,
        required: [true, "Please provide a phone number"],
    },
    nickname: {
        type: String,
        minLength: 6,
        maxLength: 22,
        required: [true, "Please provide a nickname"],
    },
    password: {
        type: String,
        minLength: 6,
        required: [true, "Please provide password"],
    },
    profileImage: {
        type: String,
        default: "https://i.ibb.co/xY0WT5N/avatardefault-92824.png",
    },
    backgroundImage: {
        type: String,
        default: "https://i.ibb.co/GPc1cHB/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
    },
    aboutInfo: {
        type: String,
        required: true,
        default: "Hi! I am using messenger app",
    },
    contacts: {
        type: [contactsSchema],
        default: [],
    },
});
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return;
        const salt = yield bcryptjs_1.default.genSalt(12);
        this.password = bcryptjs_1.default.hashSync(this.password, salt);
    });
});
userSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.default = mongoose_1.default.model("User", userSchema);
