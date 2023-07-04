import mongoose, { Document } from 'mongoose';

interface IChatSchema extends Document {
  _doc: any;
  chatId: mongoose.Schema.Types.ObjectId;
  users: Array<mongoose.Schema.Types.ObjectId>;
  _id: mongoose.Schema.Types.ObjectId;
  messages: [
    {
      sentBy: mongoose.Schema.Types.ObjectId;
      messageContent: string;
      sentAt: Date;
      messageType: 'text' | 'image/jpeg' | 'image/png' | null;
    }
  ];
}

const chatSchema = new mongoose.Schema<IChatSchema>({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    required: true,
  },

  messages: [
    {
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('Chat', chatSchema);
