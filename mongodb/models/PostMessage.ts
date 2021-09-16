import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: [true, "Please provide a message."],
			maxlength: [255, "Title cannot be more than 255 characters"],
		},
		creator: { type: String, required: true },
		creatorImage: { type: String },
		image: { type: String, required: true },
		tags: { type: [String], required: true },
		likes: { type: [String], default: [] },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.PostMessage ||
	mongoose.model("PostMessage", PostSchema);
