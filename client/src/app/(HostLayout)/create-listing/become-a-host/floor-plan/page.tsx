"use client";

import FloorPlanStep from "../../components/floorPlan/FloorPlanStep";

function FloorPlan() {
  return (
    <div className="min-h-[calc(80vh-100px)] w-full flex items-center justify-center">
      <FloorPlanStep />
    </div>
  );
}

export default FloorPlan;
