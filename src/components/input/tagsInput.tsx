import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import CancelIcon from "@material-ui/icons/Cancel";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";

interface IProps {
	tags: string[];
	setTags;
	placeholder?: string;
	flexibility?: boolean;
}

interface IformInputs {
	tag: string;
}

const yupSchema = yup.object({
	tag: yup.string().max(30).required("Please enter a tag "),
});

const TagsInput = ({ tags, setTags, placeholder, flexibility }: IProps) => {
	const methods = useForm<IformInputs>({ resolver: yupResolver(yupSchema) });
	const { register, handleSubmit } = methods;
	const inputRef = useRef(null!);

	const addTagHandler = useCallback(
		(data: IformInputs, e) => {
			const newTag = data.tag.trim();
			const isExists = tags.find((tag) => tag === newTag);

			isExists
				? setTags((prev) =>
						prev.map((tag) => (tag === isExists ? isExists : tag))
				  )
				: setTags((prev) => [...prev, newTag]);

			inputRef.current.value = "";
		},
		[tags, setTags]
	);

	const removeTagHandler = useCallback(
		(tag) => {
			setTags((prev) => prev.filter((tagEl) => tagEl !== tag));
		},
		[setTags]
	);

	return (
		<Container isFilledWithTags={tags.length >= 1} flexibility={flexibility}>
			<Tags flexibility={flexibility}>
				{tags.map((tag, i) => (
					<Tag key={`tag-${tag}-${i}`}>
						<motion.span>{tag}</motion.span>
						<RemoveTag onClick={() => removeTagHandler(tag)}>
							<CancelIcon className="tagsInputTagCancel__icon" />
						</RemoveTag>
					</Tag>
				))}
			</Tags>
			<input
				autoComplete="off"
				{...register("tag")}
				ref={inputRef}
				type="text"
				onKeyUp={(event) =>
					event.key === "Enter" && handleSubmit(addTagHandler)()
				}
				placeholder={placeholder ?? "Search by tags"}
			/>
		</Container>
	);
};

export default TagsInput;

const Container = styled(motion.div)`
	position: relative;
	display: ${({ flexibility }) => (flexibility ? "flex" : "grid")};
	align-items: center;
	flex-wrap: ${({ flexibility }) => flexibility && "wrap"};
	grid-template-columns: ${({ isFilledWithTags, flexibility }) =>
		!flexibility && isFilledWithTags ? "3fr 2fr" : "0 1fr"};
	width: 100%;
	height: 100%;
	color: inherit;
	background: transparent;
	transition: all 0.2s ease;

	&::-webkit-scrollbar {
		display: none;
	}

	> input {
		width: 100%;
		height: 100%;
		color: inherit;
		font-size: 1.45rem;
		background: transparent;
		flex: 1;
		padding: 0 0.4rem;
		min-height: 24px;
		min-width: 170px;
	}
`;

const Tags = styled(motion.ul)`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	height: 100%;
	gap: 5px;
	overflow-y: ${({ flexibility }) => !flexibility && "scroll"};
	padding: 0.4rem 0;

	&::-webkit-scrollbar {
		display: none;
	}
`;

const Tag = styled(motion.li)`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4px;
	padding: 0.5rem 0.3rem;
	font-size: 1.35rem;
	background: ${({ theme }) => theme.colors.button.primary};
	user-select: none;

	> span {
	}
`;

const RemoveTag = styled(motion.div)`
	display: grid;
	place-items: center;
	margin-left: 2px;
	cursor: pointer;

	.tagsInputTagCancel__icon {
		font-size: 1.4rem;
	}
`;
