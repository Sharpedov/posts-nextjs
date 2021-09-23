import { combineReducers } from "redux";
import authSlice from "./slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./slices/postsSlice";
import notificationsSlice from "./slices/notificationsSlice";
import uploadFilesSlice from "./slices/uploadFilesSlice";
import themeSlice from "./slices/themeSlice";
import userSlice from "./slices/userSlice";

const reducer = combineReducers({
	auth: authSlice,
	posts: postsSlice,
	notifications: notificationsSlice,
	uploadFiles: uploadFilesSlice,
	theme: themeSlice,
	user: userSlice,
});

const store = configureStore({
	reducer,
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
