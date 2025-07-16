// import { createBrowserRouter } from "react-router-dom";
// import Main from "../layouts/Main";
// import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
// import Protected from "../components/Protected";
// import PublicOnly from "../components/PublicOnly";
// import Payment from "../pages/Payment";
// import GuestManagement from "../pages/GuestManagement";
// import HostManagement from "../pages/HostManagement";
// import BlogManagement from "../pages/BlogManagement";
// import StaffManagement from "../pages/StaffManagement";
// import Feature from "../pages/Feature";
// import Category from "../pages/Category";
// import Faq from "../pages/Faq";
// import TeamMembers from "../pages/TeamMembers";
// import Mission from "../pages/Mission";
// import Vission from "../pages/Vission";
// import AboutUs from "../pages/AboutUs";
// import Partners from "../pages/Partners";
// import WhyChooseUs from "../pages/WhyChooseUs";
// import ContactUs from "../pages/ContactUs";
// import Land from "../pages/Land";
// import Flat from "../pages/Flat";
// import Rent from "../pages/Rent";
// import Amenities from "../pages/Amenities";
// import RoleProtected from "../components/RoleProtected";

// const Routes = createBrowserRouter([
//   {
//     path: "/login",
//     element: (
//       <PublicOnly>
//         <Login />
//       </PublicOnly>
//     ),
//   },
//   {
//     path: "/",
//     element: (
//       <Protected>
//         <Main />
//       </Protected>
//     ),
//     children: [
//       { path: "/", element: <Dashboard /> },
//       { path: "/payment", element: <Payment /> },
//       { path: "/guest-management", element: <GuestManagement /> },
//       { path: "/host-management", element: <HostManagement /> },
//       { path: "/content/blog-management", element: <BlogManagement /> },
//       { path: "/staff-management", element: <StaffManagement /> },
//       { path: "/content/feature", element: <Feature /> },
//       { path: "/content/category", element: <Category /> },
//       { path: "/content/faq", element: <Faq /> },
//       { path: "/content/team_members", element: <TeamMembers /> },
//       { path: "/content/mission", element: <Mission /> },
//       { path: "/content/vision", element: <Vission /> },
//       { path: "/content/about_us", element: <AboutUs /> },
//       { path: "/content/partners", element: <Partners /> },
//       { path: "/content/why_choose_us", element: <WhyChooseUs /> },
//       { path: "/contact_us", element: <ContactUs /> },
//       { path: "/listing/land", element: <Land /> },
//       { path: "/listing/flat", element: <Flat /> },
//       { path: "listing/rent", element: <Rent /> },
//       { path: "/content/amenities", element: <Amenities /> },
//     ],
//   },
// ]);

// export default Routes;

import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
import Protected from "../components/Protected";
import PublicOnly from "../components/PublicOnly";
import Payment from "../pages/Payment";
import GuestManagement from "../pages/GuestManagement";
import HostManagement from "../pages/HostManagement";
import BlogManagement from "../pages/BlogManagement";
import StaffManagement from "../pages/StaffManagement";
import Feature from "../pages/Feature";
import Category from "../pages/Category";
import Faq from "../pages/Faq";
import TeamMembers from "../pages/TeamMembers";
import Mission from "../pages/Mission";
import Vission from "../pages/Vission";
import AboutUs from "../pages/AboutUs";
import Partners from "../pages/Partners";
import WhyChooseUs from "../pages/WhyChooseUs";
import ContactUs from "../pages/ContactUs";
import Land from "../pages/Land";
import Flat from "../pages/Flat";
import Rent from "../pages/Rent";
import Amenities from "../pages/Amenities";
import RoleProtected from "../components/RoleProtected";
import FlatBook from "../pages/FlatBook";
import LandBook from "../pages/LandBook";
import RentBook from "../pages/RentBook";
import Location from "../pages/Location";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import BannerManager from "../pages/BannerManager";

const Routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicOnly>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnly>
        <ForgotPassword />
      </PublicOnly>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <PublicOnly>
        <ResetPasswordPage />
      </PublicOnly>
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <Main />
      </Protected>
    ),
    children: [
      {
        path: "/",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            {/* <Dashboard /> */}
            <HostManagement />
          </RoleProtected>
        ),
      },

      // {
      //   path: "/payment",
      //   element: (
      //     <RoleProtected
      //       allowedRoles={["admin", "financeManager", "accountAdministrator"]}
      //     >
      //       <Payment />
      //     </RoleProtected>
      //   ),
      // },
      {
        path: "/guest-management",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <GuestManagement />
          </RoleProtected>
        ),
      },
      // {
      //   path: "/host-management",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
      //       <HostManagement />
      //     </RoleProtected>
      //   ),
      // },
      {
        path: "/content/blog-management",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <BlogManagement />
          </RoleProtected>
        ),
      },
      {
        path: "/staff-management",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            <StaffManagement />
          </RoleProtected>
        ),
      },

      // Content management
      {
        path: "/content/feature",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Feature />
          </RoleProtected>
        ),
      },
      {
        path: "/content/banner",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            {/* <Feature /> */}
            <BannerManager />
          </RoleProtected>
        ),
      },
      {
        path: "/content/category",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Category />
          </RoleProtected>
        ),
      },
      {
        path: "/content/location",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Location />
          </RoleProtected>
        ),
      },
      // {
      //   path: "/content/faq",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "contentManager"]}>
      //       <Faq />
      //     </RoleProtected>
      //   ),
      // },
      // {
      //   path: "/content/team_members",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "contentManager"]}>
      //       <TeamMembers />
      //     </RoleProtected>
      //   ),
      // },
      // {
      //   path: "/content/mission",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "contentManager"]}>
      //       <Mission />
      //     </RoleProtected>
      //   ),
      // },
      // {
      //   path: "/content/vision",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "contentManager"]}>
      //       <Vission />
      //     </RoleProtected>
      //   ),
      // },
      {
        path: "/content/about_us",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <AboutUs />
          </RoleProtected>
        ),
      },
      // {
      //   path: "/content/partners",
      //   element: (
      //     <RoleProtected allowedRoles={["admin", "contentManager"]}>
      //       <Partners />
      //     </RoleProtected>
      //   ),
      // },
      {
        path: "/content/why_choose_us",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <WhyChooseUs />
          </RoleProtected>
        ),
      },
      {
        path: "/contact_us",
        element: (
          <RoleProtected allowedRoles={["admin", "accountAdministrator"]}>
            <ContactUs />
          </RoleProtected>
        ),
      },
      {
        path: "/content/amenities",
        element: (
          <RoleProtected allowedRoles={["admin", "contentManager"]}>
            <Amenities />
          </RoleProtected>
        ),
      },

      // Listing management
      {
        path: "/listing/land",
        element: (
          <RoleProtected allowedRoles={["admin", "listingVerificationManager"]}>
            <Land />
          </RoleProtected>
        ),
      },
      {
        path: "/listing/flat",
        element: (
          <RoleProtected allowedRoles={["admin", "listingVerificationManager"]}>
            <Flat />
          </RoleProtected>
        ),
      },
      {
        path: "listing/rent",
        element: (
          <RoleProtected allowedRoles={["admin", "listingVerificationManager"]}>
            <Rent />
          </RoleProtected>
        ),
      },

      // booking management
      {
        path: "/booking/rent",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            {/* <Land /> */}
            <RentBook />
          </RoleProtected>
        ),
      },
      {
        path: "/booking/land",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            {/* <Land /> */}
            <LandBook />
          </RoleProtected>
        ),
      },
      {
        path: "/booking/flatBook",
        element: (
          <RoleProtected allowedRoles={["admin"]}>
            <FlatBook />
          </RoleProtected>
        ),
      },
    ],
  },
]);

export default Routes;
