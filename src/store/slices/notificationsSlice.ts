import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

interface IAddNotificationPayload {
	payload: {
		message: string;
		time?: number;
	};
}

const initialState = {
	notifications: [],
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification: (state, action: IAddNotificationPayload) => {
			const { message, time } = action.payload;

			state.notifications = [
				...state.notifications,
				{
					id: v4(),
					message,
					time,
				},
			];
		},

		removeNotification: (state, action) => {
			state.notifications = state.notifications.filter(
				(notification) => notification.id !== action.payload
			);
		},

		clearNotifications: (state) => {
			state.notifications = [];
		},
	},
});

export const { addNotification, removeNotification, clearNotifications } =
	notificationsSlice.actions;

export default notificationsSlice.reducer;
