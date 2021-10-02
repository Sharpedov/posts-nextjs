import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema(
	{
		postId: { type: String, required: true },
		userId: { type: String, required: true },
		message: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.PostComment ||
	mongoose.model("PostComment", PostCommentSchema);
