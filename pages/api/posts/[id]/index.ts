import dbConnect from "mongodb/dbConnect";
import PostComment from "mongodb/models/PostComment";
import PostMessage from "mongodb/models/PostMessage";

export default async function handler(req, res) {
	const {
		query: { id },
		method,
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const data = await PostMessage.findById(id);

					if (!data) return res.status(400).json({ success: false });

					const commentsCount = await PostComment.find({
						postId: id,
					}).countDocuments();

					res.status(200).json({ ...data._doc, commentsCount });
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
		default:
			res.status(400).send("Semthing went wrong");
			break;
	}
}
