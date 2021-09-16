import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

export const linksListData = {
	desktop: [
		{ title: "Home", href: "/home", icon: HomeIcon },
		{ title: "Contact", href: "/contact", icon: ContactSupportIcon },
		{ title: "Profile", href: "/profile", icon: PersonIcon },
	],
	mobile: [
		{ title: "Home", href: "/home", icon: HomeIcon },
		{ title: "Contact", href: "/contact", icon: ContactSupportIcon },
	],
};

export const userDropdownData = [
	{ title: "Profile", href: "/profile", icon: PersonIcon },
	{ title: "Settings", href: "/settings", icon: SettingsIcon },
];
