import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
	authDeleter,
	authPatcher,
	authPoster,
} from "src/utils/authAxiosMethods";
import { mutate } from "swr";
import { addNotification } from "./notificationsSlice";

interface ICreatePost {
	postData;
	onComplete?: () => void;
}
interface IEditPost {
	id;
	postData;
	onComplete?: () => void;
}
interface ILikePost {
	id;
	onComplete?: () => void;
}
interface IDislikePost {
	id;
	onComplete?: () => void;
}
interface IDeletePost {
	id;
	onComplete?: () => void;
}
interface IGetPost {
	id;
	onComplete?: () => void;
}
interface IAddCommentPost {
	id;
	message: string;
	onComplete?: () => void;
}
interface ILikeCommentPost {
	postId: string;
	commentId: string;
	onComplete?: () => void;
}

export const createPost = createAsyncThunk(
	"posts/createPost",
	async ({ postData, onComplete }: ICreatePost, { getState, dispatch }) => {
		try {
			const {
				posts: { mutatePosts },
			} = getState() as any;
			const data = await authPoster("/api/posts/create", postData);

			mutatePosts && (await mutatePosts());
			onComplete && onComplete();

			return { data };
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const editPost = createAsyncThunk(
	"posts/editPost",
	async ({ id, postData, onComplete }: IEditPost, { getState, dispatch }) => {
		try {
			const {
				posts: { mutatePosts },
			} = getState() as any;

			const data = await authPatcher(`/api/posts/${id}/manage`, {
				post: postData,
			});

			mutatePosts && (await mutatePosts());
			await mutate(`/api/posts/${id}`);
			onComplete && onComplete();

			dispatch(addNotification({ message: "Post has been edited" }));

			return { data };
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const likePost = createAsyncThunk(
	"posts/likePost",
	async ({ id, onComplete }: ILikePost, { getState, dispatch }) => {
		try {
			const {
				posts: { mutatePosts },
			} = getState() as any;
			const {
				auth: { user },
			} = getState() as any;

			if (!user) throw "User are not logged in";

			const data = await authPatcher(`/api/posts/${id}/like`, {
				userId: user._id,
			});

			mutatePosts && (await mutatePosts());
			await mutate(`/api/posts/${id}`);
			onComplete && onComplete();
			dispatch(addNotification({ message: "Liked" }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);
export const dislikePost = createAsyncThunk(
	"posts/dislikePost",
	async ({ id, onComplete }: IDislikePost, { getState, dispatch }) => {
		try {
			const {
				posts: { mutatePosts },
			} = getState() as any;
			const {
				auth: { user },
			} = getState() as any;

			if (!user) throw "User are not logged in";

			await authPatcher(`/api/posts/${id}/dislike`, {
				userId: user._id,
			});

			mutatePosts && (await mutatePosts());
			await mutate(`/api/posts/${id}`);
			onComplete && onComplete();

			dispatch(addNotification({ message: "Disliked" }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const deletePost = createAsyncThunk(
	"posts/deletePost",
	async ({ id, onComplete }: IDeletePost, { getState, dispatch }) => {
		try {
			const {
				posts: { mutatePosts },
			} = getState() as any;

			const data = await authDeleter(`/api/posts/${id}/manage`);

			mutatePosts && (await mutatePosts());
			await mutate(`/api/posts/${id}`);
			onComplete && onComplete();

			dispatch(addNotification({ message: "Post has been deleted" }));

			return { data };
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const addCommentPost = createAsyncThunk(
	"posts/addCommentPost",
	async (
		{ id, message, onComplete }: IAddCommentPost,
		{ getState, dispatch }
	) => {
		try {
			const {
				auth: { user },
			} = getState() as any;

			if (!user) throw "User are not logged in";

			await authPoster(`/api/posts/${id}/comments`, {
				message,
				userId: user._id,
			});

			await mutate(`/api/posts/${id}`);
			onComplete && onComplete();

			dispatch(addNotification({ message: "Comment added" }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const likeCommentPost = createAsyncThunk(
	"posts/likeCommentPost",
	async (
		{ postId, commentId, onComplete }: ILikeCommentPost,
		{ dispatch, getState }
	) => {
		try {
			const {
				auth: { user },
			} = getState() as any;
			if (!user) throw "User are not logged in";

			await authPatcher(`/api/posts/${postId}/comments/like`, {
				userId: user._id,
				commentId,
			});
			onComplete && onComplete();

			dispatch(addNotification({ message: "Liked comment" }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);
export const dislikeCommentPost = createAsyncThunk(
	"posts/dislikeCommentPost",
	async (
		{ postId, commentId, onComplete }: ILikeCommentPost,
		{ dispatch, getState }
	) => {
		try {
			const {
				auth: { user },
			} = getState() as any;
			if (!user) throw "User are not logged in";

			await authPatcher(`/api/posts/${postId}/comments/dislike`, {
				userId: user._id,
				commentId,
			});
			onComplete && onComplete();

			dispatch(addNotification({ message: "Disliked" }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const getPost = createAsyncThunk(
	"posts/getPost",
	async ({ id }: IGetPost, { dispatch }) => {
		try {
			const data = await axios.get(`/api/posts/${id}`).then((res) => res.data);

			return { data };
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

const initialState = {
	mutatePosts: null,
	post: {
		post: null,
		loading: false,
		error: null,
	},
	create: {
		post: {},
		loading: false,
		error: null,
	},
	delete: {
		loading: false,
		error: null,
	},
	edit: {
		loading: false,
		error: null,
	},
	like: {
		loading: false,
		error: null,
	},
	dislike: {
		loading: false,
		error: null,
	},
	addComment: {
		loading: false,
		error: null,
	},
	likeComment: {
		loading: false,
		error: null,
	},
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		addMutatePosts: (state, action) => {
			state.mutatePosts = action.payload;
		},
		clearPostState: (state) => {
			state.post = { post: {}, loading: false, error: null };
		},
	},
	extraReducers: (builder) => {
		//// create post ////
		builder.addCase(createPost.pending, (state) => {
			state.create.loading = true;
			state.create.error = null;
		});
		builder.addCase(createPost.fulfilled, (state, action) => {
			state.create.loading = false;
		});
		builder.addCase(createPost.rejected, (state, action) => {
			state.create.loading = false;
			state.create.error = action.error.message;
		});

		//// delete post ////
		builder.addCase(deletePost.pending, (state) => {
			state.delete.loading = true;
			state.delete.error = null;
		});
		builder.addCase(deletePost.fulfilled, (state, action) => {
			state.delete.loading = false;
		});
		builder.addCase(deletePost.rejected, (state, action) => {
			state.delete.loading = false;
			state.delete.error = action.error.message;
		});

		//// get post ////
		builder.addCase(getPost.pending, (state) => {
			state.post.loading = true;
			state.post.error = null;
		});
		builder.addCase(getPost.fulfilled, (state, action) => {
			state.post.loading = false;
			state.post.post = action.payload.data;
		});
		builder.addCase(getPost.rejected, (state, action) => {
			state.post.loading = false;
			state.post.error = action.error.message;
		});

		//// update post ////
		builder.addCase(editPost.pending, (state) => {
			state.edit.loading = true;
			state.edit.error = null;
		});
		builder.addCase(editPost.fulfilled, (state, action) => {
			state.edit.loading = false;
		});
		builder.addCase(editPost.rejected, (state, action) => {
			state.edit.loading = false;
			state.edit.error = action.error.message;
		});

		//// like post ////
		builder.addCase(likePost.pending, (state) => {
			state.like.loading = true;
			state.like.error = null;
		});
		builder.addCase(likePost.fulfilled, (state) => {
			state.like.loading = false;
		});
		builder.addCase(likePost.rejected, (state, action) => {
			state.like.loading = false;
			state.like.error = action.error.message;
		});

		//// dislike post ////
		builder.addCase(dislikePost.pending, (state) => {
			state.dislike.loading = true;
			state.dislike.error = null;
		});
		builder.addCase(dislikePost.fulfilled, (state) => {
			state.dislike.loading = false;
		});
		builder.addCase(dislikePost.rejected, (state, action) => {
			state.dislike.loading = false;
			state.dislike.error = action.error.message;
		});

		//// add comment to post ////
		builder.addCase(addCommentPost.pending, (state) => {
			state.addComment.loading = true;
			state.addComment.error = null;
		});
		builder.addCase(addCommentPost.fulfilled, (state) => {
			state.addComment.loading = false;
		});
		builder.addCase(addCommentPost.rejected, (state, action) => {
			state.addComment.loading = false;
			state.addComment.error = action.error.message;
		});

		//// like and dislike post comment ////
		builder.addCase(likeCommentPost.pending, (state) => {
			state.likeComment.loading = true;
			state.likeComment.error = null;
		});
		builder.addCase(likeCommentPost.fulfilled, (state) => {
			state.likeComment.loading = false;
		});
		builder.addCase(likeCommentPost.rejected, (state, action) => {
			state.likeComment.loading = false;
			state.likeComment.error = action.error.message;
		});

		builder.addCase(dislikeCommentPost.pending, (state) => {
			state.likeComment.loading = true;
			state.likeComment.error = null;
		});
		builder.addCase(dislikeCommentPost.fulfilled, (state) => {
			state.likeComment.loading = false;
		});
		builder.addCase(dislikeCommentPost.rejected, (state, action) => {
			state.likeComment.loading = false;
			state.likeComment.error = action.error.message;
		});
	},
});

export const { addMutatePosts, clearPostState } = postsSlice.actions;

export default postsSlice.reducer;
