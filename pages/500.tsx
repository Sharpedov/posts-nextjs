import React from "react";
import Head from "next/head";
import Footer from "src/components/footer";

export default function Http500() {
	return (
		<>
			<Head>
				<title>500 error • Posts</title>
			</Head>
			<div style={{ height: "90vh", padding: "3rem 1.5rem" }}>
				<h1>500 server error</h1>
			</div>
			<Footer />
		</>
	);
}
