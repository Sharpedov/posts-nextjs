import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addNotification } from "./notificationsSlice";

interface IUploadFile {
	file: File;
	setProgress?: (percentage: number) => void;
}

async function handleUploadFile(
	file: File,
	setProgress: (percentage: number) => void
) {
	const formData = new FormData();
	const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
	const key = "docs_upload_example_us_preset";
	formData.append("file", file);
	formData.append("upload_preset", key);

	try {
		const { data } = await axios.post(url, formData, {
			onUploadProgress: (progressEvent) => {
				let percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total
				);
				setProgress(percentCompleted);
			},
			headers: {
				"Content-Type": "text/plain",
				"X-Requested-With": "XMLHttpRequest",
			},
		});
		return data.secure_url;
	} catch (err) {
		throw err;
	}
}

export const uploadFileAvatar = createAsyncThunk(
	"uploadFile/uploadFileAvatar",
	async ({ file, setProgress }: IUploadFile, { dispatch }) => {
		try {
			const url = await handleUploadFile(file, setProgress);

			return url;
		} catch (error) {
			dispatch(
				addNotification({
					message: error.response.data.message ?? error.message,
				})
			);
			throw error.response.data.message ?? error.message;
		}
	}
);

export const uploadFilePost = createAsyncThunk(
	"uploadFile/uploadFilePost",
	async ({ file, setProgress }: IUploadFile, { dispatch }) => {
		try {
			const url = await handleUploadFile(file, setProgress);

			return url;
		} catch (error) {
			dispatch(
				addNotification({
					message: error.response.data.message ?? error.message,
				})
			);
			throw error.response.data.message ?? error.message;
		}
	}
);

export const uploadFileBanner = createAsyncThunk(
	"uploadFile/uploadFileBanner",
	async ({ file, setProgress }: IUploadFile, { dispatch }) => {
		try {
			const url = await handleUploadFile(file, setProgress);

			return url;
		} catch (error) {
			dispatch(
				addNotification({
					message: error.response.data.message ?? error.message,
				})
			);
			throw error.response.data.message ?? error.message;
		}
	}
);

const initialState = {
	avatar: {
		url: null,
		loading: false,
		error: null,
	},
	post: {
		url: null,
		loading: false,
		error: null,
	},
	banner: {
		url: null,
		loading: false,
		error: null,
	},
};

const uploadFilesSlice = createSlice({
	name: "uploadFile",
	initialState,
	reducers: {
		resetUploadAvatar: (state) => {
			state.avatar.url = null;
			state.avatar.error = null;
		},
		resetUploadPost: (state) => {
			state.post.url = null;
			state.post.error = null;
		},
		resetUploadBanner: (state) => {
			state.banner.url = null;
			state.banner.error = null;
		},
	},
	extraReducers: (builder) => {
		//// upload avatar
		builder.addCase(uploadFileAvatar.pending, (state) => {
			state.avatar.loading = true;
			state.avatar.error = null;
		});
		builder.addCase(uploadFileAvatar.fulfilled, (state, action) => {
			state.avatar.loading = false;
			state.avatar.url = action.payload;
		});
		builder.addCase(uploadFileAvatar.rejected, (state, action) => {
			state.avatar.loading = false;
			state.avatar.error = action.error.message;
		});

		//// upload post image
		builder.addCase(uploadFilePost.pending, (state) => {
			state.post.loading = true;
			state.post.error = null;
		});
		builder.addCase(uploadFilePost.fulfilled, (state, action) => {
			state.post.loading = false;
			state.post.url = action.payload;
		});
		builder.addCase(uploadFilePost.rejected, (state, action) => {
			state.post.loading = false;
			state.post.error = action.error.message;
		});

		//// upload banner
		builder.addCase(uploadFileBanner.pending, (state) => {
			state.banner.loading = true;
			state.banner.error = null;
		});
		builder.addCase(uploadFileBanner.fulfilled, (state, action) => {
			state.banner.loading = false;
			state.banner.url = action.payload;
		});
		builder.addCase(uploadFileBanner.rejected, (state, action) => {
			state.banner.loading = false;
			state.banner.error = action.error.message;
		});
	},
});

export const { resetUploadAvatar, resetUploadPost, resetUploadBanner } =
	uploadFilesSlice.actions;

export default uploadFilesSlice.reducer;
