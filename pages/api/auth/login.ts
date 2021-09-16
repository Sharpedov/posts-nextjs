import { compare } from "bcryptjs";
import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

export default async function handler(req, res) {
	const { method, body } = req;

	await dbConnect();

	switch (method) {
		case "POST": {
			try {
				const { email, password } = body;
				const user = await User.findOne({ email }).select("+password");

				if (!user)
					return res.status(401).json({
						message: "Invalid email or password",
					});

				const isMatch = await compare(password, user.password);

				if (!isMatch)
					return res.status(401).json({
						message: "Invalid email or password",
					});

				const claims = {
					_id: user._id,
				};

				const jwt = sign(claims, process.env.LOGIN_SECRET, {
					expiresIn: "30d",
				});

				res.setHeader(
					"Set-Cookie",
					cookie.serialize("auth", jwt, {
						httpOnly: true,
						secure: process.env.NODE_ENV !== "development",
						sameSite: "strict",
						maxAge: 3600 * 24 * 30,
						path: "/",
					})
				);

				res.status(201).json({ success: true });
			} catch (error) {
				res.status(400).json({ success: false, message: error });
			}
			break;
		}
		default:
			res.status(400).json({ success: false });
			break;
	}
}
