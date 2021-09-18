import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App {...props} />),
				});

			const inistialProps = await Document.getInitialProps(ctx);

			return {
				...inistialProps,
				styles: (
					<>
						{inistialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta name="apple-mobile-web-app-title" content="Posts" />
					<meta name="theme-color" content="#121212" />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,700;1,600&family=Roboto:wght@300;400;500;700&display=swap"
						rel="stylesheet"
					/>
					<meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
				</Head>
				<body>
					<Main />
					<NextScript />
					<div id="modal" />
					<div id="notifications" />
				</body>
			</Html>
		);
	}
}
