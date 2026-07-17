import { Types } from "mongoose";

export type IMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type IInbox = {
  owner: Types.ObjectId;
  messages: IMessage[];
};