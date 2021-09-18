import React from "react";
import { socialData } from "src/data/socialData";
import styled from "styled-components";
import Link from "next/link";

interface IProps {}

const Footer = ({}: IProps) => {
	return (
		<FooterContainer>
			<Wrapper>
				<Column1>Made by Adrian Piątek</Column1>
				<Column2>
					<SocialContainer>
						<span>SOCIAL</span>
						<SocialList>
							{socialData.map((social, i) => (
								<SocialItem
									aria-label={social.title}
									key={`${social.title}-${i}`}
								>
									<Link passHref href={social.href}>
										<a
											target="_blank"
											rel="noopener noreferrer"
											aria-label={social.title}
										>
											<social.icon className="footerSocialItem__icon" />
										</a>
									</Link>
								</SocialItem>
							))}
						</SocialList>
					</SocialContainer>
				</Column2>
			</Wrapper>
		</FooterContainer>
	);
};

export default Footer;

const FooterContainer = styled.footer`
	background: ${({ theme }) => theme.colors.footer.primary};
	padding: 5rem 3rem;
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 30px 0;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;

	@media ${({ theme }) => theme.breakpoints.md} {
		flex-direction: row;
		gap: 0 30px;
		justify-content: space-between;
	}

	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const Column1 = styled.div`
	display: flex;
	align-items: center;
`;

const Column2 = styled(Column1)``;

const SocialContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	> span {
		margin-bottom: 10px;
		font-size: 1.4rem;
	}
`;

const SocialList = styled.ul`
	display: flex;
	gap: 0 10px;
`;

const SocialItem = styled.li`
	display: flex;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 1px;
	cursor: pointer;
	opacity: 1;
	transition: opacity 0.25s, transform 0.25s;

	> a {
		padding: 0.5rem;
		display: flex;
		flex-grow: 1;
		flex-basis: 100%;
	}

	&:hover {
		opacity: 0.65;
	}
	&:active {
		transform: scale(0.92);
	}

	.footerSocialItem__icon {
		font-size: 2.2rem;
	}
`;
