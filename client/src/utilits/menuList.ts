import { useRentCategories } from "@/hooks/useRentCategories";

export const useMenuList = () => {
  const { rentCategories } = useRentCategories();

  return [
    {
      id: "01",
      title: "Home",
      link: "/",
    },
    {
      id: "02",
      title: "Room",
      link: "/rent",
      dropdownItems: [
        {
          key: "all",
          label: "All Rents",
          href: "/rent?category=all",
        },
        ...(rentCategories?.map((cat) => ({
          key: cat?._id,
          label: cat?.categoryName,
          href: `/rent?category=${cat?._id}`,
        })) || []),
      ],
    },
    {
      id: "03",
      title: "Flat",
      link: "/flat",
    },

    {
      id: "04",
      title: "Land",
      link: "/land",
    },

    {
      id: "05",
      title: "About",
      link: "/about",
    },
    {
      id: "06",
      title: "Blogs",
      link: "/blogs",
    },
    {
      id: "07",
      title: "Contact",
      link: "/contact",
    },
  ];
};
