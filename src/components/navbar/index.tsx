import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import CreateIcon from "@material-ui/icons/Create";
import { Button } from "@material-ui/core";
import CreatePostForm from "../form/createPostForm";
import Modal from "../modal";
import CustomIconButton from "../customIconButton";
import { linksListData } from "src/data/navbarData";
import { useRouter } from "next/router";
import { useAuth } from "../authProvider";
import UserAvatar from "../user/userAvatar";
import { useScrollListener } from "src/hooks/useScrollListener";
import { AnimatePresence, motion } from "framer-motion";
import UserDropdownMenu from "../user/userDropdownMenu";
import SearchIcon from "@material-ui/icons/Search";
import TagsInput from "../input/tagsInput";
import CustomButton from "../customButton";
import CancelIcon from "@material-ui/icons/Cancel";
import MobileNavbarWrapper from "./mobileNavbarWrapper";
import NotLoggedNavbar from "./notLoggedNavbar";

interface IProps {}

const Navbar = ({}: IProps) => {
	const { user, loading, isLogged } = useAuth();
	const [createPostIsOpen, setCreatePostIsOpen] = useState(false);
	const [userDropdownIsOpen, setUserDropdownIsOpen] = useState<boolean>(false);
	const { pathname, push } = useRouter();
	const scroll = useScrollListener();
	const [showNavbar, setShowNavbar] = useState<boolean>(false);
	const [isInProfilePage, setIsInProfilePage] = useState<boolean>(false);
	const [searchTags, setSearchTags] = useState<string[]>([]);
	const [searchInputWrapperHover, setSearchInputWrapperHover] =
		useState<boolean>(false);

	const removeTagHandler = useCallback(
		(tag) => {
			setSearchTags((prev) => prev.filter((tagEl) => tagEl !== tag));
		},
		[setSearchTags]
	);

	useEffect(() => {
		scroll.y > 30 && scroll.y - scroll.lastY > 0
			? setShowNavbar(true)
			: setShowNavbar(false);
	}, [scroll.y, scroll.lastY]);

	useEffect(() => {
		if (pathname.includes("/profile/[profileName]")) {
			scroll.y > 50 ? setIsInProfilePage(false) : setIsInProfilePage(true);
		}

		return () => {
			setIsInProfilePage(false);
		};
	}, [pathname, scroll.y]);

	if (
		pathname === "/" ||
		pathname === "/login" ||
		pathname === "/createAccount" ||
		(!isLogged && !loading)
	) {
		return <NotLoggedNavbar />;
	}

	return (
		<>
			<Modal
				isOpen={createPostIsOpen}
				onClose={() => setCreatePostIsOpen(false)}
				scroll={true}
			>
				<CreatePostForm onClose={() => setCreatePostIsOpen(false)} />
			</Modal>

			<NavContainer showNavbar={showNavbar} isInProfilePage={isInProfilePage}>
				<MobileNavbarWrapper
					setCreatePostIsOpen={() => setCreatePostIsOpen(true)}
					searchTags={searchTags}
					setSearchTags={setSearchTags}
					removeTagHandler={removeTagHandler}
				/>
				<Wrapper>
					<LeftSide>
						<Logo>
							<Link href="/home">Posts</Link>
						</Logo>
						<SearchContainer>
							<SearchInputWrapper
								onMouseEnter={() => setSearchInputWrapperHover(true)}
								onMouseLeave={() => setSearchInputWrapperHover(false)}
							>
								<SearchIcon className="navbarSearch__icon" />
								<TagsInput tags={searchTags} setTags={setSearchTags} />
								<AnimatePresence>
									{searchInputWrapperHover && searchTags.length >= 1 && (
										<TagsLabel
											initial={{ opacity: 0, transition: { duration: 0.15 } }}
											animate={{ opacity: 1, transition: { duration: 0.15 } }}
											exit={{ opacity: 0, transition: { duration: 0.15 } }}
										>
											<TagsHeader>
												<span>
													{searchTags.length}{" "}
													{searchTags.length >= 2 ? "tags" : "tag"}
												</span>
												{searchTags.length >= 2 && (
													<span onClick={() => setSearchTags([])}>
														Remove all tags
													</span>
												)}
											</TagsHeader>
											<Tags>
												{searchTags.map((tag, i) => (
													<Tag key={`tag-${tag}-${i}`}>
														<motion.span>{tag}</motion.span>
														<RemoveTag onClick={() => removeTagHandler(tag)}>
															<CancelIcon className="navbarSearchBar__icon" />
														</RemoveTag>
													</Tag>
												))}
											</Tags>
										</TagsLabel>
									)}
								</AnimatePresence>
							</SearchInputWrapper>
							<AnimatePresence>
								{searchTags.length >= 1 && (
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1, transition: { duration: 0.15 } }}
										exit={{ opacity: 0, transition: { duration: 0.15 } }}
									>
										<CustomButton
											variant="default"
											size="small"
											style={{ margin: "0px 6px" }}
											onClick={() => push(`/tagged/${searchTags.join(",")}`)}
										>
											Search
										</CustomButton>
									</motion.div>
								)}
							</AnimatePresence>
						</SearchContainer>
					</LeftSide>

					<RightSide>
						<LinksList>
							{linksListData.desktop.map((link, i) => (
								<CustomIconButton
									key={`${i}-${link.title}`}
									ariaLabel={link.title}
									href={
										link.href === "/profile"
											? `${link.href}/${user?.username}`
											: link.href
									}
									Icon={link.icon}
									size="medium"
								/>
							))}
						</LinksList>
						<CreatePostButton onClick={() => setCreatePostIsOpen(true)}>
							<CreateIcon className="navbarCreatePost__icon" />
						</CreatePostButton>

						<div style={{ position: "relative" }}>
							<UserAvatar
								src={user?.avatar}
								username={user?.username}
								loading={loading}
								onClick={() => setUserDropdownIsOpen((prev) => !prev)}
							/>
							<UserDropdownMenu
								isOpen={userDropdownIsOpen}
								onClose={() => setUserDropdownIsOpen(false)}
							/>
						</div>
					</RightSide>
				</Wrapper>
			</NavContainer>
		</>
	);
};

export default Navbar;

const NavContainer = styled(motion.nav)`
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	background: ${({ theme }) => theme.colors.navbar.primary};
	height: 44px;
	margin-top: -44px;
	transform: ${({ showNavbar }) => showNavbar && "translateY(-100%)"};
	transition: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1),
		background 0.35s cubic-bezier(0.5, 1, 0.89, 1);
	z-index: 100;
	padding: 0 1rem;

	@media ${({ theme }) => theme.breakpoints.lg} {
		padding: 0 2rem;

		height: 58px;
		margin-top: -58px;
		background: ${({ theme, isInProfilePage }) =>
			!!isInProfilePage
				? theme.colors.navbar.secondary
				: theme.colors.navbar.primary};

		&:hover {
			background: ${({ theme, isInProfilePage }) =>
				isInProfilePage && theme.colors.navbar.primary};
		}
	}

	@media ${({ theme }) => theme.breakpoints.xl} {
		padding: 0 2.2rem;
	}
`;

const Wrapper = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto;
		height: inherit;
	}
`;

const LeftSide = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: flex;
		align-items: center;
		height: 100%;
		padding: 1.2rem 0;
	}
`;

const Logo = styled.div`
	letter-spacing: 1px;
	font-size: 2.2rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.title};
`;

const SearchContainer = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: flex;
		align-items: center;
		height: 100%;
	}
`;

const SearchInputWrapper = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		position: relative;
		display: flex;
		align-items: center;
		border-radius: 3px;
		min-width: 400px;
		max-width: 400px;
		width: 100%;
		color: ${({ theme }) => theme.colors.color.primary};
		background: rgb(255, 255, 255, 0.1);
		height: 100%;
		margin-left: 15px;
		transition: background 0.15s ease;

		.navbarSearch__icon {
			height: 100%;
			margin: 0 0.5rem;
			font-size: 2rem;
		}

		&:focus-within {
			background: rgb(255, 255, 255, 0.05);
		}
	}
`;

const TagsLabel = styled(motion.div)`
	position: absolute;
	bottom: 0;
	left: 20%;
	display: flex;
	flex-direction: column;
	transform: translateY(calc(100%));
	margin-top: 15px;
	padding: 1rem 1.5rem;
	background: ${({ theme }) => theme.colors.background.secondary};
	box-shadow: ${({ theme }) => theme.boxShadow.primary};
	border-radius: 3px;
	z-index: 10;
`;

const TagsHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 7px;

	> span {
		color: ${({ theme }) => theme.colors.button.primary};
		font-size: 1.3rem;

		&:nth-child(2) {
			cursor: pointer;
			margin-left: 15px;
		}
	}
`;

const Tags = styled(motion.ul)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	height: 100%;
	gap: 5px;
	overflow-y: scroll;
	max-height: 125px;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const Tag = styled(motion.li)`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	padding: 0.5rem 0.3rem;
	font-size: 1.35rem;
	background: ${({ theme }) => theme.colors.button.primary};
	user-select: none;
`;

const RemoveTag = styled(motion.div)`
	display: grid;
	place-items: center;
	cursor: pointer;
	margin-left: 2px;

	.navbarSearchBar__icon {
		font-size: 1.4rem;
	}
`;

const LinksList = styled.ul`
	display: none;
	gap: 0 10px;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: flex;
		align-items: center;
	}
`;

const CreatePostButton = styled(Button)`
	border-radius: 3px;
	background: ${({ theme }) => theme.colors.button.primary};
	min-width: 45px;
	padding: 0;
	height: 32px;

	> span {
		color: #fff;
	}

	.navbarCreatePost__icon {
		fill: ${({ theme }) => theme.colors.background.primary};
		font-size: 2.7rem;
	}

	&:hover {
		background: ${({ theme }) => theme.colors.button.primary};
	}
`;

const RightSide = styled.div`
	display: none;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: flex;
		align-items: center;
		gap: 0 16px;
		height: 60%;
	}
`;
