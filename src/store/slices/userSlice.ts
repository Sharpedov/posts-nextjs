import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authPatcher } from "src/utils/authAxiosMethods";
import { mutate } from "swr";
import { addNotification } from "./notificationsSlice";

interface IFollowUser {
	username: string;
}

export const followUser = createAsyncThunk(
	"user/follow",
	async ({ username }: IFollowUser, { getState, dispatch }) => {
		try {
			const {
				auth: { user },
			} = getState() as any;

			if (!user) throw "User are not logged in";

			await authPatcher(`/api/users/${username}/follow`, {
				userId: user._id,
			});

			await mutate("/api/auth/getLoggedUser");
			await mutate(`/api/users/${username}`);

			dispatch(addNotification({ message: `You are following ${username}` }));

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const unfollowUser = createAsyncThunk(
	"user/unfollow",
	async ({ username }: IFollowUser, { getState, dispatch }) => {
		try {
			const {
				auth: { user },
			} = getState() as any;

			if (!user) throw "User are not logged in";

			await authPatcher(`/api/users/${username}/unfollow`, {
				userId: user._id,
			});

			await mutate("/api/auth/getLoggedUser");
			await mutate(`/api/users/${username}`);

			dispatch(
				addNotification({ message: `${username} is no longer followed` })
			);

			return;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

const initialState = {
	follow: {
		loading: false,
		error: null,
	},
	unfollow: {
		loading: false,
		error: null,
	},
};

const userSlice = createSlice({
	name: "userSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		//// follow
		builder.addCase(followUser.pending, (state) => {
			state.follow.loading = true;
			state.follow.error = null;
		});
		builder.addCase(followUser.fulfilled, (state) => {
			state.follow.loading = false;
		});
		builder.addCase(followUser.rejected, (state, action) => {
			state.follow.loading = false;
			state.follow.error = action.error.message;
		});

		//// unfollow
		builder.addCase(unfollowUser.pending, (state) => {
			state.unfollow.loading = true;
			state.unfollow.error = null;
		});
		builder.addCase(unfollowUser.fulfilled, (state) => {
			state.unfollow.loading = false;
		});
		builder.addCase(unfollowUser.rejected, (state, action) => {
			state.unfollow.loading = false;
			state.unfollow.error = action.error.message;
		});
	},
});

export default userSlice.reducer;
