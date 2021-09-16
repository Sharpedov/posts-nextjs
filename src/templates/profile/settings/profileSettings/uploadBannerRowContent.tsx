import { ButtonBase } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { FileError, useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "src/components/authProvider";
import CustomButton from "src/components/customButton";
import {
	resetUploadBanner,
	uploadFileBanner,
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
	uploadBannerUrl: state.uploadFiles.banner.url,
});

const UploadBannerRowContent = ({ setProgress }: IProps) => {
	const { user } = useAuth();
	const { uploadBannerUrl } = useSelector(mapState);
	const [fileBanner, setFileBanner] = useState<IUploadedFile[]>([]);
	const onDrop = useCallback((acceptedFiles: File[], rejFiles) => {
		const mappedAcc = acceptedFiles.map((file) => ({ file, errors: [] }));
		setFileBanner([...mappedAcc, ...rejFiles]);
	}, []);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		accept: "image/jpeg, image/png",
		maxSize: 6 * 1024 * 1024,
	});
	const dispatch = useDispatch();

	useEffect(() => {
		{
			!fileBanner[0]?.errors.length &&
				fileBanner.length === 1 &&
				dispatch(
					uploadFileBanner({
						file: fileBanner[0].file,
						setProgress,
					})
				);
		}
	}, [dispatch, fileBanner, setProgress]);

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
				<ProfileBannerWrapper
					component="div"
					banner={uploadBannerUrl ?? user?.banner}
					disabled={!uploadBannerUrl}
					onClick={() => uploadBannerUrl && dispatch(resetUploadBanner())}
				>
					<AnimatePresence>
						{uploadBannerUrl && (
							<ProfileBannerOverlay
								initial={{ y: "100%", transition: { duration: 0.2 } }}
								animate={{ y: "0", transition: { duration: 0.2 } }}
								exit={{ y: "100%", transition: { duration: 0.2 } }}
							>
								Click to remove
							</ProfileBannerOverlay>
						)}
					</AnimatePresence>
				</ProfileBannerWrapper>
			</RowContent>
			{!!fileBanner[0]?.errors.length && (
				<UploadError>{fileBanner[0].errors[0].message}</UploadError>
			)}
		</>
	);
};

export default UploadBannerRowContent;

const RowContent = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 20px;

	@media ${({ theme }) => theme.breakpoints.sm} {
		grid-template-columns: 155px 1fr;
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

const ProfileBannerWrapper = styled.div`
	position: relative;
	height: 155px;
	background-image: ${({ banner }) => `url(${banner})`};
	background-color: #242538;
	background-position: 50% 35%;
	background-repeat: no-repeat;
	background-size: cover;
	border-radius: 3px;
	overflow: hidden;

	> span {
		color: #000;
	}
`;

const ProfileBannerOverlay = styled(motion.div)`
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
