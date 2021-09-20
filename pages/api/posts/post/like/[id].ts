import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import PostMessage from "mongodb/models/PostMessage";

export default authMiddleware(async function handler(req, res) {
	const {
		method,
		query: { id },
		body,
	} = req;
	await dbConnect();

	switch (method) {
		case "PATCH":
			{
				try {
					const { userId } = body;
					const post = await PostMessage.findByIdAndUpdate(
						id,
						{
							$push: {
								likes: userId,
							},
							shoppingCart: [],
						},
						{
							new: true,
						}
					);

					if (!post) return res.status(404).send("Post does not exist");

					res.status(200).json({ success: true });
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
		default:
			res.status(400).send("Something went wrong");
			break;
	}
});
