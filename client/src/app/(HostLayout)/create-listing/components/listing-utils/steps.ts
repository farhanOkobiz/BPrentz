export const getStepsForFeatureType = (featureType: string | null) => {
  const baseSteps = [
    "/create-listing/become-a-host",
    "/create-listing/become-a-host/feature",
    "/create-listing/become-a-host/category",
  ];

  const type = featureType?.toLowerCase();

  const sharedStepsExcludingImage = [
    "/create-listing/become-a-host/title",
    "/create-listing/become-a-host/location",
    "/create-listing/become-a-host/description",
    "/create-listing/become-a-host/price",
    "/create-listing/become-a-host/review",
  ];

  const uploadImageStep = "/create-listing/become-a-host/upload-image";
  const landSizeStep = "/create-listing/become-a-host/land-size";
  const amenitiesStep = "/create-listing/become-a-host/animities";
  const floorPlanStep = "/create-listing/become-a-host/floor-plan";
  const startBookingStep =
    "/create-listing/become-a-host/start-room-booking-time";
  const endBookingStep = "/create-listing/become-a-host/end-room-booking-time";
  const roomAllowableThings = "/create-listing/become-a-host/allowable-things";
  const houseRules = "/create-listing/become-a-host/house-rules";
  const videoUploadStep = "/create-listing/become-a-host/video-upload";

  // For LAND
  if (type === "land") {
    return [
      ...baseSteps,
      "/create-listing/become-a-host/title",
      "/create-listing/become-a-host/location",
      landSizeStep,

      "/create-listing/become-a-host/description",
      uploadImageStep,
      videoUploadStep,
      "/create-listing/become-a-host/price",
      "/create-listing/become-a-host/review",
    ];
  }

  // For RENT
  if (type === "rent") {
    return [
      ...baseSteps,
      startBookingStep,
      endBookingStep,
      amenitiesStep,
      houseRules,
      floorPlanStep,
      roomAllowableThings,

      ...sharedStepsExcludingImage.slice(0, 3), // location, title, description
      uploadImageStep,

      ...sharedStepsExcludingImage.slice(3), // price, review
    ];
  }

  // For FLAT (no extra booking steps)
  if (type === "flat") {
    return [
      ...baseSteps,
      amenitiesStep,
      floorPlanStep,
      ...sharedStepsExcludingImage.slice(0, 3),
      uploadImageStep,
      videoUploadStep,
      ...sharedStepsExcludingImage.slice(3),
    ];
  }

  // For others (no image upload)
  return [...baseSteps, ...sharedStepsExcludingImage];
};
