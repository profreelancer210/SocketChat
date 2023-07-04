import mongoose from 'mongoose';

export interface IChat {
  users?: [mongoose.Schema.Types.ObjectId];
  chatId: mongoose.Schema.Types.ObjectId;
  usersId?: Array<mongoose.Schema.Types.ObjectId>;
}

export interface IMessage {
  chatId: [mongoose.Schema.Types.ObjectId];
  content: string;
}
