import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true, trim: true },
		email: { type: String, required: true, unique: true, trim: true },
		password: { type: String, require: true, minLength: 4, select: false },
		avatar: { type: String },
		banner: { type: String },
		description: { type: String },
		location: { type: String },
		followers: { type: [String], default: [] },
		following: { type: [String], default: [] },
		tokenVersion: { type: Number, default: 0 },
	},
	{
		timestamps: true,
	}
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
