import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ButtonBase, IconButton } from "@material-ui/core";
import { useAuth } from "../authProvider";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CustomIconButton from "../customIconButton";
import CustomButton from "../customButton";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import { useDispatch, useSelector } from "react-redux";
import { createPost, editPost } from "src/store/slices/postsSlice";
import LinearLoading from "../loading/linearLoading";
import ScaleLoading from "../loading/scaleLoading";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import UserAvatar from "../user/userAvatar";
import {
	resetUploadPost,
	uploadFilePost,
} from "src/store/slices/uploadFilesSlice";
import TagsInput from "../input/tagsInput";
import FocusTrap from "focus-trap-react";

interface IProps {
	onClose: () => void;
	editMode?: boolean;
}

interface IFormInputs {
	message: string;
}

const yupSchema = yup.object({
	message: yup.string().max(255).required("Please fill the message field"),
});

const mapState = (state) => ({
	post: state.posts.post.post,
	postLoading: state.posts.post.loading,
	postError: state.posts.post.error,
	createLoading: state.posts.create.loading,
	createError: state.posts.create.error,
	editLoading: state.posts.edit.loading,
	editError: state.posts.edit.error,
	uploadPostUrl: state.uploadFiles.post.url,
	uploadPostUrlLoading: state.uploadFiles.post.loading,
});

const CreatePostForm = ({ onClose, editMode }: IProps) => {
	const {
		post,
		postLoading,
		createLoading,
		editLoading,
		uploadPostUrl,
		uploadPostUrlLoading,
		postError,
	} = useSelector(mapState);
	const methods = useForm<IFormInputs>({ resolver: yupResolver(yupSchema) });
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = methods;
	const { user, loading } = useAuth();
	const filepickerRef = useRef(null);
	const dispatch = useDispatch();
	const [uploadProgress, setUploadProgress] = useState<number>(0);
	const [selectedImage, setSelectedImage] = useState(null);
	const [tags, setTags] = useState([]);
	const [uploadError, setUploadError] = useState<string>("");

	const checkKeyDown = (e) => {
		if (e.code === "Enter") e.preventDefault();
	};

	const onSubmit: SubmitHandler<IFormInputs> = (data: IFormInputs) => {
		if (editMode) {
			dispatch(
				editPost({
					id: post._id,
					postData: {
						...data,
						image: selectedImage,
						creator: user.username,
						creatorImage: user.avatar,
						tags,
					},
					onComplete: () => {
						onClose();
						reset();
						dispatch(resetUploadPost());
					},
				})
			);
			return null;
		}

		dispatch(
			createPost({
				postData: {
					...data,
					image: selectedImage,
					creator: user.username,
					creatorImage: user.avatar,
					tags,
				},
				onComplete: () => {
					onClose();
					reset();
					dispatch(resetUploadPost());
				},
			})
		);
		return null;
	};

	const addImageHandler = useCallback(
		(e) => {
			if (!!e.target.files[0]) {
				setUploadError("");
				const file = e.target.files[0];
				const reader = new FileReader();

				if (file.size >= 4 * 1024 * 1024)
					return setUploadError("File is too big");

				if (file) {
					reader.readAsDataURL(e.target.files[0]);
				}

				reader.onload = (readerEvent) => {
					dispatch(
						uploadFilePost({
							file: readerEvent.target.result,
							setProgress: setUploadProgress,
						})
					);
				};
			}
		},
		[dispatch]
	);

	const removeImage = useCallback(() => {
		dispatch(resetUploadPost());
		setSelectedImage(null);
	}, [dispatch]);

	useEffect(() => {
		uploadProgress === 100 && setUploadProgress(0);
	}, [uploadProgress]);

	useEffect(() => {
		uploadPostUrl && setSelectedImage(uploadPostUrl);
	}, [uploadPostUrl]);

	useEffect(() => {
		editMode && post && setSelectedImage(post.image);
		editMode && post && setTags(post.tags);
	}, [post, editMode]);

	return postLoading || loading ? (
		<ScaleLoading />
	) : postError ? (
		<div>
			<div>{postError}</div>
		</div>
	) : (
		<FocusTrap>
			<AnimateSharedLayout>
				<Container layout>
					{(createLoading || editLoading || !!uploadProgress) && (
						<LinearLoading progress={uploadProgress} />
					)}
					<MobileActionsRow
						layout
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						exit={{ opacity: 0 }}
					>
						<CustomIconButton
							size="small"
							ariaLabel="Close create post modal"
							Icon={CloseRoundedIcon}
							onClick={onClose}
						/>
						<CustomButton
							size="small"
							type="submit"
							disabled={!selectedImage || tags.length === 0}
							loading={createLoading || editLoading || uploadPostUrlLoading}
						>
							{editMode ? "Edit" : "Publish now"}
						</CustomButton>
					</MobileActionsRow>
					<UserInfo layout>
						<UserAvatar src={user.avatar} username={user.username} />
						<span>{user.username}</span>
					</UserInfo>
					<Content layout>
						<AnimatePresence>
							{selectedImage && (
								<SelectedImageContainer
									layout
									initial={{
										scale: 0.9,
										opacity: 0,
										transition: { duration: 0.35 },
									}}
									animate={{
										scale: 1,
										opacity: 1,
										transition: { duration: 0.35 },
									}}
									exit={{ opacity: 0 }}
								>
									{!createLoading ?? !editLoading ? (
										<RemoveImageButton onClick={removeImage} tabIndex={-1}>
											<CloseRoundedIcon className="createPostFormRemoveImageButton__icon" />
										</RemoveImageButton>
									) : null}
									<SelectedImage
										src={selectedImage}
										alt="Selected image"
										layout
									/>
								</SelectedImageContainer>
							)}
						</AnimatePresence>
						<motion.textarea
							{...register("message")}
							placeholder="Message..."
							defaultValue={editMode && post.message}
							autoComplete="off"
							layout
						/>
						{errors.message && (
							<ErrorMessage layout>{errors.message.message}</ErrorMessage>
						)}

						<TagsRow>
							<TagsInput
								tags={tags ?? []}
								setTags={setTags}
								flexibility={true}
								placeholder="Press enter to add tag"
							/>
						</TagsRow>
					</Content>
					<UploadOptionsContainer layout>
						<UploadOptions>
							<UploadOption
								layout
								onClick={() => filepickerRef.current.click()}
								aria-label="Upload image file"
							>
								<ImageOutlinedIcon className="createPostFormUploadOption__icon" />
								<input
									ref={filepickerRef}
									type="file"
									onChange={(e) => addImageHandler(e)}
									hidden
									accept="image/png, image/jpeg"
								/>
							</UploadOption>
						</UploadOptions>

						<span>Allowed Formats: JPEG, PNG. Max size: 4mb.</span>
					</UploadOptionsContainer>
					{uploadError && <UploadError>{uploadError}</UploadError>}

					<ActionsRow
						layout
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						exit={{ opacity: 0 }}
					>
						<CustomButton size="small" onClick={onClose} color="red">
							Close
						</CustomButton>
						<CustomButton
							size="small"
							onClick={handleSubmit(onSubmit)}
							disabled={!selectedImage || tags.length === 0}
							loading={createLoading || editLoading || uploadPostUrlLoading}
						>
							{editMode ? "Edit" : "Publish now"}
						</CustomButton>
					</ActionsRow>
				</Container>
			</AnimateSharedLayout>
		</FocusTrap>
	);
};

export default CreatePostForm;

const Container = styled(motion.div)`
	position: relative;
	display: flex;
	flex-direction: column;
	background: ${({ theme }) => theme.colors.background.secondary};
	width: 100vw;
	max-width: 530px;
	margin: 0 auto;
	border-bottom: 1px solid rgba(255, 255, 255, 0.13);
	border-top: 1px solid rgba(255, 255, 255, 0.13);

	@media ${({ theme }) => theme.breakpoints.sm} {
		width: 92vw;
		border-radius: 3px;
		border-bottom: none;
		border-top: none;
		margin: 20px 0;
		box-shadow: ${({ theme }) => theme.boxShadow.primary};
	}
`;

const MobileActionsRow = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1rem 0;

	@media ${({ theme }) => theme.breakpoints.sm} {
		display: none;
	}
`;

const ActionsRow = styled(MobileActionsRow)`
	display: none;
	padding: 1.5rem 2rem;
	border-top: 1px solid rgba(255, 255, 255, 0.13);

	@media ${({ theme }) => theme.breakpoints.sm} {
		display: flex;
	}
`;

const UserInfo = styled(motion.div)`
	display: flex;
	align-items: center;
	padding: 1rem 1rem;

	> span {
		margin-left: 10px;
	}

	@media ${({ theme }) => theme.breakpoints.sm} {
		padding: 1.5rem 2rem;
	}
`;

const Content = styled(motion.div)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	gap: 10px 0;
	padding: 0 1.5rem 1.5rem;
	color: ${({ theme }) => theme.colors.color.primary};

	> input,
	> textarea {
		background: none;
		color: inherit;
		line-height: 1;
	}
	> textarea {
		position: relative;
		resize: none;
		min-height: 50px;
	}
`;

const UploadOptionsContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	padding: 0 1rem 1rem;

	> span {
		color: ${({ theme }) => theme.colors.color.secondary};
		font-size: 1.2rem;
		opacity: 0.7;
		margin-top: 3px;
	}

	@media ${({ theme }) => theme.breakpoints.sm} {
		padding: 0 1.5rem 1rem;
	}
`;

const UploadOptions = styled(motion.ul)`
	display: flex;
	align-items: center;
`;

const UploadOption = styled(IconButton)`
	display: grid;
	place-items: center;
	border-radius: 50%;
	padding: 0;
	height: 34px;
	width: 34px;
	cursor: pointer;

	.createPostFormUploadOption__icon {
		fill: ${({ theme }) => theme.colors.button.primary};
		font-size: 2.2rem;
	}

	&:hover,
	&:focus {
		background: ${({ theme }) => `${theme.colors.button.primary + "33"}`};
	}

	&:active {
		background: ${({ theme }) => `${theme.colors.button.primary + "45"}`};
	}
`;

const TagsRow = styled(motion.div)`
	display: flex;
	width: 100%;
	padding: 1rem;
	background: rgba(255, 255, 255, 0.04);
	min-height: 50px;
	border-radius: 3px;
	transition: background 0.15s ease;

	&:focus-within {
		background: rgba(255, 255, 255, 0.02);
	}
`;

const ErrorMessage = styled(motion.div)`
	font-size: 1.4rem;
	color: rgba(255, 0, 0, 0.8);
	padding: 0 1rem;

	@media ${({ theme }) => theme.breakpoints.sm} {
		padding: 0 2rem;
	}
`;

const SelectedImageContainer = styled(motion.div)`
	position: relative;
	z-index: 3;
	height: 100%;
	width: 100%;
	max-height: 675px;
`;

const SelectedImage = styled(motion.img)`
	display: block;
	width: 100%;
	height: 100%;
	max-height: 675px;
	object-fit: contain;
`;

const RemoveImageButton = styled(ButtonBase)`
	position: absolute;
	display: flex;
	top: 5px;
	right: 5px;
	background: rgba(255, 0, 0, 0.7);
	border-radius: 50%;
	padding: 2px;

	.createPostFormRemoveImageButton__icon {
		font-size: 2rem;
	}

	@media ${({ theme }) => theme.breakpoints.lg} {
		opacity: 0;
		transform: scale(0);
		transition: opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1),
			transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

		${SelectedImageContainer}:hover & {
			opacity: 1;
			transform: scale(1);
		}
	}
`;

const UploadError = styled.div`
	display: inline-block;
	color: rgba(255, 0, 0, 0.75);
	font-size: 1.4rem;
	margin-top: -5px;
	padding: 0 1rem 1rem;

	@media ${({ theme }) => theme.breakpoints.sm} {
		padding: 0 1.5rem 1rem;
	}
`;
