"use client";

import Link from "next/link";
import { useState } from "react";
import { useMenuList } from "@/utilits/menuList";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function PropertyListingDropdown() {
    const menuList = useMenuList();
    const propertyListing = menuList.find((item) => item.id === "property-listing");

    const [isOpen, setIsOpen] = useState(false);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    if (!propertyListing || !propertyListing.subItems) return null;

    const dropdownVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
    };

    return (
        <li
            className="relative list-none text-base font-medium cursor-pointer text-gray-800 group transition-all duration-300"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => {
                setIsOpen(false);
                setActiveGroup(null);
            }}
        >
            <div className="flex items-center gap-1 hover:text-primary transition-colors duration-200">
                {propertyListing.title}
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute top-full left-0 mt-2 flex bg-white rounded-lg shadow-lg z-50 overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                        transition={{ duration: 0.25 }}
                        style={{ minWidth: activeGroup ? 380 : 180 }}
                    >
                        {/* Left column */}
                        <div className="bg-white py-2 pr-2 min-w-[180px]">
                            {propertyListing.subItems.map((group) => (
                                <div
                                    key={group.key}
                                    className={`flex justify-between items-center px-5 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-150 whitespace-nowrap cursor-pointer ${activeGroup === group.key ? "bg-gray-100 font-semibold" : ""
                                        }`}
                                    onMouseEnter={() => setActiveGroup(group.key)}
                                    onMouseLeave={() => setActiveGroup(null)}
                                >
                                    <span>{group.label}</span>
                                    {group.children && group.children.length > 0 && (
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right column - only render if activeGroup */}
                        {activeGroup && (
                            <motion.div
                                className="min-w-[200px] bg-white py-2 pl-4 border-l border-gray-100"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => setActiveGroup(activeGroup)}
                                onMouseLeave={() => setActiveGroup(null)}
                            >
                                {propertyListing.subItems
                                    .find((group) => group.key === activeGroup)
                                    ?.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className="block px-5 py-2 text-gray-700 hover:bg-gray-100 transition-all whitespace-nowrap rounded"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                            </motion.div>
                        )}
                    </motion.div>

                )}
            </AnimatePresence>
        </li>

    );
}
