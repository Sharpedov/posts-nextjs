import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		query: { username },
		body,
	} = req;

	switch (method) {
		case "PATCH":
			{
				const { userId } = body;
				const followingUser = await User.findOneAndUpdate(
					{
						username: new RegExp("^" + username + "$", "i"),
					},
					{
						$pull: {
							followers: userId,
						},
					},
					{
						new: true,
					}
				);

				if (!followingUser) return res.status(404).send("User not exists");

				const user = await User.findByIdAndUpdate(
					userId,
					{
						$pull: {
							following: followingUser._id,
						},
					},
					{
						new: true,
					}
				);
				if (!user) return res.status(404).send("User not exists");

				res.status(200).json({ success: true });
			}
			break;
		default:
			res.status(400).json({ success: false });
			break;
	}
});
