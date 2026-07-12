import { Response } from "express";
import { Complaint } from "../models/Complaint";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { emitNewComplaint, emitComplaintReply } from "../services/socketService";

export async function createComplaint(req: AuthRequest, res: Response): Promise<void> {
  const { subject, message } = req.body as { subject: string; message: string };
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const complaint = await Complaint.create({
    user: userId,
    userName: user.name,
    subject,
    status: "open",
    messages: [{ sender: "customer", senderName: user.name, text: message }],
  });

  emitNewComplaint(complaint);
  res.status(201).json(complaint);
}

export async function getMyComplaints(req: AuthRequest, res: Response): Promise<void> {
  const complaints = await Complaint.find({ user: req.user!.userId }).sort({ updatedAt: -1 });
  res.status(200).json(complaints);
}

export async function getAllComplaints(_req: AuthRequest, res: Response): Promise<void> {
  const complaints = await Complaint.find().sort({ updatedAt: -1 });
  res.status(200).json(complaints);
}

export async function replyToComplaint(req: AuthRequest, res: Response): Promise<void> {
  const { text } = req.body as { text: string };
  const { id } = req.params;
  const isAdmin = req.user!.role === "admin";

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    res.status(404).json({ message: "Complaint not found" });
    return;
  }

  // Customers can only reply to their own complaint thread.
  if (!isAdmin && complaint.user.toString() !== req.user!.userId) {
    res.status(403).json({ message: "Not authorized to reply to this complaint" });
    return;
  }

  const user = await User.findById(req.user!.userId);
  const senderName = isAdmin ? `${user?.name || "Support"} (Support)` : user?.name || "Customer";

  const newMessage = {
    sender: (isAdmin ? "admin" : "customer") as "admin" | "customer",
    senderName,
    text,
    createdAt: new Date(),
  };

  complaint.messages.push(newMessage);
  if (isAdmin) complaint.status = "open";
  await complaint.save();

  emitComplaintReply(complaint.id, newMessage, complaint.user.toString());
  res.status(200).json(complaint);
}

export async function resolveComplaint(req: AuthRequest, res: Response): Promise<void> {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status: "resolved" },
    { new: true }
  );
  if (!complaint) {
    res.status(404).json({ message: "Complaint not found" });
    return;
  }
  res.status(200).json(complaint);
}
