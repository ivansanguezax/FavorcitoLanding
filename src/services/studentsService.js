import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const studentsService = {
  registerStudent: async (studentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/students/register`,
        studentData
      );

      if (!response.data || !response.data.success) {
        throw new Error("Error al registrar estudiante");
      }

      return response.data;
    } catch (error) {
      console.error("Error en el servicio de estudiantes:", error);
      throw error;
    }
  },

  getStudentInfo: async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/students/getInfo?email=${email}`
      );

      if (!response.data || !response.data.success) {
        throw new Error("Error al obtener información del estudiante");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error en el servicio de estudiantes:", error);
      throw error;
    }
  },

  checkStudentExists: async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}/students/getInfo?email=${email}`
      );
      return response.data && response.data.success && !!response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      console.error("Error verificando existencia de estudiante:", error);
      throw error;
    }
  },

  updateStudent: async (studentId, updateData) => {
    try {
      // Verificar que el ID del estudiante no sea undefined o null
      if (!studentId) {
        throw new Error("ID de estudiante no válido");
      }
      
      const response = await axios.put(
        `${API_URL}/students/${studentId}/update`, 
        updateData
      );

      if (!response.data || !response.data.success) {
        throw new Error("Error al actualizar la información del estudiante");
      }

      return response.data;
    } catch (error) {
      console.error("Error en el servicio de actualización de estudiante:", error);
      throw error;
    }
  },
 // Método para postular a un favor con el endpoint correcto
 applyToFavor: async (idStudent, idFavor) => {
  try {
    console.log("Intentando postular con:", { idStudent, idFavor });
    
    // Endpoint correcto para la postulación
    const endpoint = `${API_URL}/students/applyToFavor`;
    
    console.log("URL para postulación:", endpoint);
    
    const response = await axios.post(endpoint, {
      idStudent,
      idFavor
    });

    if (!response.data || !response.data.success) {
      throw new Error("Error al postular al favor");
    }

    return response.data;
  } catch (error) {
    console.error("Error al postular al favor:", error);
    throw error;
  }
},

// Obtener favores aplicados
getAppliedFavors: async (studentId) => {
  try {
    const response = await axios.get(`${API_URL}/students/getAppliedFavors?id=${studentId}`);

    if (!response.data || !response.data.success) {
      throw new Error("Error al obtener favores aplicados");
    }

    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo favores aplicados:", error);
    throw error;
  }
}
};

export default studentsService;