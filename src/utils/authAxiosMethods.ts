import axios, { AxiosResponse } from "axios";
import router from "next/router";

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

export const authFetcher = async (url: string) => {
	const request = () => axios.get(url, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authPoster = async (url: string, payload?: unknown) => {
	const request = () => axios.post(url, payload, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authPatcher = async (url: string, payload?: unknown) => {
	const request = () => axios.patch(url, payload, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};

export const authDeleter = async (url: string) => {
	const request = () => axios.delete(url, { withCredentials: true });
	const { data } = await handleRequest(request);

	return data;
};
