import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComplaintMessage {
  sender: "customer" | "admin";
  senderName: string;
  text: string;
  createdAt: Date;
}

export interface IComplaint extends Document {
  user: Types.ObjectId;
  userName: string;
  subject: string;
  status: "open" | "resolved";
  messages: IComplaintMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IComplaintMessage>(
  {
    sender: { type: String, enum: ["customer", "admin"], required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new Schema<IComplaint>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model<IComplaint>("Complaint", complaintSchema);
