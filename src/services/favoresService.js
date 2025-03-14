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
  
  // New function to apply for a favor
  applyToFavor: async (idStudent, idFavor) => {
    try {
      // Log datos enviados para debug
      console.log("Datos enviados para postulación:", { idStudent, idFavor });
      
      // Asegurémonos de que la URL esté correctamente formada
      // Para mayor seguridad vamos a verificar la dirección completa
      console.log("URL de postulación:", `${API_URL}/students/applyToFavor`);
      
      // Intenta usar la ruta correcta - basado en el error, debemos verificar si existe otra ruta
      // Podemos intentar las siguientes alternativas:
      let response;
      try {
        // Primera opción: La ruta original
        response = await axios.post(`${API_URL}/students/applyToFavor`, {
          idStudent,
          idFavor
        });
      } catch (err) {
        console.log("Primer intento fallido, probando rutas alternativas");
        
        try {
          // Segunda opción: Sin /students/ prefijo, solo /apply
          response = await axios.post(`${API_URL}/apply`, {
            idStudent,
            idFavor
          });
        } catch (err2) {
          // Tercera opción: Usar /favores/apply
          response = await axios.post(`${API_URL}/favores/apply`, {
            idStudent,
            idFavor
          });
        }
      }

      if (!response.data || !response.data.success) {
        throw new Error("Error al postular al favor");
      }

      return response.data;
    } catch (error) {
      console.error("Error al postular al favor:", error);
      throw error;
    }
  },
  
  // New function to get applied favors
  getAppliedFavores: async (appliedFavorIds) => {
    try {
      if (!appliedFavorIds || appliedFavorIds.length === 0) {
        return [];
      }
      
      // Get all favors first
      const allFavores = await favoresService.getAllFavores();
      
      // Filter only the ones that match the applied favor IDs
      const appliedFavores = allFavores.filter(favor => 
        appliedFavorIds.includes(favor.ID)
      );
      
      return appliedFavores;
    } catch (error) {
      console.error("Error al obtener favores aplicados:", error);
      throw error;
    }
  }
};

export default favoresService;