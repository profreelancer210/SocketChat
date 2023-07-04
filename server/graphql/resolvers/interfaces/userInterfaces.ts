import mongoose from "mongoose";

export interface IUserInfo {
  username: string;
  nickname: string;
  phone: string;
  password: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface IFilter {
  all: string;
  contacts: "contacts" | null;
  requested: "requested" | null;
  _id?: Array<mongoose.Schema.Types.ObjectId>;
  nickname: string | null;
  searchQuery?: string;
}

export interface IUpdateUser {
  nickname?: string;
  phone?: string;
  aboutInfo?: string;
  imageUrl?: string;
  backgroundImage?: string;
}
