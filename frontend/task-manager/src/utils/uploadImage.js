import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axioslnstance";
import { toast } from 'sonner';


const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        return response.data;
    } catch (error) {
        console.log('Error upload image: ', error);
        return toast.error(error)
    }
}

export default uploadImage; 