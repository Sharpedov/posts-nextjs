import React, { useCallback, useState } from "react";
import CustomButton from "src/components/customButton";
import styled from "styled-components";
import {
	Controller,
	FormProvider,
	SubmitHandler,
	useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "src/components/modal/confirmModal";
import { useUser } from "src/components/userProvider";
import ControllerInput from "src/components/input/controllerInput";
import DefaultInput from "src/components/input/defaultInput";
import { updateAccount } from "src/store/slices/authSlice";
import { motion } from "framer-motion";
import ScaleLoading from "src/components/loading/scaleLoading";

interface IProps {}

interface IFormInputs {
	username: string;
	email: string;
	newPassword: string;
	confirmNewPassword: string;
}

const yupSchema = yup.object().shape({
	username: yup
		.string()
		.min(3, "Username must be at least 3 characters")
		.max(16, "Username must be at least 16 characters")
		.required("Username is required"),
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	newPassword: yup
		.string()
		.min(4, "Password must be at least 4 characters")
		.max(16, "Password must be at most 16 characters"),
	confirmNewPassword: yup
		.string()
		.oneOf(
			[yup.ref("newPassword"), null],
			"Confirm new Password does not match"
		),
});

const mapState = (state) => ({
	updateAccountLoading: state.auth.update.account.loading,
});

const AccountSettings = ({}: IProps) => {
	const { user, loading, isLogged, loggedOut } = useUser();
	const { updateAccountLoading } = useSelector(mapState);
	const methods = useForm<IFormInputs>({ resolver: yupResolver(yupSchema) });
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = methods;
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [changeDataModalIsOpen, setChangeDataModalIsOpen] =
		useState<boolean>(false);
	const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");
	const [formData, setFormData] = useState(null);
	const dispatch = useDispatch();

	const onSubmit: SubmitHandler<IFormInputs> = (data: IFormInputs) => {
		setChangeDataModalIsOpen(true);
		setFormData(data);
	};

	const editUserHandler = useCallback(() => {
		if (!!formData && isLogged) {
			const { username, email, newPassword } = formData;

			dispatch(
				updateAccount({
					avatar: null,
					username: username,
					newEmail: email,
					password: confirmPasswordValue,
					newPassword,
					onComplete: () => {
						setFormData(null);
						setConfirmPasswordValue(null);
						setChangeDataModalIsOpen(false);
						setIsEdit(false);
					},
				})
			);
		}
	}, [dispatch, formData, confirmPasswordValue, isLogged]);

	return (
		<>
			<ConfirmModal
				isOpen={changeDataModalIsOpen}
				onClose={() => {
					setChangeDataModalIsOpen(false), setConfirmPasswordValue("");
					setFormData(null);
				}}
				onClickButton={editUserHandler}
				buttonText="Save"
				loading={updateAccountLoading}
			>
				<DefaultInput
					color="primary"
					type="password"
					label="Password"
					value={confirmPasswordValue}
					onChange={(e) => setConfirmPasswordValue(e.target.value)}
				/>
			</ConfirmModal>
			{loading ? (
				<ScaleLoading center marginTop={35} />
			) : (
				<FormProvider {...methods}>
					<Form
						onSubmit={handleSubmit(onSubmit)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{isEdit ? (
							<div style={{ position: "absolute", top: "10px", right: "15px" }}>
								<CustomButton
									size="small"
									style={{ marginRight: "15px" }}
									color="red"
									onClick={() => setIsEdit(false)}
								>
									Close
								</CustomButton>
								<CustomButton size="small" type="submit">
									Save
								</CustomButton>
							</div>
						) : (
							<CustomButton
								style={{ position: "absolute", top: "10px", right: "15px" }}
								size="small"
								color="secondary"
								onClick={() => {
									setIsEdit(true);
								}}
							>
								Enable edit mode
							</CustomButton>
						)}

						<Row>
							<h2>Username</h2>
							<Controller
								name="username"
								control={control}
								defaultValue={user?.username}
								render={({ field }) => (
									<ControllerInput
										color="secondary"
										disable={!isEdit}
										field={field}
										label="Username"
										error={errors.username && errors.username.message}
									/>
								)}
							/>
						</Row>
						<Row>
							<h2>Email</h2>
							<Controller
								name="email"
								control={control}
								defaultValue={user?.email}
								render={({ field }) => (
									<ControllerInput
										color="secondary"
										disable={!isEdit}
										field={field}
										label="Email"
										error={errors.email && errors.email.message}
									/>
								)}
							/>
						</Row>
						<Row>
							<h2>Change Password</h2>
							<Controller
								name="newPassword"
								control={control}
								render={({ field }) => (
									<ControllerInput
										color="secondary"
										disable={!isEdit}
										field={field}
										label="New password"
										type="password"
										error={errors.newPassword && errors.newPassword.message}
									/>
								)}
							/>
							<Controller
								name="confirmNewPassword"
								control={control}
								render={({ field }) => (
									<ControllerInput
										type="password"
										color="secondary"
										disable={!isEdit}
										field={field}
										label="Confirm new password"
										error={
											errors.confirmNewPassword &&
											errors.confirmNewPassword.message
										}
									/>
								)}
							/>
						</Row>
					</Form>
				</FormProvider>
			)}
		</>
	);
};

export default AccountSettings;

const Form = styled(motion.form)`
	display: flex;
	flex-direction: column;
	gap: 20px 0;
	margin-top: 25px;
`;

const Row = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px 0;

	> h2 {
		color: ${({ theme }) => theme.colors.color.secondary};
		opacity: 0.95;
		font-size: 1.4rem;
		font-weight: 600;
		font-family: ${({ theme }) => theme.fonts.main};
	}
`;
