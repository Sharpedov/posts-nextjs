import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import CustomIconButton from "../customIconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

interface IProps {
	type?: string;
	label?: string;
	field: {
		name;
		onChange;
		onBlur;
		ref;
		value;
	};
	error?: string;
	disable?;
	color?: "primary" | "secondary";
	disableErrorMsg?: boolean;
}

const ControllerInput = ({
	type,
	label,
	field,
	error,
	disable,
	color,
	disableErrorMsg,
}: IProps) => {
	const { name, onChange, onBlur, ref, value } = field;
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<>
			<Container layout disable={disable} color={color}>
				<Input
					color={color}
					layout
					name={name}
					onChange={onChange}
					onBlur={onBlur}
					ref={ref}
					value={value}
					type={showPassword ? "text" : type}
					isPasswordType={type === "password"}
					disable={disable}
				/>
				<Label isFilled={value} error={error} disable={disable} color={color}>
					<span>{label}</span>
				</Label>
				<AnimatePresence>
					{!disableErrorMsg && error && (
						<ErrorText
							initial={{ y: "125%", scale: 0.85, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.97, opacity: 0 }}
						>
							{error}
						</ErrorText>
					)}
				</AnimatePresence>
				{type === "password" && (
					<ShowPasswordBtn>
						<CustomIconButton
							disableFocus
							onClick={() => setShowPassword((prev) => !prev)}
							ariaLabel="Show password"
							Icon={showPassword ? VisibilityOffIcon : VisibilityIcon}
							size="small"
							color={color === "primary" ? "black" : "white"}
						/>
					</ShowPasswordBtn>
				)}
			</Container>
		</>
	);
};

export default ControllerInput;

const Container = styled(motion.div)`
	position: relative;
	background: ${({ theme, color }) =>
		color === "secondary"
			? theme.colors.background.primary
			: theme.colors.button.white};
	opacity: ${({ disable }) => (disable ? "0.6" : 1)};

	border-radius: 3px;
	font-size: 1.6rem;
	pointer-events: ${({ disable }) => disable && "none"};
	transition: background 0.15s ease, opacity 0.15s ease;
`;

const ErrorText = styled(motion.p)`
	position: absolute;
	right: 0;
	bottom: 0;
	color: rgba(255, 0, 0, 0.95);
	font-size: 1.25rem;
	font-weight: 600;
	border-radius: 3px;
	line-height: 1;
	text-align: right;
`;

const Label = styled(motion.label)`
	position: absolute;
	inset: 0;
	pointer-events: none;
	color: ${({ error, color }) =>
		error
			? "rgba(255, 0, 0, 0.6)"
			: color === "secondary"
			? "rgba(255,255,255,0.88)"
			: "rgba(0,0,0,0.88)"};
	font-size: 1.5rem;

	> span {
		position: absolute;
		top: 50%;
		left: 1rem;
		transform: ${({ isFilled }) =>
			isFilled ? "translateY(-100%) scale(0.8)" : "translateY(-50%) scale(1)"};
		transform-origin: left;
		transition: transform 0.2s cubic-bezier(0.33, 1, 0.68, 1);
	}
`;

const Input = styled(motion.input)`
	background: transparent;
	padding: 1.5rem 1.5rem 0.5rem 1rem;
	width: 100%;
	font-size: 1.45rem;
	line-height: 1;
	color: ${({ theme, color }) =>
		color === "secondary" ? theme.colors.color.secondary : "#000"};

	&:focus + ${Label} {
		> span {
			transform: translateY(-100%) scale(0.8);
		}
	}
`;

const ShowPasswordBtn = styled.div`
	position: absolute;
	top: 50%;
	right: 0;
	transform: translate(-10px, -50%);
`;
