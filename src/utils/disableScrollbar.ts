import { useEffect } from "react";

export const DisableScrollbar = (isOpen) => {
	useEffect(() => {
		if (isOpen) {
			if (
				window.innerWidth <= 600 ||
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				)
			) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.paddingRight = "17px";
				document.body.style.overflow = "hidden";
			}

			return () => {
				document.body.style.paddingRight = "0px";
				document.body.style.overflow = "auto";
			};
		}
	}, [isOpen]);
};
