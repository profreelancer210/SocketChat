import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

interface IUser extends Document {
  username: string;
  nickname: string;
  phone: string;
  password: string;
  profileImage?: string;
  backgroundImage: string;
  aboutInfo?: string;
  contacts: Array<IContact>;
  _id: mongoose.Schema.Types.ObjectId | any;
  _doc: any;
  createJWT: () => {};
}

interface IContact {
  status: "pending" | "requested" | "contact";
  userId: mongoose.Schema.Types.ObjectId;
  displayMessage: {
    lastMessage: string | null;
    sentAt?: Date | null;
  };
}

const contactsSchema = new mongoose.Schema<IContact>({
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  displayMessage: {
    lastMessage: { type: String },
    sentAt: { type: Date },
  },
});

const userSchema = new mongoose.Schema<IUser>({
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
    default:
      "https://i.ibb.co/GPc1cHB/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png",
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);
