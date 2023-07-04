import mongoose, { Document } from 'mongoose';

interface IMessageDocument extends Document {
  sentBy: mongoose.Schema.Types.ObjectId;
  sentAt: Date;
  messageContent: string;
  chatId: mongoose.Schema.Types.ObjectId;
  messageType: 'text' | 'image/png' | 'image/jpeg' | null;
  sentTo: mongoose.Schema.Types.ObjectId;
}

const messageSchema = new mongoose.Schema<IMessageDocument>({
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users',
  },
  sentTo: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
    default: 'text',
  },
});

export default mongoose.model<IMessageDocument>('Message', messageSchema);
