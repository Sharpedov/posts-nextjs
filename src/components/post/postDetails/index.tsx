import React, { useMemo, useState } from "react";
import { fetcher } from "src/utils/fetcher";
import styled from "styled-components";
import useSWR from "swr";
import Link from "next/link";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import { PostLikeHandler } from "src/utils/postLikeHandler";
import CustomIconButton from "src/components/customIconButton";
import UserAvatar from "src/components/user/userAvatar";
import ScaleLoading from "src/components/loading/scaleLoading";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import PostMoreOptions from "../postMoreOptions";
import moment from "moment";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

interface IProps {
	postId;
	isInModal?: boolean;
	initialData?;
	onCloseModal?: () => void;
}

const PostDetails = ({
	postId,
	isInModal,
	initialData,
	onCloseModal,
}: IProps) => {
	const { data, error } = useSWR(
		isInModal && postId && `/api/posts/post/${postId}`,
		fetcher
	);
	const postData = useMemo(() => {
		if (isInModal) return error ? { error } : data;
		return initialData.error ? { error: initialData.error } : initialData.data;
	}, [data, error, initialData, isInModal]);
	const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState<boolean>(false);
	const {
		isLiked,
		likeHandler,
		loading: likeDislikeLoading,
	} = PostLikeHandler({
		likes: postData?.error || !postData ? [] : postData?.likes,
	});

	return (
		<>
			{postData?.error ? (
				<div>{postData.error.message}</div>
			) : !postData ? (
				<ScaleLoading center marginTop={30} />
			) : (
				<Container isInModal={isInModal}>
					<Row1>
						<UserAvatarContainer>
							<Link passHref href={`/profile/${postData.creator}`}>
								<a>
									<UserAvatar
										src={postData.creatorImage}
										username={postData.creator}
										size={45}
									/>
								</a>
							</Link>
						</UserAvatarContainer>
						<UsernameAndCreatedAtColumn>
							<UsernameRow>
								<Link passHref href={`/profile/${postData.creator}`}>
									<a>{postData.creator}</a>
								</Link>
							</UsernameRow>
							<CreatedAt>{moment(postData.createdAt).fromNow()}</CreatedAt>
						</UsernameAndCreatedAtColumn>
						<OptionsButtons>
							<div style={{ position: "relative" }}>
								<CustomIconButton
									Icon={MoreHorizIcon}
									size="small"
									ariaLabel="Open more options"
									onClick={() => setMoreOptionsIsOpen((prev) => !prev)}
									style={{ opacity: 0.7 }}
								/>
								<PostMoreOptions
									isOpen={moreOptionsIsOpen}
									onClose={() => setMoreOptionsIsOpen(false)}
									postId={postData._id}
									postCreator={postData.creator}
								/>
							</div>
							{isInModal && (
								<CustomIconButton
									Icon={CloseRoundedIcon}
									size="small"
									ariaLabel="Open more options"
									onClick={onCloseModal}
									style={{ opacity: 0.7 }}
								/>
							)}
						</OptionsButtons>
					</Row1>
					<Row2>
						<MessageRow>{postData.message}</MessageRow>
						<ImageContainer>
							<ImageWrapper>
								<ImagePost
									src={postData.image}
									alt={postData.title}
									draggable="false"
									objectFit="cover"
								/>
							</ImageWrapper>
						</ImageContainer>
						{postData.tags.length >= 1 && (
							<TagsRow>
								{postData.tags.map((tag, i) => (
									<Link passHref href={`/tagged/${tag}`} key={`${tag}-${i}`}>
										<a>
											<Tag>{`#${tag}`}</Tag>
										</a>
									</Link>
								))}
							</TagsRow>
						)}
						<Actions isInModal={isInModal}>
							<ActionItem>
								<CustomIconButton
									Icon={ThumbUpAltOutlinedIcon}
									ariaLabel="Like post"
									size="small"
									changeColorOnHover={true}
									active={isLiked}
									disabled={likeDislikeLoading}
									onClick={() =>
										likeHandler({
											postId: postData._id,
										})
									}
								/>
								<span>{postData.likes.length}</span>
							</ActionItem>
							{isInModal && (
								<ActionItem>
									<CustomIconButton
										Icon={OpenInNewIcon}
										ariaLabel="View in new page"
										size="small"
										changeColorOnHover={true}
										href={`/post/${postData._id}`}
									/>
								</ActionItem>
							)}
						</Actions>
					</Row2>
				</Container>
			)}
		</>
	);
};

export default PostDetails;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 815px;
	margin: ${({ isInModal }) => (isInModal ? "30px auto" : "0 auto")};
	background: ${({ theme }) => theme.colors.background.secondary};
	border-radius: 3px;
	overflow: hidden;
	padding: 1.5rem;
	animation: ${({ isInModal }) => !isInModal && "appear 0.25s ease"};

	@media ${({ theme }) => theme.breakpoints.md} {
	}

	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const Row1 = styled.div`
	position: relative;
	display: flex;
`;
const UserAvatarContainer = styled.div`
	display: flex;
	flex-direction: column;
`;
const UsernameAndCreatedAtColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	margin-left: 10px;
`;

const OptionsButtons = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	gap: 0 10px;
`;

const Row2 = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	overflow: hidden;
	margin-top: 10px;
`;

const UsernameRow = styled.div`
	font-weight: 600;
	font-size: 1.6rem;
`;

const CreatedAt = styled.div`
	color: ${({ theme }) => theme.colors.color.primary};
	opacity: 0.65;
	font-size: 1.3rem;
`;

const MessageRow = styled.div`
	display: inline-block;
	font-size: 1.6rem;
	margin-bottom: 10px;
	width: 100%;
	flex-grow: 1;
	overflow-wrap: break-word;
`;

const ImageContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #000;
	width: 100%;
	min-height: 225px;
	max-height: 675px;

	@media ${({ theme }) => theme.breakpoints.md} {
		min-height: 450px;
	}
`;

const ImageWrapper = styled.div`
	max-height: 575px;
	width: 100%;

	@media ${({ theme }) => theme.breakpoints.md} {
		max-height: 675px;
	}
`;

const ImagePost = styled.img`
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
	max-height: 575px;

	@media ${({ theme }) => theme.breakpoints.md} {
		max-height: 675px;
	}
`;

const TagsRow = styled.ul`
	display: flex;
	flex-wrap: wrap;
	margin-top: 10px;
	gap: 8px;
	word-break: break-word;
`;

const Tag = styled.li`
	display: inline-block;
	opacity: 0.65;
	font-size: 1.35rem;
	cursor: pointer;
	line-height: 1;

	&.active {
		background: ${({ theme }) => theme.colors.button.primary};
		padding: 4px 6px;
		border-radius: 20px;
		opacity: 1;
	}

	&:hover {
		text-decoration: underline;
	}
`;

const Actions = styled.div`
	display: flex;
	place-content: ${({ isInModal }) =>
		isInModal ? "center space-around" : "center flex-start"};
	gap: 0 10px;
	margin-top: 10px;
	gap: 7px;
`;

const ActionItem = styled.div`
	display: flex;
	align-items: center;
	text-transform: none;
	font-size: 1.7rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 400;
	transition: all 0.15s ease;

	> span {
		margin-left: 2px;
	}

	.postAction__icon {
		font-size: 1.9rem;
	}
`;
