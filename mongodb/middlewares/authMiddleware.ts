import jwt from "jsonwebtoken";

export const authMiddleware = (handler) => async (req, res) => {
	const decoded = jwt.verify(
		req.cookies.auth_access!,
		process.env.AUTH_ACCESS_TOKEN_SECRET,
		async function (err, decoded) {
			if (!err && decoded) {
				req.token = decoded;
				return handler(req, res);
			}

			res
				.status(401)
				.json({ success: false, message: "Sorry you are not authenticated" });
		}
	);
};
