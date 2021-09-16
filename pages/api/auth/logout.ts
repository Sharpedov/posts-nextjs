import cookie from "cookie";

export default async function handler(req, res) {
	res.setHeader(
		"Set-Cookie",
		cookie.serialize("auth", "", {
			httyOnly: true,
			secure: process.env.NODE_ENV !== "development",
			expires: new Date(0),
			sameSite: "strict",
			path: "/",
		})
	);

	res.status(200).json({ success: true });
}
