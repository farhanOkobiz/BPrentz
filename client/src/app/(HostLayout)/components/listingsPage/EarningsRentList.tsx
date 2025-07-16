import React from "react";

interface EarningsRentListProps {
  bookings: any[];
  totalEarnings: number;
}

const EarningsRentList: React.FC<EarningsRentListProps> = ({ bookings, totalEarnings }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden capitalize mt-8">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Earnings Bookings</h2>
        <div className="text-xl font-bold text-green-600">
          Total Earnings: <span className="ml-2">৳ {totalEarnings}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Booking User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Check-in</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Check-out</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Location</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{booking.rent?.title || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-semibold">{booking.user?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">{booking.user?.email || ""}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.checkinDate ? new Date(booking.checkinDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.checkoutDate ? new Date(booking.checkoutDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                  ৳ {booking.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.rent?.location || "N/A"}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  No earnings bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsRentList;