import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import Head from "next/head";
import LoginForm from "src/components/form/loginForm";
import cookie from "cookie";

const backgroundData = [
	"/images/home_background_1.jfif",
	"/images/home_background_2.jfif",
	"/images/home_background_3.jpg",
	"/images/home_background_4.jpg",
	"/images/home_background_5.jpg",
];

export default function LoginPage() {
	const randomBackground = useMemo(
		() => Math.floor(Math.random() * backgroundData.length),
		[]
	);

	return (
		<>
			<Head>
				<title>Login • Posts</title>
				<meta name="description" content="Login to Posts" />
			</Head>
			<Container>
				<Background bg={backgroundData[randomBackground]} />
				<Panel>
					<LoginForm />
				</Panel>
			</Container>
		</>
	);
}

export async function getServerSideProps(context) {
	const { req, res } = context;
	const cookies = cookie.parse(req.headers.cookie || "");

	if (cookies.auth) {
		res.writeHead(302, { Location: "/home" });
		res.end();
	}

	return { props: {} };
}

const appearAnimation = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

const Container = styled.div`
	display: grid;
	place-items: center;
	position: relative;
	height: 100vh;
	width: 100%;
	margin-top: -44px;

	@media ${({ theme }) => theme.breakpoints.lg} {
		margin-top: -58px;
	}
`;

const Background = styled.div`
	position: absolute;
	inset: 0;
	background: ${({ theme }) => theme.colors.background.primary};
	background-image: ${({ bg }) => `url(${bg})`};
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 50% 50%;
	animation: ${appearAnimation} 0.25s ease;
	z-index: -1;

	&::after {
		content: "";
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.38);
	}
`;

const Panel = styled(motion.div)`
	display: grid;
	grid-template-columns: 1fr;
	justify-items: center;
	color: ${({ theme }) => theme.colors.color.primary};
	max-width: 350px;
	width: 92vw;
	border-radius: 3px;
	padding: 6.5rem 2rem;
`;
