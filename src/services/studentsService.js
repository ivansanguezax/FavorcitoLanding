const API_URL = import.meta.env.VITE_API_URL;

export const studentsService = {
  registerStudent: async (studentData) => {
    try {
      const response = await fetch(`${API_URL}/students/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error('Error al registrar estudiante');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en el servicio:', error);
      throw error;
    }
  }
};