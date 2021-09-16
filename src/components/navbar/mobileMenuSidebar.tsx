import React, { useState } from "react";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import { Button, IconButton } from "@material-ui/core";
import Sidebar from "../sidebar";
import { linksListData, userDropdownData } from "src/data/navbarData";
import Link from "next/link";
import { useAuth } from "../authProvider";
import UserAvatar from "../user/userAvatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { logout } from "src/store/slices/authSlice";
import { useDispatch } from "react-redux";

interface IProps {
	setCreatePostIsOpen;
}

const MobileMenuSidebar = ({ setCreatePostIsOpen }: IProps) => {
	const [menuSidebarIsOpen, setMenuSidebarIsOpen] = useState<boolean>(false);
	const { user, isLogged, loading } = useAuth();
	const dispatch = useDispatch();

	return (
		<>
			<Menubar
				isOpen={menuSidebarIsOpen}
				tabIndex={0}
				aria-label="Toggle menu bar"
				onClick={() => setMenuSidebarIsOpen((prev) => !prev)}
			>
				<div />
				<div />
				<div />
			</Menubar>
			<Sidebar
				isOpen={menuSidebarIsOpen}
				onClose={() => setMenuSidebarIsOpen(false)}
			>
				<Content>
					<CreatePostButton
						onClick={() => {
							setCreatePostIsOpen(true);
							setMenuSidebarIsOpen(false);
						}}
					>
						<CreateIcon className="mobileMenuSidebarCreatePost__icon" />
						Create post
					</CreatePostButton>
					<LinksList>
						{linksListData.mobile.map((link, i) => (
							<Link key={`${i}-${link.title}`} passHref href={link.href}>
								<LinkItem onClick={() => setMenuSidebarIsOpen(false)}>
									<link.icon className="mobileMenuSidebarLinkItem__icon" />
									{link.title}
								</LinkItem>
							</Link>
						))}
					</LinksList>
					{isLogged && (
						<>
							<Heading>Profile</Heading>
							<UserMenu>
								<UserAvatar
									loading={loading}
									src={user.avatar}
									username={user.username}
									size={45}
								/>
								<UserInfoColumn>
									<span>{user.username}</span>
									<span>{user.email}</span>
								</UserInfoColumn>
							</UserMenu>
							<LinksList>
								{userDropdownData.map((link, i) => (
									<Link
										key={`${i}-${link.title}`}
										passHref
										href={
											link.href === "/profile"
												? `/profile/${user.username}`
												: link.href
										}
									>
										<LinkItem onClick={() => setMenuSidebarIsOpen(false)}>
											<link.icon className="mobileMenuSidebarLinkItem__icon" />
											{link.title}
										</LinkItem>
									</Link>
								))}
								<LinkItem
									onClick={() => {
										dispatch(logout());
										setMenuSidebarIsOpen(false);
									}}
								>
									<ExitToAppIcon className="mobileMenuSidebarLinkItem__icon" />
									Logout
								</LinkItem>
							</LinksList>
						</>
					)}
				</Content>
			</Sidebar>
		</>
	);
};

export default MobileMenuSidebar;

const Menubar = styled(IconButton)`
	position: relative;
	width: 38px;
	height: 38px;
	padding: 0;
	z-index: 905;

	> span {
		color: ${({ theme }) => theme.colors.color.primary};

		> div {
			position: absolute;
			top: 50%;
			transform-origin: 50% 50%;
			background: ${({ theme }) => theme.colors.color.primary};
			width: 20px;
			height: 2px;
			border-radius: 20px;
			transform-origin: 50% 50%;
			transition: opacity 0.1s ease,
				transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

			&:nth-child(1) {
				transform: ${({ isOpen }) =>
					isOpen
						? "rotate(45deg) translate3d(0,0px,0)"
						: "rotate(0deg) translate3d(0,-6px,0)"};
			}
			&:nth-child(2) {
				opacity: ${({ isOpen }) => (isOpen ? "0" : "1")};
			}
			&:nth-child(3) {
				transform: ${({ isOpen }) =>
					isOpen
						? "rotate(-45deg) translate3d(0,0px,0)"
						: "rotate(0deg) translate3d(0,6px,0)"};
			}
		}
	}

	&:hover {
		background: ${({ theme }) => `${theme.colors.color.primary + "22"}`};
	}
`;

const Content = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	justify-items: center;
	margin-top: 15px;
`;

const CreatePostButton = styled(Button)`
	border-radius: 3px;
	background: ${({ theme }) => theme.colors.button.primary};
	min-width: 45px;
	padding: 0.5rem 1rem;
	height: 100%;
	max-width: 145px;
	color: ${({ theme }) => theme.colors.background.primary};
	text-transform: none;
	font-size: 1.6rem;

	.mobileMenuSidebarCreatePost__icon {
		fill: ${({ theme }) => theme.colors.background.primary};
		font-size: 2.7rem;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.button.primary};
	}
`;

const LinksList = styled.ul`
	display: grid;
	grid-template-columns: 1fr;
	width: 100%;
	margin-top: 10px;
`;

const LinkItem = styled(Button)`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 0 1.5rem;
	color: ${({ theme }) => theme.colors.color.primary};
	height: 45px;
	border-radius: 0;
	font-size: 1.6rem;
	text-transform: none;
	font-weight: 400;
	transition: background 0.1s ease;

	.mobileMenuSidebarLinkItem__icon {
		fill: ${({ theme }) => theme.colors.color.primary};
		margin-right: 20px;
		font-size: 2.7rem;
	}

	&:hover {
		background: ${({ theme }) => `${theme.colors.color.primary + "11"}`};
	}
`;

const Heading = styled.h4`
	display: flex;
	justify-self: flex-start;
	padding: 0 1.5rem;
	margin-top: 20px;
	font-size: 1.8rem;
	width: 100%;
`;
const UserMenu = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 1.5rem 1.5rem 0;
`;

const UserInfoColumn = styled.div`
	display: flex;
	flex-direction: column;
	margin-left: 10px;

	> span {
		font-size: 1.45rem;
		line-height: 1.35;

		&:nth-child(1) {
			font-weight: 600;
		}
		&:nth-child(2) {
			opacity: 0.7;
			font-size: 1.35rem;
		}
	}
`;
