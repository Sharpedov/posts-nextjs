import React from "react";
import Head from "next/head";
import styled from "styled-components";
import Posts from "src/components/posts";
import cookie from "cookie";

export default function HomePage() {
	return (
		<>
			<Head>
				<title>Home • Posts</title>
			</Head>
			<MainContainer>
				<Wrapper>
					<Posts queryKeyWithLimit="/api/posts?limit=12" />
				</Wrapper>
			</MainContainer>
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res } = context;
	const cookies = cookie.parse(req.headers.cookie || "");

	if (!cookies.auth) {
		res.writeHead(302, { Location: "/" });
		res.end();
	}

	return { props: {} };
}

const MainContainer = styled.main`
	padding: 1rem 0 4rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 1rem 1rem 4rem;
	}
`;

const Wrapper = styled.div`
	max-width: 1050px;
	margin: 0 auto;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;
