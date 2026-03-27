export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();

  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset); 
  formData.append("cloud_name", cloudName); 

  const res = await fetch(
    `${cloudinaryUrl}/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  return data.secure_url;
};