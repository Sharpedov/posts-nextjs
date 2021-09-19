import { compare } from "bcryptjs";
import dbConnect from "mongodb/dbConnect";
import User from "mongodb/models/User";
import { buildAuthTokens, setAuthTokens } from "mongodb/utils/authTokenUtils";

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

				const { accessToken, refreshToken } = buildAuthTokens(user);
				setAuthTokens(res, accessToken, refreshToken);

				res.status(200).json({ success: true });
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
