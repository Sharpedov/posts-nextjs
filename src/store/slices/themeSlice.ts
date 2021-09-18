import { createSlice } from "@reduxjs/toolkit";

interface ISetThemePayload {
	payload: {
		theme: "darkGray" | "dark" | "navyBlue";
	};
}
interface IState {
	theme: "darkGray" | "dark" | "navyBlue";
}

const getLocalStorageTheme = () => {
	if (typeof window !== "undefined") {
		if (localStorage.getItem("theme")) {
			return JSON.parse(localStorage.getItem("theme"));
		}
		return "darkGray";
	}
};

const initialState: IState = {
	theme: getLocalStorageTheme(),
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme: (state, action: ISetThemePayload) => {
			localStorage.setItem("theme", JSON.stringify(action.payload.theme));
			state.theme = action.payload.theme;
		},
	},
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
