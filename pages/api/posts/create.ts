import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import PostMessage from "mongodb/models/PostMessage";

export default authMiddleware(async function handler(req, res) {
	const { method } = req;
	await dbConnect();

	switch (method) {
		case "POST":
			{
				try {
					const post = await PostMessage.create(req.body);

					res.status(201).json(post);
				} catch (err) {
					res.status(409).json(err);
				}
			}
			break;
		default:
			res.status(400).send("Semthing went wrong");
			break;
	}
});
