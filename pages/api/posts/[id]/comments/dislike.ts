import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import PostComment from "mongodb/models/PostComment";

export default authMiddleware(async function handler(req, res) {
	const { method, body } = req;
	await dbConnect();

	switch (method) {
		case "PATCH":
			{
				try {
					const { userId, commentId } = body;
					const comment = await PostComment.findByIdAndUpdate(
						commentId,
						{
							$pull: {
								likes: userId,
							},
						},
						{
							new: true,
						}
					);

					if (!comment) return res.status(404).send("Comment does not exist");

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
