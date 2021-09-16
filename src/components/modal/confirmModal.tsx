import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { DisableScrollbar } from "src/utils/disableScrollbar";
import { useAuth } from "../authProvider";
import ScaleLoading from "../loading/scaleLoading";
import CustomButton from "../customButton";
import LinearLoading from "../loading/linearLoading";
import FocusTrap from "focus-trap-react";

interface IProps {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	message?: string;
	buttonText: string;
	onClickButton;
	loading?: boolean;
}

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};
const contentVariants = {
	hidden: { scale: 1.07, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { delay: 0.1 },
	},
};

const ConfirmModal = ({
	children,
	isOpen,
	onClose,
	message,
	buttonText,
	onClickButton,
	loading,
}: IProps) => {
	const { loading: authLoading } = useAuth();
	const backdropRef = useRef<HTMLElement>(null!);
	DisableScrollbar(isOpen);

	useEffect(() => {
		const { current } = backdropRef;

		if (current) {
			const escapeListener = (e: KeyboardEvent) =>
				e.key === "Escape" && onClose();

			document.addEventListener("keydown", escapeListener);

			return () => document.removeEventListener("keydown", escapeListener);
		}
	}, [onClose]);

	useEffect(() => {
		const { current } = backdropRef;

		if (current) {
			const keyPressListener = (e) => {
				e.keyCode === 13 && onClickButton();
			};

			document.addEventListener("keypress", keyPressListener);

			return () => document.removeEventListener("keypress", keyPressListener);
		}
	}, [onClickButton]);

	return (
		typeof window !== "undefined" &&
		createPortal(
			<AnimatePresence exitBeforeEnter>
				{isOpen && (
					<Backdrop
						ref={backdropRef}
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						{authLoading ? (
							<ScaleLoading center marginTop={30} />
						) : (
							<FocusTrap>
								<ContentContainer variants={contentVariants}>
									{loading && <LinearLoading />}
									{message ? (
										<Message>{message}</Message>
									) : (
										<Content>{children}</Content>
									)}

									<Actions>
										<CustomButton color="red" size="small" onClick={onClose}>
											Close
										</CustomButton>
										<CustomButton
											size="small"
											onClick={onClickButton}
											loading={loading}
										>
											{buttonText}
										</CustomButton>
									</Actions>
								</ContentContainer>
							</FocusTrap>
						)}
					</Backdrop>
				)}
			</AnimatePresence>,
			document.getElementById("modal")
		)
	);
};

export default ConfirmModal;

const Backdrop = styled(motion.div)`
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.72);
	z-index: 900;
	overflow-y: scroll;
	padding: 3rem 0;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const ContentContainer = styled(motion.div)`
	position: relative;
	box-shadow: ${({ theme }) => theme.boxShadow.primary};
	max-width: 400px;

	width: 92vw;
	background: ${({ theme }) => theme.colors.background.secondary};
	border-radius: 3px;
`;

const Content = styled.div`
	padding: 2rem;
`;

const Message = styled.div`
	font-size: 1.5rem;
	opacity: 0.9;
	padding: 2rem;
	text-align: center;
`;

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1px solid rgba(255, 255, 255, 0.13);
	padding: 1.5rem 2rem;
`;
