import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import moment from "moment";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import CustomIconButton from "src/components/customIconButton";
import Modal from "src/components/modal";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import UserAvatar from "src/components/user/userAvatar";
import PostDetails from "./postDetails";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUpAlt";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PostMoreOptions from "./postMoreOptions";
import { useRouter } from "next/router";
import Image from "next/image";
import { RiChat3Line } from "react-icons/ri";
import { PostHelper } from "src/utils/postHelper";
import PostUserInfoOverlay from "./postUserInfoOverlay";

type RefType = HTMLDivElement;
type IProps = {
	post;
};

const mapState = (state) => ({
	deleteLoading: state.posts.delete.loading,
});

const PostCard = React.forwardRef(
	({ post }: IProps, ref: React.ForwardedRef<RefType>) => {
		const {
			createdAt,
			creator,
			creatorImage,
			likes,
			message,
			image,
			tags,
			_id,
		} = post;
		const { deleteLoading } = useSelector(mapState);
		const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState<boolean>(false);
		const [loadingWhileDelete, setLoadingWhileDelete] =
			useState<boolean>(false);
		const [postDetailsIsOpen, setPostDetailsModalIsOpen] =
			useState<boolean>(false);
		const [isUserInfoOverlayOpen, setIsUserInfoOverlayOpen] = useState(false);
		const {
			isLiked,
			handleLikePost,
			loading: likeDislikeLoading,
		} = PostHelper({ likes });
		const { query } = useRouter();
		const avatarContainerRef = useRef<HTMLDivElement>(null!);

		useEffect(() => {
			!deleteLoading && setLoadingWhileDelete(false);
		}, [deleteLoading]);

		const isTagActive = useCallback(
			(tag: string) => {
				return String(query.postTags)
					.split(",")
					.find((queryTag) => queryTag.toLowerCase() === tag.toLowerCase());
			},
			[query.postTags]
		);

		return (
			<>
				<Modal
					shoundBeCloseOutside
					isOpen={postDetailsIsOpen}
					onClose={() => setPostDetailsModalIsOpen(false)}
					scroll={true}
				>
					<PostDetails
						postId={_id}
						isInModal={true}
						onCloseModal={() => setPostDetailsModalIsOpen(false)}
					/>
				</Modal>

				<PostItem
					ref={ref}
					initial={false}
					animate={
						loadingWhileDelete
							? { scale: 0.92, opacity: 0.7 }
							: { scale: 1, opacity: 1 }
					}
				>
					<TopBar>
						<div style={{ display: "flex", gap: "10px" }}>
							<div
								ref={avatarContainerRef}
								style={{ position: "relative" }}
								onMouseEnter={() => setIsUserInfoOverlayOpen(true)}
								onMouseLeave={() => setIsUserInfoOverlayOpen(false)}
							>
								<Link passHref href={`/profile/${creator}`}>
									<a href={`/profile/${creator}`}>
										<UserAvatar src={creatorImage} username={creator} />
									</a>
								</Link>
								<PostUserInfoOverlay
									isOpen={isUserInfoOverlayOpen}
									creator={creator}
									boundingClientRect={avatarContainerRef.current?.getBoundingClientRect()}
								/>
							</div>
							<Column>
								<Link passHref href={`/profile/${creator}`}>
									<a href={`/profile/${creator}`}>
										<CreatorName>{creator}</CreatorName>
									</a>
								</Link>
								<CreatedAt>{moment(createdAt).fromNow()}</CreatedAt>
							</Column>
						</div>

						<div style={{ position: "relative" }}>
							<CustomIconButton
								size="medium"
								Icon={MoreHorizIcon}
								ariaLabel="Open more options"
								onClick={() => setMoreOptionsIsOpen((prev) => !prev)}
								style={{ opacity: 0.7 }}
							/>
							<PostMoreOptions
								isOpen={moreOptionsIsOpen}
								onClose={() => setMoreOptionsIsOpen(false)}
								postId={_id}
								postCreator={creator}
							/>
						</div>
					</TopBar>
					{image && (
						<>
							<ImagePostContainer>
								<Image
									layout="fill"
									src={image}
									alt={`${creator} post image`}
									draggable="false"
									objectFit="cover"
								/>
							</ImagePostContainer>
						</>
					)}
					<Content>
						<MessageRow>{message}</MessageRow>
						{tags.length >= 1 && (
							<TagsRow>
								{tags.map((tag, i) => (
									<Tag
										key={`${tag}-${i}`}
										className={isTagActive(tag) && "active"}
									>
										<Link passHref href={`/tagged/${tag}`}>
											<a>{`#${tag}`}</a>
										</Link>
									</Tag>
								))}
							</TagsRow>
						)}
					</Content>
					<Actions>
						<ActionsColumn1>
							<ActionItem>
								<CustomIconButton
									Icon={isLiked ? ThumbUpIcon : ThumbUpAltOutlinedIcon}
									ariaLabel={isLiked ? "Dislike post" : "Like post"}
									size="verySmall"
									changeColorOnHover={true}
									active={isLiked}
									disabled={likeDislikeLoading}
									onClick={() => handleLikePost({ postId: _id })}
								/>
								<span>{likes.length}</span>
							</ActionItem>
							<ActionItem>
								<CustomIconButton
									Icon={RiChat3Line}
									ariaLabel="Open comments"
									size="verySmall"
									changeColorOnHover={true}
									href={`/post/${_id}`}
								/>
							</ActionItem>
						</ActionsColumn1>
						<ActionsColumn2>
							<ActionItem>
								<CustomIconButton
									Icon={VisibilityIcon}
									ariaLabel="View in modal"
									size="verySmall"
									changeColorOnHover={true}
									onClick={() => setPostDetailsModalIsOpen((prev) => !prev)}
								/>
							</ActionItem>
						</ActionsColumn2>
					</Actions>
				</PostItem>
			</>
		);
	}
);

export default PostCard;

PostCard.displayName = "Post";

const postAppear = keyframes`
    from{
		transform: scale(.97);
		opacity:0;
    }
    to{
		transform: none;
		opacity:1;
    }
`;

const PostItem = styled(motion.div)`
	position: relative;
	display: flex;
	flex-direction: column;
	animation: ${postAppear} 0.2s linear;
	background: ${({ theme }) => theme.colors.background.secondary};

	@media ${({ theme }) => theme.breakpoints.sm} {
		border-radius: 3px;
	}
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const TopBar = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 7px 10px;
	gap: 10px;
`;

const CreatorName = styled.span`
	font-weight: 600;
	font-size: 15px;
`;

const CreatedAt = styled.div`
	color: ${({ theme }) => theme.colors.color.primary};
	opacity: 0.65;
	font-size: 12px;
	margin-top: 2px;
`;

const ImagePostContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	background: ${({ theme }) => `${theme.colors.background.primary + "77"}`};
	padding-bottom: 120%;

	> span {
		color: ${({ theme }) => theme.colors.button.primary};
	}
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding: 10px;
`;

const MessageRow = styled.div`
	font-size: 1.5rem;
	overflow: hidden;
	word-wrap: break-word;
`;

const TagsRow = styled.ul`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	margin: 10px 0;
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
		border-radius: 20px;
		padding: 3px 6px;
		opacity: 1;
	}

	&:hover {
		text-decoration: underline;
	}
`;

const Actions = styled.div`
	display: flex;
	place-content: center space-between;
	gap: 0 10px;
	padding: 0 10px 7px 10px;
	gap: 7px;
`;

const ActionsColumn1 = styled.div`
	display: flex;
	gap: 0 5px;
	align-items: center;
`;

const ActionsColumn2 = styled(ActionsColumn1)``;

const ActionItem = styled.div`
	display: flex;
	align-items: center;
	text-transform: none;
	font-size: 1.5rem;
	color: ${({ theme }) => theme.colors.color.primary};
	font-weight: 400;
	transition: all 0.15s ease;
	user-select: none;

	> span {
		margin-left: 2px;
		opacity: 0.8;
		line-height: 1;
	}

	.postAction__icon {
		font-size: 1.9rem;
	}
`;
