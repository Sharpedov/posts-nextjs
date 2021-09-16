import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { darkGrayTheme } from "styles/darkGrayTheme";
import { darkTheme } from "styles/darkTheme";
import { navyBlueTheme } from "styles/navyBlueTheme";

const mapState = (state) => ({
	theme: state.theme.theme,
});
const ThemeProvider = ({ children }) => {
	const { theme } = useSelector(mapState);

	const filterTheme = useMemo(() => {
		switch (theme) {
			case "darkGray": {
				return darkGrayTheme;
			}
			case "navyBlue": {
				return navyBlueTheme;
			}
			case "dark": {
				return darkTheme;
			}
			default: {
				return darkGrayTheme;
			}
		}
	}, [theme]);

	return (
		<StyledThemeProvider theme={filterTheme}>{children}</StyledThemeProvider>
	);
};

export default ThemeProvider;
