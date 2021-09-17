import User from "mongodb/models/User";

export default async function handler(req, res) {
	const {
		method,
		query: { username },
	} = req;

	switch (method) {
		case "GET":
			{
				try {
					const user = await User.findOne({
						username: new RegExp("^" + username + "$", "i"),
					}).select("username avatar banner description");

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
}
