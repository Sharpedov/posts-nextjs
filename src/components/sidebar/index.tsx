import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { DisableScrollbar } from "src/utils/disableScrollbar";

interface IProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
}

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};
const sidebarVariants = {
	hidden: { x: "-100%", transition: { bounce: 0, duration: 0.25 } },
	visible: {
		x: "0%",
		transition: { bounce: 0, duration: 0.25 },
	},
};

const Sidebar = ({ children, isOpen, onClose }: IProps) => {
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
		<AnimatePresence>
			{isOpen && (
				<>
					<Backdrop
						ref={backdropRef}
						onClick={closeHandler}
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					/>

					<SidebarContainer
						variants={sidebarVariants}
						initial="hidden"
						animate="visible"
						exit="hidden"
					>
						{children}
					</SidebarContainer>
				</>
			)}
		</AnimatePresence>
	);
};

export default Sidebar;

const Backdrop = styled(motion.div)`
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.72);
	z-index: 800;
	overflow-y: scroll;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const SidebarContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	max-width: 300px;
	width: 100%;
	box-shadow: ${({ theme }) => theme.boxShadow.primary};
	background: ${({ theme }) => theme.colors.background.primary};
	z-index: 800;
	border-radius: 0 9px 9px 0;
	padding-top: 44px;

	&::-webkit-scrollbar {
		display: none;
	}

	@media ${({ theme }) => theme.breakpoints.lg} {
		padding-top: 54px;
	}
`;
