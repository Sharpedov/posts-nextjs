import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import Head from "next/head";
import CustomButton from "src/components/customButton";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import Image from "next/image";
import cookie from "cookie";
import Footer from "src/components/footer";

const backgroundData = [
	"/images/home_background_1.jfif",
	"/images/home_background_2.jfif",
	"/images/home_background_3.jpg",
	"/images/home_background_4.jpg",
	"/images/home_background_5.jpg",
];

export default function DefaultPage() {
	const randomBackground = useMemo(
		() => Math.floor(Math.random() * backgroundData.length),
		[]
	);

	return (
		<>
			<Head>
				<title>Posts</title>
				<meta
					name="description"
					content="Posts is a place to discover and publish the stuff you love"
				/>
			</Head>
			<Container>
				<ScrollToList>
					<ScrollToItem
						activeClass="active"
						to="hero"
						spy={true}
						smooth={true}
						duration={500}
					/>

					<ScrollToItem
						activeClass="active"
						to="rows"
						spy={true}
						smooth={true}
						duration={500}
					/>
				</ScrollToList>
				<HeroContainer id="hero">
					<HeroBackground bg={backgroundData[randomBackground]} />
					<Panel
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0.1 } }}
					>
						<Logo>Posts</Logo>
						<Text>Create, admire and enjoy.</Text>
						<Buttons>
							<CustomButton href="/login">Sign in</CustomButton>
							<CustomButton href="/createAccount" color="secondary">
								Create Account
							</CustomButton>
						</Buttons>
					</Panel>
				</HeroContainer>
				<RowContainer id="rows">
					<RowWrapper>
						<RowColumn1>
							<Image
								src="/easyPosting.svg"
								layout="fill"
								alt="s"
								draggable="false"
							/>
						</RowColumn1>
						<RowColumn2>
							<h2>Lorem ipsum dolor sit amet</h2>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
								aliquam neque interdum erat tempus laoreet. Praesent magna nunc,
								feugiat id dapibus id, ultricies eu dui.
							</p>
						</RowColumn2>
					</RowWrapper>
				</RowContainer>
				<RowContainer reverse>
					<RowWrapper reverse>
						<RowColumn1>
							<Image src="/rwd.svg" layout="fill" alt="s" draggable="false" />
						</RowColumn1>
						<RowColumn2>
							<h2>Lorem ipsum dolor sit amet</h2>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
								aliquam neque interdum erat tempus laoreet.
							</p>
						</RowColumn2>
					</RowWrapper>
				</RowContainer>
			</Container>
			<Footer />
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
	min-height: 100vh;
	margin-top: -44px;

	@media ${({ theme }) => theme.breakpoints.lg} {
		margin-top: -58px;
	}
`;

const ScrollToList = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.sm} {
		position: fixed;
		left: 5%;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 10px 0;
		z-index: 10;
	}
`;

const ScrollToItem = styled(ScrollLink)`
	height: 16px;
	width: 16px;
	border-radius: 50%;
	box-shadow: inset 0 0 0 3px #fff;
	opacity: 0.5;
	cursor: pointer;
	transition: background 0.2s ease, opacity 0.2s ease;

	&.active {
		opacity: 1;
		background: #fff;
		box-shadow: none;
	}

	&:hover {
		opacity: 1;
	}
`;

const HeroContainer = styled.div`
	display: grid;
	place-items: center;
	position: relative;
	height: 95vh;
	width: 100%;
`;

const HeroBackground = styled.div`
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

const Logo = styled.div`
	font-size: 4rem;
	font-weight: 700;
	letter-spacing: 1px;
	font-family: ${({ theme }) => theme.fonts.title};
	margin-bottom: 20px;

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 4.4rem;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 4.8rem;
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		font-size: 5.3rem;
	}
`;

const Text = styled.p`
	font-size: 1.7rem;
	text-align: center;
	margin-bottom: 20px;

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 1.8rem;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 1.9rem;
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		font-size: 2rem;
	}
`;

const Buttons = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 15px 0;
`;

const RowContainer = styled.div`
	display: flex;
	background: ${({ theme, reverse }) =>
		reverse
			? theme.colors.background.secondary
			: theme.colors.background.primary};
`;

const RowWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 5.6rem 2rem;
	min-height: 450px;
	gap: 0 40px;
	width: 100%;
	max-width: 1050px;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.md} {
		flex-direction: ${({ reverse }) => (reverse ? "row-reverse" : "row")};
		padding: 12rem 2rem;
	}
`;

const RowColumn1 = styled.div`
	display: flex;
	position: relative;
	flex-basis: 60%;
	min-height: 125px;
`;
const RowColumn2 = styled.div`
	flex-basis: 40%;
	display: flex;
	flex-direction: column;
	margin-top: 20px;

	> h2 {
		font-weight: 700;
		line-height: 120%;
		font-size: clamp(2rem, 3vw, 3.6rem);
	}

	> p {
		margin-top: 24px;
		font-size: clamp(1.5rem, 1.8vw, 1.9rem);
		line-height: 1.625;
		font-weight: 300;
		opacity: 0.9;
	}

	@media ${({ theme }) => theme.breakpoints.md} {
		margin-top: 0px;
	}
`;
