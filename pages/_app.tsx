import { Provider as ReduxProvider } from "react-redux";
import { StylesProvider } from "@material-ui/styles";
import GlobalStyle from "styles/globalStyle";
import store from "src/store/store";
import GlobalLayout from "src/components/globalLayout";
import AuthProvider from "src/components/authProvider";
import NotificationsProvider from "src/components/notificationsProvider";
import ThemeProvider from "src/components/themeProvider";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<ReduxProvider store={store}>
				<AuthProvider>
					<StylesProvider injectFirst>
						<ThemeProvider>
							<GlobalStyle />
							<NotificationsProvider>
								<GlobalLayout>
									<Component {...pageProps} />
								</GlobalLayout>
							</NotificationsProvider>
						</ThemeProvider>
					</StylesProvider>
				</AuthProvider>
			</ReduxProvider>
		</>
	);
}

const makeStore = () => store;

export default MyApp;
