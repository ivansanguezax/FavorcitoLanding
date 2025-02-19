import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fileService = {
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },

  uploadImage: async (base64, title) => {
    try {
      const response = await axios.post(`${API_URL}/file/image/upload`, {
        base64: base64,
        title: title,
      });

      if (!response.data || !response.data.success) {
        throw new Error("Error al subir la imagen");
      }

      return response.data.data.url;
    } catch (error) {
      console.error("Error en servicio de subida de archivos:", error);
      throw error;
    }
  },
};

export default fileService;
