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
};

export default studentsService;
