import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import { compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import PostMessage from "mongodb/models/PostMessage";
import { authenticated } from "../authenticated";

export default authenticated(async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "PATCH": {
			try {
				const { username, email, newEmail, password, newPassword } = body;
				const existingUser = await User.findOne({ email }).select("+password");
				const existingUsername = await User.findOne({ username }).select(
					"username"
				);
				const existingEmail = await User.findOne({ email: newEmail }).select(
					"username"
				);

				const updatePosts = async () => {
					await PostMessage.updateMany(
						{ creator: existingUser.username },
						{ creator: username }
					);
				};

				if (!existingUser)
					return res.status(401).json({
						message: "User does not exist",
					});

				if (existingUsername)
					return res.status(401).json({
						message: "Username already exists",
					});
				if (existingEmail)
					return res.status(401).json({
						message: "Cannot change email",
					});

				const isMatch = await compare(password, existingUser.password);

				if (!isMatch)
					return res.status(401).json({
						message: "Invalid password",
					});

				if (newPassword) {
					await User.findOneAndUpdate(
						{ email },
						{
							username,
							email: newEmail,
							password: await bcrypt.hashSync(newPassword, 12),
						},
						{ new: true }
					);

					updatePosts();

					return res
						.status(200)
						.json({ message: "User data has been successfully changed" });
				}

				await User.findOneAndUpdate(
					{ email },
					{
						username,
						email: newEmail,
					},
					{ new: true }
				);
				updatePosts();

				res
					.status(200)
					.json({ message: "User data has been successfully changed" });
			} catch (error) {
				res.status(400).json({ success: false, message: error });
			}
			break;
		}
		default:
			res.status(500).json({ success: false });
			break;
	}
});
