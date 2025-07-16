"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { ProfileServices } from "@/services/profile/profile.services";

const PaymentSuccess = () => {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const downloadReceipt = (booking: any) => {
        const receipt = `
    Booking Receipt

    Booking ID: ${booking._id}
    Transaction ID: ${booking.transactionId}
    Payment Status: ${booking.paymentStatus}
    Rent Title: ${booking.rent?.title}
    Total Price: BDT ${booking.price}
    Guest Count: ${booking.guestCount}
    Check-in: ${new Date(booking.checkinDate).toLocaleDateString()}
    Check-out: ${new Date(booking.checkoutDate).toLocaleDateString()}
    `;

        const blob = new Blob([receipt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Booking-${booking._id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) {
                setError("No booking ID provided");
                setLoading(false);
                return;
            }

            try {
                const result: any = await ProfileServices.processGetSslSuccess(bookingId);
                setBooking(result.data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch booking info");
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8 animate-pulse">
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-16 w-16 rounded-full bg-gray-200" />
                        <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded" />
                        <div className="h-4 w-3/4 mx-auto bg-gray-200 rounded" />
                    </div>

                    <div className="mt-8 border-t pt-6 space-y-4 text-sm text-gray-700">
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <div key={idx}>
                                    <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                                    <div className="h-5 w-32 bg-gray-300 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="h-10 w-40 bg-gray-200 mx-auto rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl max-w-2xl w-full p-8">
                <div className="text-center">
                    <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
                    <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful</h1>
                    <p className="text-gray-600 mt-1">Thank you! Your booking has been confirmed successfully.</p>
                </div>

                <div className="mt-8 border-t pt-6 space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-500">Booking ID</p>
                            <p className="font-medium">{booking._id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Transaction ID</p>
                            <p className="font-medium">{booking.transactionId}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Payment Status</p>
                            <p className="font-semibold text-green-600">{booking.paymentStatus}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Rent Title</p>
                            <p className="font-medium">{booking.rent?.title}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Total Price</p>
                            <p className="font-medium">BDT {booking.price}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Guest Count</p>
                            <p className="font-medium">{booking.guestCount}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-medium">
                                {new Date(booking.checkinDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-medium">
                                {new Date(booking.checkoutDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                    <Link
                        href="/rent"
                        className="inline-block bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all text-sm font-medium"
                    >
                        Go to Booking
                    </Link>

                    <button
                        onClick={() => downloadReceipt(booking)}
                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all text-sm font-medium"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Download Receipt
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PaymentSuccess;
