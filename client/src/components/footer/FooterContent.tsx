import Image from "next/image";
import FooterImg from "@/assets/logo/homzystay.png";
import Link from "next/link";
import { poppins } from "@/app/font";
import DownFooter from "./DownFooter/DownFooter";

const footerLinks = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blogs", href: "/blogs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "Rent Listing", href: "/rent" },
      { label: "Flat Listing", href: "/flat" },
      { label: "Land Listing", href: "/land" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-condition" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Refund Policy", href: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/fatiha.travels/?hl=en",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/fatihatravelsandtourism/",
      },
      { label: "Youtube", href: "youtube.com/@FatihaTravelsTourism" },
    ],
  },
  {
    title: "Payment Methods",
    links: [
      { label: "Bank Transfer", href: "#" },
      { label: "Bkash", href: "#" },
      { label: "SSLCommerz", href: "#" },
    ],
  },
];

const FooterContent = () => {
  return (
    <div className={`Container py-12 ${poppins.className}`}>
      <div className="flex flex-col md:flex-row justify-between gap-12">
        <div className="flex-shrink-0 ">
          <Image
            src={FooterImg}
            alt="Stayverz Logo"
            width={180}
            height={180}
            className="object-contain md:ml-0 ml-[-16px]"
          />
          <p className="mt-4 text-sm text-gray-500 max-w-xs">
            Homezay stay helps you explore, book, and enjoy stays around the
            world with confidence and ease.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="xl:text-lg text-sm font-semibold text-gray-900 mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, index) => (
                  <li key={index}>
                    {["Company", "Important Links"].includes(section.title) ? (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-[#F15927] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-[#F15927] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t pt-6">
        <div className="text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-gray-700">Homzystay.com</span> — All rights reserved.
          </p>
          <p className="mt-1">
            Developed by{" "}
            <a
              href="https://okobiz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shadow-blue-400 hover:underline font-medium"
            >
              okobiz
            </a>
          </p>
        </div>
      </div>


      <DownFooter />
    </div>
  );
};

export default FooterContent;
