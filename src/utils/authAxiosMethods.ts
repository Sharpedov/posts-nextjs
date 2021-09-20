import axios, { AxiosResponse } from "axios";

export type QueryResponse<T> = [data: T | null];

const refreshTokens = async () =>
	await axios.post("/api/auth/refresh", undefined, { withCredentials: true });

const handleRequest = async (
	request: () => Promise<AxiosResponse>
): Promise<AxiosResponse> => {
	try {
		return await request();
	} catch (error) {
		if (error?.response?.status === 401) {
			await refreshTokens();
			return await request();
		}

		throw error;
	}
};

export const authFetcher = async <T>(
	url: string
): Promise<QueryResponse<T>> => {
	const request = () => axios.get(url, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authPoster = async <T>(
	url: string,
	payload?: unknown
): Promise<QueryResponse<T>> => {
	const request = () => axios.post(url, payload, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authPatcher = async <T>(
	url: string,
	payload?: unknown
): Promise<QueryResponse<T>> => {
	const request = () => axios.patch(url, payload, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authDeleter = async <T>(
	url: string
): Promise<QueryResponse<T>> => {
	const request = () => axios.delete(url, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};
