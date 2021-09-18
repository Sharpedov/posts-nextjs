import dbConnect from "mongodb/dbConnect";
import PostMessage from "mongodb/models/PostMessage";
import { authenticated } from "../../authenticated";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "1mb",
		},
	},
};

export default async function handler(req, res) {
	const {
		query: { id },
		method,
		body: { post },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const data = await PostMessage.findById(id);

					if (!data) return res.status(400).json({ success: false });

					res.status(200).json(data);
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
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
}
