import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import { authenticated } from "pages/api/authenticated";

export default authenticated(async function handler(req, res) {
	const {
		method,
		query: { id },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const user = await User.findById(id).select(
						"username email avatar banner description location updatedAt"
					);
					if (!user) return res.status(404).send("User not exists");

					res.status(200).json({ user });
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
