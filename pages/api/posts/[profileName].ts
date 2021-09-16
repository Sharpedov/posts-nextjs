import dbConnect from "mongodb/dbConnect";
import PostMessage from "mongodb/models/PostMessage";

export default async function handler(req, res) {
	const {
		method,
		query: { profileName },
	} = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const page = parseInt(req.query.page as string);
					const limit = parseInt(req.query.limit as string);

					const startIndex = (Number(page) - 1) * Number(limit);

					const posts = await PostMessage.find({ creator: profileName })
						.sort({
							createdAt: -1,
						})
						.limit(limit)
						.skip(startIndex);

					if (!posts)
						return res.status(400).json({
							message: "User has no posts",
						});

					res.status(200).json(posts);
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
