"use client";
import { ListingProvider } from "@/contexts/ListingContext";
import StepNavigation from "../components/stepNavigation/StepNavigation";
import TopNavWithAction from "../components/TopNavWithAction";
import { ListingStepProvider } from "@/contexts/ListingStepContext";
import "leaflet/dist/leaflet.css";

export default function BecomeAHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ListingProvider>
        <ListingStepProvider>
          <div className="flex flex-col min-h-screen">
            <TopNavWithAction />
            <main className="flex-grow w-full mx-auto p-4">{children}</main>

            <div className="sticky bottom-0 bg-white border border-gray-300 p-4 shadow-md z-50">
              <div className="max-w-6xl mx-auto">
                <StepNavigation />
              </div>
            </div>
          </div>
        </ListingStepProvider>
      </ListingProvider>
    </>
  );
}
