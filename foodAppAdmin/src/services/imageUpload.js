import axios from "axios";

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_YOUR_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file) => {
    if (!file) throw new Error("No file provided");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
    );

    return {
        secure_url: res.data.secure_url,
        public_id: res.data.public_id,
    };
};
