import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createLand } from "@/services/land";

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
  title: string;
  landId: string;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const LandAppointmentModel: React.FC<Props> = ({ onClose, title, landId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      await createLand({ land: landId, ...data }, accessToken);
      toast.success("Appointment created successfully!");
      onClose();
      router.push(`/land`);
    } catch (error) {
      toast.error("Failed to create appointment");
      console.error("Failed to create appointment", error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <AnimatePresence>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg sm:max-w-xl bg-white rounded-md shadow-lg relative max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <div
              className="p-1 rounded-full border absolute top-4 left-4 text-gray-600 cursor-pointer z-10"
              onClick={onClose}
            >
              <HiMiniXMark className="text-xl" />
            </div>

            {/* Modal Content */}
            <div className="px-6 pt-14 pb-6 sm:px-10">
              <h2 className="text-lg font-semibold capitalize">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                To book this appointment, please fill out the form
              </p>

              <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
                {/* Name */}
                <div>
                  <input
                    {...register("name", { required: "Name is required" })}
                    className="border border-gray-400 outline-none rounded w-full px-3 py-2"
                    type="text"
                    placeholder="Your Name *"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone & Email */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <input
                      {...register("phone", { required: "Phone is required" })}
                      className="border border-gray-400 outline-none rounded w-full px-3 py-2"
                      type="text"
                      placeholder="Your Number *"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <input
                      {...register("email")}
                      className="border border-gray-400 outline-none rounded w-full px-3 py-2"
                      type="email"
                      placeholder="Your Email"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <textarea
                    {...register("message")}
                    className="border border-gray-400 outline-none rounded w-full px-3 py-2"
                    placeholder="Your message"
                    rows={4}
                  />
                </div>

                {/* Submit with Tooltip */}
                <div className="relative group w-full">
                  <button
                    type="submit"
                    disabled={!isLoggedIn || isLoading}
                    className={`w-full py-3 rounded cursor-pointer transition flex items-center justify-center ${
                      isLoggedIn
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Book Appointment"
                    )}
                  </button>

                  {!isLoggedIn && (
                    <div className="absolute left-1/2 -top-12 -translate-x-1/2 z-10 w-max bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                      Please login as guest to book
                      <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default LandAppointmentModel;
