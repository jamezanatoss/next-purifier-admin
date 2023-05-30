// import {mongooseConnect} from "@/lib/mongoose";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export default async function handler(req, res) {
//     const { email, password } = req.body;

//     const { db } = await mongooseConnect();

//     const user = await db.collection("users").findOne({ email });

//     if (!user) {
//         res.status(401).json({ message: "Invalid credentials" });
//         return;
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//         res.status(401).json({ message: "Invalid credentials" });
//         return;
//     }

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);

//     res.status(200).json({ token });
// }