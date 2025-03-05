import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const favoresService = {
  getAllFavores: async () => {
    try {
      const response = await axios.get(`${API_URL}/favores/getAllFavores`);

      if (!response.data || !response.data.success) {
        throw new Error("Error al obtener favores");
      }

      const favoresSinAsignar = response.data.data.filter(
        (favor) => favor.Status === "Sin asignar"
      );

      return favoresSinAsignar;
    } catch (error) {
      console.error("Error en el servicio de favores:", error);
      throw error;
    }
  },

  getFavorById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/favores/getFavor?id=${id}`);

      if (!response.data || !response.data.success) {
        throw new Error("Error al obtener detalles del favor");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error en el servicio de favores:", error);
      throw error;
    }
  },
};

export default favoresService;
