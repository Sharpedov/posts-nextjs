import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		query: { followers },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					if (followers.length === 0) return res.json([]);
					const followersUser = await User.find({
						_id: {
							$in: followers.split(","),
						},
					}).select("avatar username email");

					res.status(200).json(followersUser);
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
