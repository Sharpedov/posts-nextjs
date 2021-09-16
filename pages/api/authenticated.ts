import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const authenticated =
	(fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
		const decoded = jwt.verify(
			req.cookies.auth!,
			process.env.LOGIN_SECRET,
			async function (err, decoded) {
				if (!err && decoded) {
					return await fn(req, res);
				}

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

				res
					.status(401)
					.json({ success: false, message: "Sorry you are not authenticated" });
			}
		);
	};
