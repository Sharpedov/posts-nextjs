import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import CustomIconButton from "../customIconButton";
import TagsInput from "../input/tagsInput";
import MobileMenuSidebar from "./mobileMenuSidebar";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import Link from "next/link";
import CustomButton from "../customButton";
import { useRouter } from "next/router";

interface IProps {
	setCreatePostIsOpen;
	searchTags;
	setSearchTags;
	removeTagHandler: (tag) => void;
}

const TagsLabelVariants = {
	hidden: {
		opacity: 0,
		transition: {
			duration: 0.1,
		},
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.1,
		},
	},
};

const MobileNavbarWrapper = ({
	setCreatePostIsOpen,
	searchTags,
	setSearchTags,
	removeTagHandler,
}: IProps) => {
	const [mobileSearchBarIsOpen, setMobileSearchBarIsOpen] =
		useState<boolean>(false);
	const { push } = useRouter();

	return (
		<>
			<Wrapper>
				<MobileMenuSidebar setCreatePostIsOpen={setCreatePostIsOpen} />

				{!mobileSearchBarIsOpen && (
					<Logo>
						<Link href="/home">Posts</Link>
					</Logo>
				)}
				{mobileSearchBarIsOpen ? (
					<>
						<SearchBarContainer>
							<SearchBarWrapper>
								<TagsInput tags={searchTags} setTags={setSearchTags} />
							</SearchBarWrapper>
							<CustomIconButton
								Icon={CloseIcon}
								ariaLabel="Close search bar"
								onClick={() => setMobileSearchBarIsOpen(false)}
								size="medium"
							/>
						</SearchBarContainer>
					</>
				) : (
					<CustomIconButton
						ariaLabel="Open search bar"
						Icon={SearchRoundedIcon}
						size="medium"
						onClick={() => setMobileSearchBarIsOpen(true)}
					/>
				)}
				<AnimatePresence>
					{mobileSearchBarIsOpen && (
						<TagsLabel
							variants={TagsLabelVariants}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<TagsHeader>
								<span>{searchTags.length} tags</span>
								{searchTags.length >= 1 && (
									<CustomButton
										size="small"
										variant="default"
										onClick={() => {
											push(`/tagged/${searchTags.join(",")}`);
											setMobileSearchBarIsOpen(false);
										}}
									>
										Search
									</CustomButton>
								)}
							</TagsHeader>
							{searchTags.length >= 1 && (
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
							)}
							{searchTags.length >= 2 && (
								<TagsBottom>
									<span onClick={() => setSearchTags([])}>Remove all tags</span>
								</TagsBottom>
							)}
						</TagsLabel>
					)}
				</AnimatePresence>
			</Wrapper>
		</>
	);
};

export default MobileNavbarWrapper;

const Wrapper = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1050px;
	width: 100%;
	margin: 0 auto;
	height: inherit;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: none;
	}
`;

const Logo = styled.div`
	letter-spacing: 1px;
	font-size: 1.9rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 700;
	font-family: ${({ theme }) => theme.fonts.title};

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 2rem;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 2.1rem;
	}
`;

const SearchBarContainer = styled.div`
	display: flex;
	align-items: center;
	flex-grow: 1;
	height: 100%;

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: none;
	}
`;

const SearchBarWrapper = styled.div`
	display: flex;
	align-items: center;
	border-radius: 3px;
	flex-grow: 1;
	height: 100%;
	padding: 0 5px;
	max-height: 32px;
	background: rgb(255, 255, 255, 0.1);
	margin: 0 5px;
	transition: background 0.15s ease;

	&:focus-within {
		background: rgb(255, 255, 255, 0.05);
	}
`;

const TagsLabel = styled(motion.div)`
	position: absolute;
	left: -10px;
	right: -10px;
	top: 100%;
	display: flex;
	flex-direction: column;
	min-height: 20px;
	margin-top: -1px;
	padding: 1rem;
	background: ${({ disableBackground, theme, isInProfilePage }) =>
		!disableBackground && !!isInProfilePage
			? theme.colors.navbar.secondary
			: theme.colors.navbar.primary};

	@media ${({ theme }) => theme.breakpoints.lg} {
		display: none;
	}
`;

const TagsHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	> span {
		color: ${({ theme }) => theme.colors.button.primary};
		font-size: 1.3rem;

		&:nth-child(2) {
			cursor: pointer;
			margin-left: 15px;
		}
	}
`;

const TagsBottom = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> span {
		color: ${({ theme }) => theme.colors.button.primary};
		font-size: 1.3rem;
		cursor: pointer;
	}
`;

const Tags = styled(motion.ul)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	height: 100%;
	gap: 5px;
	margin: 5px 0;
	max-height: 85px;
	overflow-y: scroll;

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
