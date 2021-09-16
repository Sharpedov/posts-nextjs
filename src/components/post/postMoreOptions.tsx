import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	clearPostState,
	deletePost,
	getPost,
} from "src/store/slices/postsSlice";
import ConfirmModal from "../modal/confirmModal";
import Modal from "../modal";
import CreatePostForm from "../form/createPostForm";
import SelectMenu from "../selectMenu";
import { useAuth } from "../authProvider";
import { useRouter } from "next/router";

interface IProps {
	isOpen: boolean;
	onClose: () => void;
	postId;
	postCreator?: string;
}

interface IOptionsData {
	title: string;
	action: "copyLink" | "edit" | "delete";
}

const defaultOptionsData: IOptionsData[] = [
	{ title: "Copy link URL", action: "copyLink" },
];
const ownerOptionsData: IOptionsData[] = [
	{ title: "Copy link URL", action: "copyLink" },
	{ title: "Edit post", action: "edit" },
	{ title: "Delete post", action: "delete" },
];

const mapState = (state) => ({
	deleteLoading: state.posts.delete.loading,
});

const PostMoreOptions = ({ isOpen, onClose, postId, postCreator }: IProps) => {
	const { user, isLogged } = useAuth();
	const [selectedOption, setSelectedOption] = useState<IOptionsData>(null);
	const { deleteLoading } = useSelector(mapState);
	const dispatch = useDispatch();
	const { pathname, push } = useRouter();

	const optionsDataFilter = useMemo(() => {
		if (isLogged) {
			return user.username === postCreator
				? ownerOptionsData
				: defaultOptionsData;
		}
	}, [isLogged, user, postCreator]);

	const selectOptionHandler = useCallback(
		(option: IOptionsData) => {
			setSelectedOption(option);
			onClose();
			switch (option.action) {
				case "copyLink": {
					return navigator.clipboard.writeText(
						`${process.env.HOST}/post/${postId}`
					);
				}
				case "edit": {
					return dispatch(getPost({ id: postId }));
				}
				default:
					return null;
			}
		},
		[dispatch, postId, onClose]
	);

	return (
		<>
			<ConfirmModal
				isOpen={selectedOption?.action === "delete"}
				onClose={() => setSelectedOption(null)}
				message="Are you sure you want to delete this post?"
				buttonText="Delete post"
				loading={deleteLoading}
				onClickButton={() => {
					dispatch(
						deletePost({
							id: postId,
							onComplete: () => {
								setSelectedOption(null);
								pathname === "/post/[postId]" && push("/home");
							},
						})
					);
				}}
			/>
			<Modal
				isOpen={selectedOption?.action === "edit"}
				onClose={() => {
					setSelectedOption(null);
					dispatch(clearPostState());
				}}
				scroll={true}
			>
				<CreatePostForm
					onClose={() => {
						setSelectedOption(null);
						dispatch(clearPostState());
					}}
					editMode={true}
				/>
			</Modal>
			<SelectMenu
				isOpen={isOpen}
				options={optionsDataFilter}
				onClose={onClose}
				onChange={selectOptionHandler}
			/>
		</>
	);
};

export default PostMoreOptions;
