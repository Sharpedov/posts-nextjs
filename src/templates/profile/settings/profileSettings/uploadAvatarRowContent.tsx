import { Avatar, ButtonBase } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FileError, useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "src/components/authProvider";
import CustomButton from "src/components/customButton";
import {
	resetUploadAvatar,
	uploadFileAvatar,
} from "src/store/slices/uploadFilesSlice";
import styled from "styled-components";

interface IProps {
	setProgress;
}

interface IUploadedFile {
	file: File;
	errors: FileError[];
}

const mapState = (state) => ({
	uploadAvatarUrl: state.uploadFiles.avatar.url,
});

const UploadAvatarRowContent = ({ setProgress }: IProps) => {
	const { user } = useAuth();
	const { uploadAvatarUrl } = useSelector(mapState);
	const [fileAvatar, setFileAvatar] = useState<IUploadedFile[]>([]);
	const onDrop = useCallback((acceptedFiles: File[], rejFiles) => {
		const mappedAcc = acceptedFiles.map((file) => ({ file, errors: [] }));
		setFileAvatar([...mappedAcc, ...rejFiles]);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: "image/jpeg, image/png",
		maxSize: 3 * 1024 * 1024,
	});
	const dispatch = useDispatch();

	useEffect(() => {
		{
			!fileAvatar[0]?.errors.length &&
				fileAvatar.length === 1 &&
				dispatch(
					uploadFileAvatar({
						file: fileAvatar[0].file,
						setProgress,
					})
				);
		}
	}, [dispatch, fileAvatar, setProgress]);

	return (
		<>
			<RowContent>
				<Dropbox
					component="div"
					{...getRootProps()}
					isDragActive={isDragActive}
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<span>Drop the file here ...</span>
					) : (
						<span>Drop image here or click to upload</span>
					)}
				</Dropbox>
				<UploadButtonWrapper>
					<CustomButton {...getRootProps()} size="small" color="secondary">
						<input {...getInputProps()} />
						Upload image
					</CustomButton>
				</UploadButtonWrapper>
				<ProfileAvatarWrapper disabled={!uploadAvatarUrl}>
					<ProfileAvatar
						src={uploadAvatarUrl ?? user?.avatar}
						onClick={() => uploadAvatarUrl && dispatch(resetUploadAvatar())}
					/>
					<AnimatePresence>
						{uploadAvatarUrl && (
							<ProfileAvatarOverlay
								initial={{ y: "100%", transition: { duration: 0.2 } }}
								animate={{ y: "0", transition: { duration: 0.2 } }}
								exit={{ y: "100%", transition: { duration: 0.2 } }}
							>
								Click to remove
							</ProfileAvatarOverlay>
						)}
					</AnimatePresence>
				</ProfileAvatarWrapper>
			</RowContent>
			{!!fileAvatar[0]?.errors.length && (
				<UploadError>{fileAvatar[0].errors[0].message}</UploadError>
			)}
		</>
	);
};

export default UploadAvatarRowContent;

const RowContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 20px;

	@media ${({ theme }) => theme.breakpoints.sm} {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}
`;

const UploadButtonWrapper = styled.div`
	display: block;
	@media ${({ theme }) => theme.breakpoints.sm} {
		display: none;
	}
`;

const Dropbox = styled(ButtonBase)`
	display: none;

	@media ${({ theme }) => theme.breakpoints.sm} {
		position: relative;
		display: grid;
		place-items: center;
		width: 155px;
		height: 155px;
		background: ${({ theme }) => theme.colors.background.primary};
		border-radius: 3px;

		> span {
			text-align: center;
			color: ${({ theme }) => theme.colors.color.secondary};
			opacity: 0.8;
			font-size: 1.4rem;
			padding: 2rem;
		}

		&::after {
			content: "";
			position: absolute;
			inset: ${({ isDragActive }) => (isDragActive ? "7px" : "10px")};
			background: transparent;
			border: 2px dashed ${({ theme }) => theme.colors.color.secondary};
			opacity: ${({ isDragActive }) => (isDragActive ? "0.5" : "0.3")};
			transition: opacity 0.2s ease, inset 0.2s ease;
		}
	}
`;

const ProfileAvatarWrapper = styled(ButtonBase)`
	position: relative;
	overflow: hidden;

	> span {
		color: #000;
	}
`;

const ProfileAvatar = styled(Avatar)`
	border-radius: 3px;
	width: 155px;
	height: 155px;
	cursor: pointer;
	overflow: hidden;
`;

const ProfileAvatarOverlay = styled(motion.div)`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	display: grid;
	place-items: center;
	color: ${({ theme }) => theme.colors.color.primary};
	background: rgba(0, 0, 0, 0.65);
	border-radius: 3px 3px 0 0;
	height: 40px;
	font-size: 1.35rem;
	pointer-events: none;
`;
const UploadError = styled.div`
	display: inline-block;
	color: rgba(255, 0, 0, 0.75);
	font-size: 1.4rem;
	margin-top: -5px;
`;
