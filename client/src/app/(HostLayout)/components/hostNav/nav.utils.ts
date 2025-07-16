export const TabMenuList = [
  {
    id: 1,
    title: "Today",
    link: "/host-dashboard/",
  },
  {
    id: 2,
    title: "Calender",
    link: "/host-dashboard/calender",
  },
  {
    id: 3,
    title: "Earnings",
    link: "/host-dashboard/earnings",
  },
  {
    id: 4,
    title: "Menu",
    link: "#",
    dropdownItems: [
      {
        key: "listing",
        label: "My Listings",
        href: "/host-dashboard/listings",
      },
      {
        key: "reservations",
        label: "Reservations",
        href: "/host-dashboard/",
      },
      // { key: "payouts", label: "Payouts", href: "/host-dashboard/payouts" },
      { key: "blogs", label: "Blogs", href: "/host-dashboard/blogs" },
      { key: "about", label: "About Us", href: "/host-dashboard/about" },
      { key: "contact", label: "Contact", href: "/host-dashboard/contact" },
    ],
  },
];
