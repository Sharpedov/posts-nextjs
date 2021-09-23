import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		query: { following },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					if (following.length === 0) return res.json([]);
					const followingUser = await User.find({
						_id: {
							$in: following.split(","),
						},
					}).select("avatar username email");

					res.status(200).json(followingUser);
				} catch (err) {
					res.status(400).json(err);
				}
			}
			break;
		default:
			res.status(400).send("Something went wrong");
			break;
	}
});
