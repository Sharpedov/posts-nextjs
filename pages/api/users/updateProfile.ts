import dbConnect from "mongodb/dbConnect";
import PostMessage from "mongodb/models/PostMessage";
import User from "mongodb/models/User";
import { authenticated } from "../authenticated";

export default authenticated(async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "PATCH":
			{
				try {
					const { email, avatar, banner, description } = body;
					const user = await User.findOneAndUpdate(
						{ email },
						{ avatar, banner, description }
					).select("username");

					if (!user) return res.status(404).send("User not exists");

					await PostMessage.updateMany(
						{ creator: user.username },
						{ creatorImage: avatar }
					);

					res.status(200).json({ message: "Successfully updated" });
				} catch (error) {
					res.status(400).json({ success: false, message: error });
				}
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
});
