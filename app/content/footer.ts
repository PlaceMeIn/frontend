const  footerColumns = [
    {
        label: "QuichLinks",
        children: [
            {
                label: "Home",
                to: "/",
            },
            {
                label: "About",
                to: "/about",
            },
            {
                label: "Projects",
                to: "/projects",
            },
            {
                label: "Events",
                to: "/events",
            },
            {
                label: "Leadership",
                to: "/leadership",
            },
            {
                label: "Gallery & Memories",
                to: "/gallery",
            },
            {
                label: "Reviews",
                to: "/reviews",
            },
            {
                label: "Terms & Policies",
                to: "/terms"
            },

            {
                label: "Suggestions",
                to: "/suggestions",
            },
        ],
    },
    {
        label: "Features",
        children: [
            {
                label: "Resources",
                to: "/resources",
            },
            {
                label: "projects",
                to: "/projects",
            },
            {
                label: "Join MUT Tech",
                to: "/join",
            },

            {
                label: "Contact",
                to: "/contact",
            },
            {
                label: "Support",
                to: "/support",
            },
            {
                label: "Community",
                to: "/community",
            },
            {
                label: "Enginering",
                to: "/engineering"
            }
        ],
    },
    {
        label: "Contact",
        children: [
            {
                label: "Murang'a University Of Technology Tech Club",
                to: "",
            },
            {
                label: "P.O.Box 75-10200",
                to: "",
            },
            {
                label: "Murnag'a, Kenya",
                to: "",
            },
            {
                label:"info@mutechclub.com",
                to: "mailto:info@tech.mut.ac.ke",
            },
        ],
    },
];

const msg = " Empowering the next generation of innovators, developers, and tech leaders at Murang'a University of Technology."
const copyright = `© ${new Date().getFullYear()} MUT Tech Club. All rights reserved.`
const engineeredBy = {
    label: "Engineered with passion by the MUT Tech Club Team.",
    to: "/engineering",
    icon: "",
}

export const footerData = () => {

    return {
        columns: footerColumns,
        msg: msg,
        copyright: copyright,
        engineeredBy: engineeredBy
    }
}