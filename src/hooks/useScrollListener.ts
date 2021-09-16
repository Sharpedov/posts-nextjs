import { useEffect, useState } from "react";

export const useScrollListener = () => {
	const [data, setData] = useState({
		x: 0,
		y: 0,
		lastX: 0,
		lastY: 0,
	});

	useEffect(() => {
		const scrollHandler = () => {
			setData((prev) => {
				return {
					x: window.scrollX,
					y: window.scrollY,
					lastX: prev.x,
					lastY: prev.y,
				};
			});
		};

		scrollHandler();

		window.addEventListener("scroll", scrollHandler);

		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, []);

	return data;
};
