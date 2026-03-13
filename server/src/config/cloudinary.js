// Cloudinary is optional — only configure if real keys are provided
let cloudinaryConfigured = false;

const initCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    !CLOUDINARY_CLOUD_NAME.startsWith("your_")
  ) {
    cloudinaryConfigured = true;
    console.log("Cloudinary configured.");
  } else {
    console.log("Cloudinary not configured — using placeholder keys. Image uploads disabled.");
  }
};

export { initCloudinary, cloudinaryConfigured };
