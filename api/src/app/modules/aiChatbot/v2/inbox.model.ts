import mongoose, { Model, Schema } from "mongoose";
import { IInbox, IMessage } from "./inbox.interface";

const MessageSchema : Schema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ["system", "user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const InboxSchema : Schema = new Schema<IInbox>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

const Inbox: Model<IInbox> = mongoose.model<IInbox>(
  'inbox',
  InboxSchema,
);

export default Inbox;