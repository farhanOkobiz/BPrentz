import { FaTachometerAlt } from "react-icons/fa";
import {
  FaUserShield,
  FaUserFriends,
  FaBlog,
  FaMoneyCheckAlt,
  FaList,
  FaHome,
  FaBuilding,
  FaTree,
  FaCogs,
  FaBookmark,
} from "react-icons/fa";
import {
  FiStar,
  FiLayers,
  FiHelpCircle,
  FiUsers,
  FiTarget,
  FiEye,
  FiThumbsUp,
  FiBriefcase,
  FiInfo,
  FiPhoneCall,
} from "react-icons/fi";
import { MdSettingsApplications } from "react-icons/md";
import { AiFillFileText } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";


export const menuItems = [
  // { key: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { key: "", label: "Host Management", icon: FaUserShield },
  { key: "guest-management", label: "Guest Management", icon: FaUserFriends },
  {
    key: "listings",
    label: "Listing",
    icon: FaList,
    children: [
      { key: "listing/rent", label: "Rents", icon: FaHome },
      { key: "listing/flat", label: "Flat", icon: FaBuilding },
      { key: "listing/land", label: "Land", icon: FaTree },
    ],
  },
  {
    key: "bookings",
    label: "Booking",
    icon: FaBookmark,
    children: [
      { key: "booking/rent", label: "Rent", icon: FaHome },
      { key: "booking/land", label: "Land", icon: FaBuilding },
      { key: "booking/flatBook", label: "Flat", icon: FaTree },
    ],
  },
  { key: "contact_us", label: "Contact Us", icon: FiPhoneCall },
  // { key: "payment", label: "Payment", icon: FaMoneyCheckAlt },
  {
    key: "staff-management",
    label: "Staff Management",
    icon: MdSettingsApplications,
  },
  {
    key: "content_management",
    label: "Content Management",
    icon: AiFillFileText,
    children: [
      { key: "content/feature", label: "Feature", icon: FiStar },
      { key: "content/banner", label: "banner", icon: FiStar },
      { key: "content/category", label: "Category", icon: FiLayers },
      // { key: "content/faq", label: "FAQ", icon: FiHelpCircle },
      { key: "content/location", label: "Location", icon: IoLocation },
      // { key: "content/team_members", label: "Team Members", icon: FiUsers },
      // { key: "content/mission", label: "Mission", icon: FiTarget },
      // { key: "content/vision", label: "Vision", icon: FiEye },
      {
        key: "content/why_choose_us",
        label: "Why Choose Us",
        icon: FiThumbsUp,
      },
      // { key: "content/partners", label: "Partners", icon: FiBriefcase },
      { key: "content/about_us", label: "About Us", icon: FiInfo },
      { key: "content/amenities", label: "Amenities", icon: FaCogs },
      { key: "content/blog-management", label: "Blog", icon: FaBlog },
    ],
  },
];
