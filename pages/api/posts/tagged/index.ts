import dbConnect from "mongodb/dbConnect";
import PostMessage from "mongodb/models/PostMessage";

export default async function handler(req, res) {
	const {
		method,
		query: { sort, tags },
	} = req;

	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					var tagsRegexp = tags
						.split(",")
						.map((tag) => new RegExp("^" + tag + "$", "i"));

					const page = parseInt(req.query.page as string);
					const limit = parseInt(req.query.limit as string);

					const startIndex = (Number(page) - 1) * Number(limit);

					const postMessages = await PostMessage.find({
						tags: {
							$in: tagsRegexp,
						},
					})
						.sort(sort ?? "-createdAt")
						.limit(limit)
						.skip(page ? startIndex : 0);

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
