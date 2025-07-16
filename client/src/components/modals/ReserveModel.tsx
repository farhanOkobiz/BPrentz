import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import Reserve from "../details/Reserve/Reserve";
import { TFloorPlan } from "@/types";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -30 },
};

interface Props {
  onClose: () => void;
  slug: string;
  price: number;
  floorPlan: TFloorPlan;
}

const ReserveModel: React.FC<Props> = ({ onClose, slug, price, floorPlan }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 w-full h-screen bg-[#262626]/20 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="flex items-center justify-center w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="bg-[#fff] w-[600px]  rounded shadow relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // stop propagation here as well
          >
            <div
              className="p-1 rounded-full border absolute top-4 lg:left-4 right-4 text-[#262626]/60 cursor-pointer"
              onClick={onClose}
            >
              <HiMiniXMark className="text-xl" />
            </div>
            <div className="">
              <Reserve slug={slug} price={price} floorPlan={floorPlan} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReserveModel;
