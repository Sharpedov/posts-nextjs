import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import SelectMenu from "src/components/selectMenu";
import { ButtonBase } from "@material-ui/core";

interface IProps {
	children: React.ReactNode;
}

const accountSettingsLinksData = [
	{
		title: "Profile",
		href: "/settings",
	},
	{
		title: "Account",
		href: "/settings/account",
	},
];

const SettingsTemplate = ({ children }: IProps) => {
	const { pathname, push } = useRouter();
	const [selectedLink, setSelectedLink] = useState(null);
	const [openSelectMenu, setOpenSelectMenu] = useState<boolean>(false);

	useEffect(() => {
		setSelectedLink(
			accountSettingsLinksData.filter((link) => link.href === pathname)[0]
		);
	}, [pathname]);

	const changeSelectedLinkHandler = useCallback(
		(linkData: { title: string; href: string }) => {
			push(linkData.href);
			setSelectedLink(linkData);
		},
		[push]
	);

	return (
		<>
			<Container>
				<Wrapper>
					<Column1>
						<LinksGroup>
							<LinkGroupHeader>Settings</LinkGroupHeader>
							{accountSettingsLinksData.map((link, i) => (
								<LinkGroupItem
									key={`${link.title}-${i}`}
									className={pathname === link.href && "active"}
								>
									<Link passHref href={link.href}>
										<a href="settings">{link.title}</a>
									</Link>
								</LinkGroupItem>
							))}
						</LinksGroup>

						<SelectLinkButton
							onClick={() => setOpenSelectMenu((prev) => !prev)}
						>
							{selectedLink ? selectedLink.title : null}
							<SelectMenu
								isOpen={openSelectMenu}
								onClose={() => setOpenSelectMenu(false)}
								options={accountSettingsLinksData}
								onChange={changeSelectedLinkHandler}
								direction="topmid"
							/>
						</SelectLinkButton>
					</Column1>

					<Column2>{children}</Column2>
				</Wrapper>
			</Container>
		</>
	);
};

export default SettingsTemplate;

const Container = styled.div`
	padding: 0 1.5rem 2rem;
	min-height: 100vh;

	@media ${({ theme }) => theme.breakpoints.md} {
		padding: 0 2rem 2rem;
	}
`;

const Wrapper = styled.div`
	position: relative;
	display: grid;
	grid-template-columns: 1fr;
	align-content: flex-start;
	grid-gap: 0 40px;
	max-width: 1050px;
	margin: 10px auto 0;
	width: 100%;
	min-height: 400px;

	@media ${({ theme }) => theme.breakpoints.md} {
		grid-template-columns: 175px 1fr;
		margin: 40px auto 0;
	}
	@media ${({ theme }) => theme.breakpoints.xl} {
		max-width: 1180px;
	}
`;

const Column1 = styled.div`
	display: flex;
	flex-direction: column;
`;

const SelectLinkButton = styled(ButtonBase)`
	position: relative;
	height: 44px;
	background: ${({ theme }) => theme.colors.background.secondary};
	min-width: 120px;
	padding: 0.5rem 1.5rem;
	border-radius: 3px;
	margin-bottom: 10px;
	align-self: start;
	font-size: 1.5rem;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: none;
	}
`;

const LinksGroup = styled.ul`
	flex-direction: column;
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		display: flex;
	}
`;

const LinkGroupHeader = styled.li`
	margin-bottom: 10px;
	font-size: 1.3rem;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.color.secondary};
`;

const LinkGroupItem = styled.li`
	display: flex;
	font-size: 1.4rem;
	margin-bottom: 8px;
	padding: 0.5rem 1rem;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.color.secondary};
	font-weight: 300;

	> a {
		width: 100%;
		height: 100%;
	}

	&.active {
		background: ${({ theme }) => theme.colors.background.secondary};
		border-radius: 3px;
		font-weight: 400;
	}
`;

const Column2 = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	border-radius: 3px;
	min-height: 350px;
	background: ${({ theme }) => theme.colors.background.secondary};
	padding: 2rem;
`;
