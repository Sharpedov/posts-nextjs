import dbConnect from "mongodb/dbConnect";
import PostMessage from "mongodb/models/PostMessage";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "1mb",
		},
	},
};

export default async function handler(req, res) {
	const {
		method,
		query: { sort },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const page = parseInt(req.query.page as string);
					const limit = parseInt(req.query.limit as string);

					const startIndex = (Number(page) - 1) * Number(limit);

					const postMessages = await PostMessage.find()
						.sort(sort)
						.limit(limit)
						.skip(startIndex);

					res.status(200).json(postMessages);
				} catch (err) {
					res.status(400).json(err);
				}
			}
			break;
		default:
			res.status(400).send("Semthing went wrong");
			break;
	}
}
