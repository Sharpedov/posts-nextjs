import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const { username, email, password } = body;
					const existingUser = await User.findOne({ email }).select("email");
					const existingUsername = await User.findOne({ username }).select(
						"username"
					);

					if (existingUser)
						return res
							.status(404)
							.json({ message: "We cannot create account. Try again." });

					if (existingUsername)
						return res.status(404).json({ message: "Username already exists" });

					await User.create({
						username,
						email,
						password: await bcrypt.hashSync(password, 12),
					});

					res.status(201).json({ success: true });
				} catch (error) {
					res.status(400).json({ success: false, message: error });
				}
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
}
