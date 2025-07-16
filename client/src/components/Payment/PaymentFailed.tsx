"use client";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import Link from "next/link";

const PaymentFailed = () => {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId") || "N/A";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8">
                <div className="text-center">
                    <XCircle className="mx-auto text-red-500 w-16 h-16" />
                    <h1 className="text-2xl font-bold text-red-600 mt-4">Payment Failed</h1>
                    <p className="text-gray-600 mt-1">
                        Sorry! Your payment was not successful. Please try again or contact support.
                    </p>
                </div>

                <div className="mt-8 border-t pt-6 space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500">Booking ID</p>
                            <p className="font-medium">{bookingId}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className="font-semibold text-red-600">FAILED</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                    {/* <Link
                        href="/rent"
                        className="inline-block bg-gray-500 text-white px-6 py-2.5 rounded-full hover:bg-gray-600 transition-all text-sm font-medium"
                    >
                        Go to Booking
                    </Link> */}
                    <Link
                        href="/rent"
                        className="inline-block bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all text-sm font-medium"
                    >
                        Please , Try again
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
