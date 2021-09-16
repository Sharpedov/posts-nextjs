import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { DisableScrollbar } from "src/utils/disableScrollbar";
import { useAuth } from "../authProvider";
import ScaleLoading from "../loading/scaleLoading";

interface IProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	shoundBeCloseOutside?: boolean;
	scroll?: boolean;
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

const Modal = ({
	children,
	isOpen,
	onClose,
	shoundBeCloseOutside,
	scroll,
}: IProps) => {
	const { loading } = useAuth();
	const backdropRef = useRef<HTMLElement>(null);
	DisableScrollbar(isOpen);

	const closeHandler = useCallback(
		(e: Event) => e.target === backdropRef.current && onClose(),
		[onClose]
	);

	const escapeListener = useCallback(
		(e: KeyboardEvent) => e.key === "Escape" && onClose(),
		[onClose]
	);

	useEffect(() => {
		if (backdropRef.current) {
			document.addEventListener("keydown", escapeListener);

			return () => document.removeEventListener("keydown", escapeListener);
		}
	}, [escapeListener]);

	return (
		typeof window !== "undefined" &&
		createPortal(
			<AnimatePresence exitBeforeEnter>
				{isOpen && (
					<Backdrop
						scroll={scroll}
						ref={backdropRef}
						onClick={shoundBeCloseOutside && closeHandler}
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						{loading ? (
							<ScaleLoading center marginTop={30} />
						) : (
							<ContentContainer variants={contentVariants}>
								{children}
							</ContentContainer>
						)}
					</Backdrop>
				)}
			</AnimatePresence>,
			document.getElementById("modal")
		)
	);
};

export default Modal;

const Backdrop = styled(motion.div)`
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.72);
	z-index: 900;
	overflow-y: ${({ scroll }) => scroll && "scroll"};

	&::-webkit-scrollbar {
		display: none;
	}
`;

const ContentContainer = styled(motion.div)`
	position: relative;
`;
