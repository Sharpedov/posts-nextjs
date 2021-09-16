import { Button } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

interface IProps {
	isOpen: boolean;
	options;
	onClose: () => void;
	onChange;
	direction?: "topleft" | "topright" | "topmid";
}

const selectTopRightVariants = {
	hidden: {
		opacity: 0,
		scale: 0.84,
		originX: 1,
		originY: 0.1,
		transition: { duration: 0.2 },
	},
	visible: {
		opacity: 1,
		scale: 1,
		originX: 1,
		originY: 0.1,
		transition: { duration: 0.15 },
	},
	exit: {
		opacity: 0,
		scale: 0.72,
		transition: { duration: 0.2 },
	},
};
const selectTopLeftVariants = {
	hidden: {
		opacity: 0,
		scale: 0.84,
		originX: 0.1,
		originY: 0.1,
		transition: { duration: 0.2 },
	},
	visible: {
		opacity: 1,
		scale: 1,
		originX: 0.1,
		originY: 0.1,
		transition: { duration: 0.15 },
	},
	exit: {
		opacity: 0,
		scale: 0.72,
		transition: { duration: 0.2 },
	},
};
const selectTopMidVariants = {
	hidden: {
		opacity: 0,
		scale: 0.84,
		originX: 0.5,
		originY: 0.5,
		transition: { duration: 0.2 },
	},
	visible: {
		opacity: 1,
		scale: 1,
		originX: 0.5,
		originY: 0.5,
		transition: { duration: 0.15 },
	},
	exit: {
		opacity: 0,
		scale: 0.72,
		transition: { duration: 0.2 },
	},
};

const SelectMenu = ({
	isOpen,
	options,
	onClose,
	onChange,
	direction,
}: IProps) => {
	const selectRef = useRef(null);

	const escapeListener = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		const pageClickEvent = (e) => {
			if (selectRef.current !== null && !selectRef.current.contains(e.target)) {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener("click", pageClickEvent);
			document.addEventListener("keydown", escapeListener);
		}

		return () => {
			window.removeEventListener("click", pageClickEvent);
			document.addEventListener("keydown", escapeListener);
		};
	}, [isOpen, selectRef, escapeListener, onClose]);

	const filterDirectionVariants = useMemo(() => {
		switch (direction) {
			case "topleft": {
				return selectTopLeftVariants;
			}
			case "topmid": {
				return selectTopMidVariants;
			}
			case "topright": {
				return selectTopRightVariants;
			}
			default:
				return selectTopRightVariants;
		}
	}, [direction]);

	return (
		<AnimatePresence exitBeforeEnter>
			{isOpen && (
				<Select
					ref={selectRef}
					variants={filterDirectionVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					{options.map((option, i) => (
						<Option
							component={motion.li}
							key={`${i}-${option.title}`}
							onClick={() => onChange(option)}
						>
							{option.title}
						</Option>
					))}
				</Select>
			)}
		</AnimatePresence>
	);
};

export default SelectMenu;

const Select = styled(motion.ul)`
	position: absolute;
	top: 75%;
	right: 0;
	display: flex;
	flex-direction: column;
	padding: 1rem 0;
	width: clamp(115px, 100%, 150px);
	background: ${({ theme }) => theme.colors.background.primary};
	border-radius: 3px;
	z-index: 100;
	box-shadow: ${({ theme }) => theme.boxShadow.primary};
`;

const Option = styled(Button)`
	border-radius: 0;
	height: 39px;
	text-transform: none;
	font-size: 1.3rem;
	transition: background 0.1s ease;

	> span {
		color: #fff;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.1);
	}
`;
