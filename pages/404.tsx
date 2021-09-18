import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Image from "next/image";
import CustomButton from "src/components/customButton";
import Footer from "src/components/footer";

export default function Http404() {
	return (
		<>
			<Head>
				<title>404 error • Posts</title>
			</Head>
			<Container>
				<h1>404 page not found</h1>
				<Image src="/404.svg" alt="404 not found" width={400} height={400} />
				<CustomButton style={{ margin: "25px auto 0" }} href="/home">
					Go home
				</CustomButton>
			</Container>
			<Footer />
		</>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 900px;
	width: 100%;
	margin: 0 auto;
	padding: 60px 16px;

	> h1 {
		font-size: clamp(21px, 3vw, 40px);
		margin-bottom: 30px;
	}
`;
