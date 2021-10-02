import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useUser } from "src/components/userProvider";
import CustomButton from "src/components/customButton";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
	resetUploadAvatar,
	resetUploadBanner,
} from "src/store/slices/uploadFilesSlice";
import LinearLoading from "src/components/loading/linearLoading";
import { updateProfile } from "src/store/slices/authSlice";
import ScaleLoading from "src/components/loading/scaleLoading";
import UploadAvatarRowContent from "./uploadAvatarRowContent";
import UploadBannerRowContent from "./uploadBannerRowContent";
import { setTheme } from "src/store/slices/themeSlice";

interface IProps {}

const mapState = (state) => ({
	uploadAvatarUrl: state.uploadFiles.avatar.url,
	uploadBannerUrl: state.uploadFiles.banner.url,
	updateProfileLoading: state.auth.update.profile.loading,
	uploadAvatarLoading: state.uploadFiles.avatar.loading,
	uploadBannerLoading: state.uploadFiles.banner.loading,
	theme: state.theme.theme,
});

const ProfileSettings = ({}: IProps) => {
	const { user, loading, isLogged } = useUser();
	const {
		uploadAvatarUrl,
		uploadBannerUrl,
		updateProfileLoading,
		uploadAvatarLoading,
		uploadBannerLoading,
		theme,
	} = useSelector(mapState);
	const dispatch = useDispatch();
	const [descriptionValue, setDescriptionValue] = useState<string>("");
	const [progressAvatar, setProgressAvatar] = useState<number>(0);
	const [progressBanner, setProgressBanner] = useState<number>(0);

	useEffect(() => {
		progressAvatar === 100 && setProgressAvatar(0);
		progressBanner === 100 && setProgressBanner(0);
	}, [progressAvatar, progressBanner]);

	useEffect(() => {
		dispatch(resetUploadAvatar());
	}, [dispatch]);

	const updateProfileHandler = useCallback(() => {
		isLogged &&
			dispatch(
				updateProfile({
					avatar: uploadAvatarUrl ?? user.avatar,
					banner: uploadBannerUrl ?? user.banner,
					description: descriptionValue.trim(),
					onComplete: () => {
						dispatch(resetUploadAvatar());
						dispatch(resetUploadBanner());
					},
				})
			);
	}, [
		dispatch,
		uploadAvatarUrl,
		uploadBannerUrl,
		descriptionValue,
		user,
		isLogged,
	]);

	useEffect(() => {
		isLogged && setDescriptionValue(user.description);
	}, [user, isLogged]);

	const disabledButtonSaveHandler = useMemo(() => {
		if (isLogged) {
			if (
				(!!uploadAvatarUrl ||
					!!uploadBannerUrl ||
					updateProfileLoading ||
					user.description !== descriptionValue.trim()) ??
				!!descriptionValue
			)
				return false;
		}

		return true;
	}, [
		uploadAvatarUrl,
		updateProfileLoading,
		descriptionValue,
		user,
		uploadBannerUrl,
		isLogged,
	]);

	return (
		<>
			{(!!progressAvatar || !!progressBanner || updateProfileLoading) && (
				<LinearLoading progress={progressAvatar || progressBanner} />
			)}
			{loading ? (
				<ScaleLoading center marginTop={35} />
			) : (
				<Container
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<CustomButton
						style={{ position: "absolute", top: "10px", right: "15px" }}
						size="small"
						disabled={disabledButtonSaveHandler}
						loading={
							updateProfileLoading || uploadAvatarLoading || uploadBannerLoading
						}
						onClick={updateProfileHandler}
					>
						Save
					</CustomButton>
					<Row>
						<h2>Site Theme</h2>
						<SiteThemesList>
							<SiteTheme
								className={theme === "darkGray" && "selected"}
								colorTheme="#121212"
								onClick={() => dispatch(setTheme({ theme: "darkGray" }))}
							/>
							<SiteTheme
								className={theme === "navyBlue" && "selected"}
								colorTheme="#0B1622"
								onClick={() => dispatch(setTheme({ theme: "navyBlue" }))}
							/>
							<SiteTheme
								className={theme === "dark" && "selected"}
								colorTheme="#000"
								onClick={() => dispatch(setTheme({ theme: "dark" }))}
							/>
						</SiteThemesList>
					</Row>
					<Row>
						<h2>Description</h2>
						<DescriptionTextarea
							value={descriptionValue}
							onChange={(e) => setDescriptionValue(e.target.value)}
						/>
					</Row>
					<Row>
						<h2>Avatar</h2>
						<span>Allowed Formats: JPEG, PNG. Max size: 3mb.</span>
						<UploadAvatarRowContent setProgress={setProgressAvatar} />
					</Row>

					<Row>
						<h2>Banner</h2>
						<span>Allowed Formats: JPEG, PNG. Max size: 6mb.</span>
						<UploadBannerRowContent setProgress={setProgressBanner} />
					</Row>
				</Container>
			)}
		</>
	);
};

export default ProfileSettings;

const Container = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: 15px 0;
	margin-top: 25px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px 0;
	margin-bottom: 15px;

	> h2 {
		color: ${({ theme }) => theme.colors.color.secondary};
		opacity: 0.95;
		font-size: 1.4rem;
		font-weight: 600;
		font-family: ${({ theme }) => theme.fonts.main};
	}
	> span {
		color: ${({ theme }) => theme.colors.color.secondary};
		font-size: 1.3rem;
		opacity: 0.75;
		margin-top: -10px;
	}
`;

const SiteThemesList = styled.ul`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const SiteTheme = styled.li`
	position: relative;
	border-radius: 3px;
	height: 40px;
	width: 40px;
	background: ${({ colorTheme }) => colorTheme};
	cursor: pointer;

	&.selected {
		&::after {
			content: "";
			position: absolute;
			inset: 0;
			background: transparent;
			border: 2px solid ${({ theme }) => theme.colors.button.primary};
			border-radius: 3px;
		}
	}
`;

const DescriptionTextarea = styled.textarea`
	background: ${({ theme }) => theme.colors.background.primary};
	border-radius: 3px;
	color: ${({ theme }) => theme.colors.color.secondary};
	font-weight: 300;
	min-height: 51px;
	max-height: 120px;
	height: 72px;
	padding: 1.5rem;
	resize: vertical;
	line-height: 1.5;
	font-size: 1.4rem;

	&::-webkit-scrollbar {
		display: none;
	}
`;
