import { authFetcher } from "src/utils/authAxiosMethods";
import { fetcher } from "src/utils/fetcher";
import { useSWRInfinite } from "swr";

interface IProps {
	queryKey;
	authMethod?: boolean;
}

export const useInfiniteQuery = ({ queryKey, authMethod }: IProps) => {
	const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
		(index) => `${queryKey}&page=${index + 1}`,
		authMethod ? authFetcher : fetcher,
		{ revalidateAll: true }
	);

	const fetchNextPage = () => setSize((size) => size + 1);
	const fetchedData = data ? [].concat(...data) : [];
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === "undefined");
	const isEmpty = data?.[0]?.length === 0;
	const hasNextPage = isEmpty || (data && data[data.length - 1]?.length < 3);
	const isRefreshing = isValidating && data && data.length === size;

	return {
		fetchNextPage,
		fetchedData,
		size,
		setSize,
		error,
		isLoadingInitialData,
		isLoadingMore,
		isEmpty,
		hasNextPage,
		isRefreshing,
		mutate,
	};
};
