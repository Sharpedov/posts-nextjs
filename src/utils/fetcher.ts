import axios from "axios";

export const fetcher = (url: string, params?) => {
	return axios.get(url, params).then((res) => res.data);
};
