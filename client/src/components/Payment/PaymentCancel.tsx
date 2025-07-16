"use client";
import { XCircle } from "lucide-react";
import Link from "next/link";

const PaymentCancelled = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8">
                <div className="text-center">
                    <XCircle className="mx-auto text-red-500 w-16 h-16" />
                    <h1 className="text-2xl font-bold text-red-600 mt-4">Payment Cancelled</h1>
                    <p className="text-gray-600 mt-1">
                        Your payment has been cancelled. If this was a mistake, please try again.
                    </p>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="inline-block bg-gray-200 text-gray-800 px-6 py-2.5 rounded-full hover:bg-gray-300 transition-all text-sm font-medium"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        href="#"
                        className="inline-block bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all text-sm font-medium"
                    >
                        Try Payment Again
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
