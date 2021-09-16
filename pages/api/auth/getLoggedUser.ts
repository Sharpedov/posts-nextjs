import cookie from "cookie";
import jwt_decode from "jwt-decode";

export default async function handler(req, res) {
	const cookies = cookie.parse(req.headers.cookie || "");

	if (!cookies.auth) {
		res.setHeader(
			"Set-Cookie",
			cookie.serialize("auth", "", {
				httpOnly: true,
				secure: process.env.NODE_ENV !== "development",
				expires: new Date(0),
				sameSite: "strict",
				path: "/",
			})
		);

		return res.json({ success: false });
	}

	let decoded = jwt_decode(cookies.auth);

	res.json({ success: true, data: decoded });
}
