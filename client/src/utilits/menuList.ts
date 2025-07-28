
export const useMenuList = () => {

  return [
    {
      id: "01",
      title: "Home",
      link: "/",
    },
    {
      id: "property-listing",
      title: "Property Listing",
      link: "#", // We'll handle hover with custom component
      isMultiLevel: true,
      subItems: [
        {
          key: "rent",
          label: "Rent",
          children: [
            { label: "Room", href: "/rent" },
            { label: "Parking", href: "/parking" },
          ],
        },
        {
          key: "buy-sell",
          label: "Buy/Sell",
          children: [
            { label: "Flat", href: "/flat" },
            { label: "Land", href: "/land" },
          ],
        },
      ],
    },
    {
      id: "03",
      title: "About",
      link: "/about",
    },
    {
      id: "04",
      title: "Blogs",
      link: "/blogs",
    },
    {
      id: "05",
      title: "Contact",
      link: "/contact",
    },
  ];
};
