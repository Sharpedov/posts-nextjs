import { motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import CustomIconButton from "../customIconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

interface IProps {
	type?: string;
	label: string;
	disable?;
	value: string;
	onChange;
	color?: "primary" | "secondary";
}

const DefaultInput = ({
	type,
	label,
	disable,
	value,
	onChange,
	color,
}: IProps) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<>
			<Container layout disable={disable} color={color}>
				<Input
					color={color}
					layout
					onChange={onChange}
					value={value}
					type={showPassword ? "text" : type}
					isPasswordType={type === "password"}
					disable={disable}
				/>
				<Label isFilled={value} disable={disable} color={color}>
					<span>{label}</span>
				</Label>
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

export default DefaultInput;

const Container = styled(motion.div)`
	position: relative;
	background: ${({ theme, disable, color }) =>
		disable
			? "rgba(0,0,0,0.12)"
			: color === "secondary"
			? theme.colors.background.primary
			: theme.colors.button.white};
	border-radius: 3px;
	font-size: 1.6rem;
	pointer-events: ${({ disable }) => disable && "none"};
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
	font-size: 1.45rem;

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
	color: ${({ disable }) => disable && "rgba(255,255,255,.65)"};

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
