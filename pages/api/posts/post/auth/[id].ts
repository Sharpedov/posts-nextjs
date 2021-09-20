import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import PostMessage from "mongodb/models/PostMessage";

export default authMiddleware(async function handler(req, res) {
	const {
		query: { id },
		method,
		body: { post },
	} = req;

	await dbConnect();

	switch (method) {
		case "DELETE":
			{
				try {
					const deletedPost = await PostMessage.findByIdAndRemove(id);

					if (!deletedPost) {
						return res.status(404).send("There is no post with that id");
					}

					res.status(200).json(id);
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
		case "PATCH":
			{
				try {
					const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
						new: true,
					});
					if (!updatedPost)
						return res.status(404).send("There is no post with that id");

					res.status(200).json(updatedPost);
				} catch (error) {
					res.status(400).json(error);
					res.status(409).json(error);
				}
			}
			break;
		default:
			res.status(400).send("Semthing went wrong");
			break;
	}
});
