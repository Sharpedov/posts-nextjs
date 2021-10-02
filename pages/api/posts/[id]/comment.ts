import dbConnect from "mongodb/dbConnect";
import { authMiddleware } from "mongodb/middlewares/authMiddleware";
import PostComment from "mongodb/models/PostComment";
import User from "mongodb/models/User";

export default authMiddleware(async function handler(req, res) {
	const {
		query: { id },
		body,
		method,
	} = req;
	await dbConnect();

	switch (method) {
		case "GET":
			{
				try {
					const page = parseInt(req.query.page as string);
					const limit = parseInt(req.query.limit as string);

					const startIndex = (Number(page) - 1) * Number(limit);

					const postComments = await PostComment.find({ postId: id })
						.sort("-createdAt")
						.limit(limit)
						.skip(startIndex);

					if (!postComments)
						return res.status(400).json({ message: "No comments" });

					const response = await Promise.all(
						postComments.map(async (post) => {
							const user = await User.findById(post.userId).select(
								"username avatar"
							);

							return {
								...post._doc,
								user,
							};
						})
					);

					res.status(200).json(response);
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
		case "POST":
			{
				try {
					const { userId, message } = body;

					const createdComment = await PostComment.create({
						postId: id,
						userId,
						message,
					});

					if (!createdComment)
						return res.status(400).json({ message: "Post was not created" });

					// await PostComment.findOneAndUpdate(
					// 	{ postId: id },
					// 	{
					// 		$push: {
					// 			comments: {
					// 				userId,
					// 				message,
					// 				createdAt: moment().format(),
					// 			},
					// 		},
					// 	},
					// 	{
					// 		new: true,
					// 	}
					// );

					res.status(200).json(createdComment);
				} catch (error) {
					res.status(400).json(error);
				}
			}
			break;
		default:
			res.status(400).send("Semthing went wrong");
			break;
	}
});
