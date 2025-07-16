export type TabKey =
  | "all"
  | "checking"
  | "checkout"
  | "cancancelled"
  | "pending"
  | "rejected";

export interface RowData {
  _id: string;
  rent: {
    title: string;
    location: string;

    price: number;
    status: string;
  };
  guestCount: number;
  price: number;
  status: string;
  checkinDate: string;
  checkoutDate: string;
}
