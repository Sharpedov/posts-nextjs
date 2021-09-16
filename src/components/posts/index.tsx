import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Masonry from "react-masonry-css";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useInfiniteQuery } from "src/hooks/useInfiniteQuery";
import PostCard from "src/components/post/postCard";
import ScaleLoading from "src/components/loading/scaleLoading";
import Link from "next/link";
import { addMutatePosts } from "src/store/slices/postsSlice";

interface IProps {
	queryKeyWithLimit: string;
}

const sortByData = [
	{ value: "New", sort: "-createdAt" },
	{ value: "Top", sort: "+createdAt" },
];

const Posts = ({ queryKeyWithLimit }: IProps) => {
	const [sortBy, setSortBy] = useState(sortByData[0]);
	const dispatch = useDispatch();
	const {
		fetchNextPage,
		fetchedData,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		hasNextPage,
		error,
		mutate,
		setSize,
	} = useInfiniteQuery({
		queryKey: `${queryKeyWithLimit}&sort=${sortBy.sort}`,
	});
	const observer = useRef(null);

	useEffect(() => {
		mutate && dispatch(addMutatePosts(() => mutate()));
	}, [dispatch, mutate]);

	const lastItemRef = useCallback(
		(node) => {
			if (isLoadingMore || hasNextPage) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && !hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoadingMore, hasNextPage, fetchNextPage]
	);

	const changeSortOptionHandler = useCallback(
		(option) => {
			setSize(0);
			mutate();
			setSortBy(option);
		},
		[setSize, mutate]
	);

	const breakpointColumnsObj = {
		default: 4,
		1439: 3,
		900: 2,
		550: 1,
	};

	return (
		<>
			<Container>
				<SortBar>
					<SortByOptions>
						{sortByData.map((option) => (
							<SortByOption
								key={`${option.value}`}
								onClick={() => changeSortOptionHandler(option)}
								component="li"
								active={sortBy.value === option.value}
							>
								{option.value}
							</SortByOption>
						))}
					</SortByOptions>
				</SortBar>
				{error ? (
					<div>{error.message}</div>
				) : (
					<>
						{isLoadingInitialData ? (
							<ScaleLoading center marginTop={30} />
						) : (
							<Masonry
								breakpointCols={breakpointColumnsObj}
								className="my-masonry-grid"
								columnClassName="my-masonry-grid_column"
							>
								{fetchedData.map((post, i) => (
									<PostCard
										ref={lastItemRef}
										key={`post-${post._id}`}
										post={post}
									/>
								))}
							</Masonry>
						)}
						{!isLoadingInitialData && isLoadingMore && (
							<ScaleLoading center marginTop={30} />
						)}
						{isEmpty ? (
							<div
								style={{
									margin: "30px auto 0",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: "5px 0",
								}}
							>
								<span>Oops, it looks like there are no posts 😭</span>
								<Link href="/home" passHref>
									<a>Back to home</a>
								</Link>
							</div>
						) : (
							hasNextPage && (
								<div style={{ margin: "30px auto 0" }}>No more posts </div>
							)
						)}
					</>
				)}
			</Container>
		</>
	);
};

export default Posts;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
`;

const SortBar = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 10px;
`;

const SortByOptions = styled.ul`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	flex-grow: 1;

	@media ${({ theme }) => theme.breakpoints.sm} {
		grid-template-columns: repeat(2, auto);
		justify-content: space-evenly;
	}
	@media ${({ theme }) => theme.breakpoints.md} {
		flex-grow: 0;
		justify-content: normal;
	}
`;

const SortByOption = styled(Button)`
	color: ${({ theme, active }) =>
		active ? theme.colors.button.primary : theme.colors.color.primary};
	padding: 1rem 2rem;
	cursor: pointer;
	border-radius: 0;
	text-transform: none;
	font-size: 16px;
	pointer-events: ${({ active }) => active && "none"};

	&:disabled {
		opacity: 0.5;
		color: ${({ theme, active }) =>
			active ? theme.colors.button.primary : theme.colors.color.primary};
	}

	&:after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: ${({ theme }) => theme.colors.button.primary};
		opacity: ${({ active }) => (active ? `1` : "0")};
	}

	> span {
		font-weight: 500;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.1);
	}
`;
