import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import router from "next/router";
import {
	authFetcher,
	authPatcher,
	authPoster,
} from "src/utils/authAxiosMethods";
import { addNotification } from "./notificationsSlice";

interface ICreateAccount {
	username: string;
	email: string;
	password: string;
}

interface ILogin {
	email: string;
	password: string;
}

interface IUpdateAccount {
	avatar: string | undefined;
	username: string;
	newEmail: string;
	password: string;
	newPassword: string;
	onComplete?;
}

interface IUpdateProfile {
	avatar: string | undefined;
	banner: string | undefined;
	description: string;
	onComplete?;
}

export const getLoggedUser = createAsyncThunk(
	"auth/getLoggedUser",
	async () => {
		try {
			const user = await authFetcher("/api/auth/getLoggedUser");

			return user;
		} catch (error) {
			throw error.response.data.message;
		}
	}
);

export const createAccount = createAsyncThunk(
	"auth/createAccount",
	async ({ username, email, password }: ICreateAccount, { dispatch }) => {
		try {
			const data = await axios
				.post("/api/auth/signup", { username, email, password })
				.then((res) => res.data);

			router.push("/login");

			return data;
		} catch (error) {
			dispatch(
				addNotification({ message: error.response.data.message, time: 4000 })
			);
			throw error.response.data.message;
		}
	}
);

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }: ILogin, { dispatch }) => {
		try {
			await axios
				.post("/api/auth/login", { email, password })
				.then((res) => res.data);

			await dispatch(getLoggedUser());

			router.push("/home");

			return;
		} catch (error) {
			dispatch(
				addNotification({ message: error.response.data.message, time: 4000 })
			);
			throw error.response.data.message;
		}
	}
);

export const updateAccount = createAsyncThunk(
	"auth/updateAccount",
	async (
		{ username, newEmail, password, newPassword, onComplete }: IUpdateAccount,
		{ getState, dispatch }
	) => {
		try {
			const {
				auth: { user },
			} = getState() as any;

			await authPatcher(`/api/users/updateAccount`, {
				username: user.username === username ? undefined : username,
				email: user.email,
				newEmail: user.email === newEmail ? undefined : newEmail,
				password,
				newPassword,
			});

			onComplete && onComplete();

			dispatch(getLoggedUser());
			dispatch(addNotification({ message: "User has been updated" }));

			return null;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);
export const updateProfile = createAsyncThunk(
	"auth/updateProfile",
	async (
		{ avatar, banner, description, onComplete }: IUpdateProfile,
		{ getState, dispatch }
	) => {
		try {
			const {
				auth: { user },
			} = getState() as any;

			await authPatcher(`/api/users/updateProfile`, {
				email: user.email,
				avatar,
				banner,
				description,
			});

			onComplete && onComplete();

			dispatch(addNotification({ message: "User has been updated" }));
			dispatch(getLoggedUser());

			return null;
		} catch (error) {
			dispatch(addNotification({ message: error.response.data.message }));
			throw error.response.data.message;
		}
	}
);

export const logout = createAsyncThunk("auth/logout", async () => {
	try {
		await authPoster("/api/auth/logout");
		router.replace("/");

		return null;
	} catch (error) {
		throw error.response.data.message;
	}
});

const initialState = {
	user: null,
	loading: true,
	error: null,
	login: {
		loading: false,
		error: null,
	},
	createAccount: {
		loading: false,
		error: null,
	},
	update: {
		account: {
			loading: false,
			error: null,
		},
		profile: {
			loading: false,
			error: null,
		},
	},
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getLoggedUser.pending, (state) => {
			state.loading = true;
			state.user = state.user;
			state.error = null;
		});
		builder.addCase(getLoggedUser.fulfilled, (state, action) => {
			state.user = action.payload;
			state.loading = false;
		});
		builder.addCase(getLoggedUser.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});

		builder.addCase(login.pending, (state) => {
			state.login.loading = true;
			state.login.error = null;
		});
		builder.addCase(login.fulfilled, (state) => {
			state.login.loading = false;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.login.loading = false;
			state.login.error = action.error.message;
		});

		builder.addCase(createAccount.pending, (state) => {
			state.createAccount.loading = true;
			state.createAccount.error = null;
		});
		builder.addCase(createAccount.fulfilled, (state, action) => {
			state.createAccount.loading = false;
		});
		builder.addCase(createAccount.rejected, (state, action) => {
			state.createAccount.loading = false;
			state.createAccount.error = action.error.message;
		});

		builder.addCase(updateAccount.pending, (state) => {
			state.update.account.loading = true;
			state.update.account.error = null;
		});
		builder.addCase(updateAccount.fulfilled, (state) => {
			state.update.account.loading = false;
		});
		builder.addCase(updateAccount.rejected, (state, action) => {
			state.update.account.loading = false;
			state.update.account.error = action.error.message;
		});

		builder.addCase(updateProfile.pending, (state) => {
			state.update.profile.loading = true;
			state.update.profile.error = null;
		});
		builder.addCase(updateProfile.fulfilled, (state) => {
			state.update.profile.loading = false;
		});
		builder.addCase(updateProfile.rejected, (state, action) => {
			state.update.profile.loading = false;
			state.update.profile.error = action.error.message;
		});

		builder.addCase(logout.fulfilled, (state) => {
			state.user = null;
			state.loading = false;
			state.error = null;
		});
	},
});

export const {} = authSlice.actions;

export default authSlice.reducer;
