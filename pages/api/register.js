import { mongooseConnect } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { name, email, password } = req.body;

  const { db } = await mongooseConnect();

  const user = await db.collection("users").findOne({ email });

  if (user) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created" });
}