import { Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user!.userId).select("-password");
  res.status(200).json(user);
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const { name, addresses } = req.body as { name?: string; addresses?: string[] };

  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    { ...(name && { name }), ...(addresses && { addresses }) },
    { new: true }
  ).select("-password");

  res.status(200).json(user);
}

/**
 * Admin-only: create a new staff/admin account directly from the dashboard.
 * This means only the FIRST admin ever needs to be created via the seed
 * script — every admin after that can be onboarded by an existing admin,
 * no terminal access required.
 */
export async function createStaff(req: AuthRequest, res: Response): Promise<void> {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: "A user with this email already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const staff = await User.create({ name, email, password: hashedPassword, role: "admin" });

  res.status(201).json({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  });
}

export async function listStaff(_req: AuthRequest, res: Response): Promise<void> {
  const staff = await User.find({ role: "admin" }).select("-password").sort({ createdAt: -1 });
  res.status(200).json(staff);
}

export async function removeStaff(req: AuthRequest, res: Response): Promise<void> {
  const requesterId = req.user!.userId;
  if (req.params.id === requesterId) {
    res.status(400).json({ message: "You cannot remove your own admin account" });
    return;
  }
  await User.findOneAndUpdate({ _id: req.params.id, role: "admin" }, { role: "customer" });
  res.status(200).json({ message: "Staff access revoked" });
}
