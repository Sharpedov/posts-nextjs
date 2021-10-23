import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import { fetcher } from "src/utils/fetcher";
import Image from "next/image";
import UserAvatar from "../user/userAvatar";
import Link from "next/link";
import ScaleLoading from "../loading/scaleLoading";
import { CardActionArea } from "@material-ui/core";
import { FollowHelper } from "src/utils/followHelper";
import { useUser } from "../userProvider";
import CustomButton from "../customButton";

interface IProps {
	isOpen: boolean;
	creator: string;
	boundingClientRect;
}

const PostUserInfoOverlay = ({
	isOpen,
	creator,
	boundingClientRect,
}: IProps) => {
	const { user, isLogged, loading } = useUser();
	const { data, error } = useSWR(
		isOpen && creator && `/api/users/${creator}`,
		fetcher
	);
	const { data: postsData, error: postsError } = useSWR(
		isOpen &&
			data &&
			!error &&
			`/api/posts/userPosts?username=${data.user.username}&limit=3&page=1`,
		fetcher
	);
	const [goToBottom, setGoToBottom] = useState(false);
	const containerRef = useRef(null!);

	const { isFollowing, handleFollow, followLoading } = FollowHelper({
		followers: data && !error && data.user.followers,
		username: data && !error && data.user.username,
	});

	useEffect(() => {
		if (isOpen) {
			const handleScroll = () =>
				setGoToBottom(window.innerHeight - boundingClientRect?.bottom >= 300);

			handleScroll();

			window.addEventListener("scroll", handleScroll);

			return () => window.removeEventListener("scroll", handleScroll);
		}
	}, [boundingClientRect, isOpen]);

	return (
		<AnimatePresence>
			{isOpen &&
				(error ? (
					<Container
						goToBottom={goToBottom}
						initial={{
							opacity: 0,
							scale: 0.97,
							transition: { duration: 0.2 },
						}}
						animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
						exit={{
							opacity: 0,
							scale: 0.97,
							transition: { duration: 0.2 },
						}}
					>
						<div style={{ padding: "10px", fontSize: "14px" }}>
							We couldn&apos;t fetch user details
						</div>
					</Container>
				) : !data ? null : (
					<Container
						ref={containerRef}
						goToBottom={goToBottom}
						initial={{
							opacity: 0,
							scale: 0.97,
							transition: { duration: 0.2 },
						}}
						animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
						exit={{
							opacity: 0,
							scale: 0.97,
							transition: { duration: 0.2 },
						}}
					>
						<Banner>
							{data.user.banner && (
								<Image
									layout="fill"
									src={data.user.banner}
									alt={data.user.username}
									draggable="false"
									objectFit="cover"
								/>
							)}
							<UserAvatarContainer
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { duration: 0.4 } }}
							>
								<Link passHref href={`/profile/${data.user.username}`}>
									<a href={`/profile/${data.user.username}`}>
										<UserAvatar
											src={data.user.avatar}
											username={data.user.username}
											size={64}
										/>
									</a>
								</Link>
							</UserAvatarContainer>
							<BannerActions
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,

									transition: { duration: 0.35 },
								}}
							>
								{loading || !isLogged || !data || error
									? null
									: user.username! !== data.user.username && (
											<CustomButton
												size="small"
												color={isFollowing ? "secondary" : "primary"}
												onClick={handleFollow}
												disabled={loading}
												loading={followLoading}
											>
												{isFollowing ? "Unfollow" : "Follow"}
											</CustomButton>
									  )}
							</BannerActions>
						</Banner>
						<Content>
							<Link passHref href={`/profile/${data.user.username}`}>
								<h1>
									<a href={`/profile/${data.user.username}`}>
										{data.user.username}
									</a>
								</h1>
							</Link>
							<p>
								{!!data.user.description
									? data.user.description
									: "Lack of description"}
							</p>
						</Content>
						<PostsGrid flex={!postsData || postsError}>
							{postsError ? (
								<div>Something went wrong and we couldn&apos;t get posts</div>
							) : !postsData ? (
								<div
									style={{
										display: "grid",
										placeItems: "center",
										height: "80px",
									}}
								>
									<ScaleLoading size="small" center />
								</div>
							) : (
								postsData.map((post) => (
									<Link key={post._id} passHref href={`/post/${post._id}`}>
										<a href={`/post/${post._id}`}>
											<PostCard
												component={motion.div}
												initial={{ opacity: 0 }}
												animate={{
													opacity: 1,

													transition: { duration: 0.35 },
												}}
											>
												<Image
													layout="fill"
													src={post.image}
													alt={`${post.creator}'s post`}
													draggable="false"
													objectFit="cover"
												/>
											</PostCard>
										</a>
									</Link>
								))
							)}
						</PostsGrid>
					</Container>
				))}
		</AnimatePresence>
	);
};

export default PostUserInfoOverlay;

const Container = styled(motion.div)`
	display: none;

	@media ${({ theme }) => theme.breakpoints.md} {
		position: absolute;
		width: 270px;
		left: -5px;
		bottom: ${({ goToBottom }) => (goToBottom ? "none" : "75%")};
		top: ${({ goToBottom }) => (goToBottom ? "75%" : "none")};
		display: flex;
		flex-direction: column;
		background: ${({ theme }) => theme.colors.background.secondary};
		border-radius: 3px;
		z-index: 2;
		box-shadow: ${({ theme }) => theme.boxShadow.primary};
		overflow: hidden;
	}
`;

const Banner = styled.div`
	position: relative;
	display: flex;
	flex-grow: 1;
	height: 120px;
	background: #242538;
`;

const BannerActions = styled(motion.div)`
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	transform: translate(-10px, 5px);
`;

const UserAvatarContainer = styled(motion.div)`
	display: grid;
	place-items: center;
	background: ${({ theme }) => theme.colors.background.secondary};
	width: 74px;
	height: 74px;
	border-radius: 3px;
	z-index: 1;
	align-self: end;
	margin: 0 auto -2.1rem;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2.2rem 0;
	text-align: center;

	> h1 {
		font-size: 1.8rem;
		font-weight: 500;
		margin-bottom: 0.8rem;
	}
	> p {
		font-weight: 400;
		font-size: 1.4rem;
		opacity: 0.8;
	}
`;

const PostsGrid = styled.div`
	display: ${({ flex }) => (flex ? "flex" : "grid")};
	grid-template-columns: ${({ flex }) => !flex && "repeat(3, 80px)"};
	justify-content: center;
	grid-gap: 7px;
	width: 100%;
	padding: 0 7px 10px;
	font-size: 1.5rem;
	text-align: center;
`;

const PostCard = styled(CardActionArea)`
	position: relative;
	padding-top: 100%;
	cursor: pointer;

	> span {
		background: none;
	}
`;
