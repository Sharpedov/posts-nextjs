import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import CustomButton from "src/components/customButton";
import FormInput from "src/components/input/controllerInput";
import styled from "styled-components";
import {
	useForm,
	SubmitHandler,
	FormProvider,
	Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { login } from "src/store/slices/authSlice";
import Link from "next/link";

interface IProps {}

interface IFormInputs {
	email: string;
	password: string;
}

const yupSchema = yup.object().shape({
	email: yup
		.string()
		.email("Must be a valid email")
		.required("Email is required"),
	password: yup
		.string()
		.min(4, "Password must be at least 4 characters")
		.max(16, "Password must be at most 16 characters")
		.required("Password is required"),
});

const mapState = (state) => ({
	loginLoading: state.auth.login.loading,
});

const LoginForm = ({}: IProps) => {
	const { loginLoading } = useSelector(mapState);
	const methods = useForm<IFormInputs>({ resolver: yupResolver(yupSchema) });
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = methods;
	const dispatch = useDispatch();

	const onSubmitHandler: SubmitHandler<IFormInputs> = (data: IFormInputs) => {
		const { email, password } = data;

		dispatch(login({ email: email.toLowerCase(), password }));
	};

	return (
		<FormProvider {...methods}>
			<AnimateSharedLayout>
				<Form
					layout
					onSubmit={handleSubmit(onSubmitHandler)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<Title layout>Sign in</Title>
					<AnimatePresence>
						{Object.keys(errors).length !== 0 && (
							<ErrorsList
								layout
								initial={{ scale: 0.93, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.92, opacity: 0 }}
							>
								{Object.entries(errors).map(([key, value]) => (
									<ErrorItem layout key={key}>
										{value.message}
									</ErrorItem>
								))}
							</ErrorsList>
						)}
					</AnimatePresence>
					<Controller
						name="email"
						control={control}
						render={({ field }) => (
							<FormInput
								field={field}
								label="Email"
								error={errors.email && errors.email.message}
								disableErrorMsg={true}
							/>
						)}
					/>
					<Controller
						name="password"
						control={control}
						render={({ field }) => (
							<FormInput
								field={field}
								label="Password"
								type="password"
								error={errors.password && errors.password.message}
								disableErrorMsg={true}
							/>
						)}
					/>

					<motion.div layout style={{ width: "100%" }}>
						<CustomButton
							type="submit"
							color="primary"
							loading={loginLoading}
							disabled={loginLoading}
							fullWidth
						>
							Sign in
						</CustomButton>
					</motion.div>
					<BottomText layout>
						You haven&apos;t been here yet?{" "}
						<Link passHref href="/createAccount">
							<span tabIndex={0}>
								<a>Create account!</a>
							</span>
						</Link>
					</BottomText>
				</Form>
			</AnimateSharedLayout>
		</FormProvider>
	);
};

export default LoginForm;

const Form = styled(motion.form)`
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 25px 0;
	width: 100%;
`;

const Title = styled(motion.div)`
	font-size: 2.8rem;
	font-weight: 700;
	letter-spacing: 1px;
	font-family: ${({ theme }) => theme.fonts.title};
	text-align: center;

	@media ${({ theme }) => theme.breakpoints.sm} {
		font-size: 3.1rem;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		font-size: 3.4rem;
	}
	@media ${({ theme }) => theme.breakpoints.lg} {
		font-size: 3.8rem;
	}
`;

const ErrorsList = styled(motion.ul)`
	display: flex;
	flex-direction: column;
	gap: 5px 0;
	background: rgba(0, 0, 0, 0.44);
	border-radius: 3px;
	padding: 1rem;
`;

const ErrorItem = styled(motion.li)`
	font-size: 1.5rem;
`;

const BottomText = styled(motion.div)`
	font-size: 1.5rem;
	text-align: center;

	> span {
		text-decoration: underline;
		cursor: pointer;
		transition: opacity 0.15s ease;

		&:hover,
		&:focus {
			opacity: 0.85;
		}
	}
`;
