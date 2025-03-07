import authService from "./authService";
import { studentsService } from "./studentsService";

export const calculatorAuthService = {
  signInWithGoogleForCalculator: async (city, selectedSkills, phoneNumber = "+591-66666666") => {
    try {
      // Obtener usuario directamente
      const user = await authService.signInWithGoogle();
      let exists = false;
      
      try {
        // Intentar verificar si existe usando el servicio de estudiantes directamente
        // en lugar del authService que está fallando
        if (user && user.email) {
          // Usar studentsService.checkStudentExists en lugar de authService.checkUserExists
          exists = await studentsService.checkStudentExists(user.email)
            .catch(() => false); // Si falla, asumimos que no existe
        }
      } catch (error) {
        console.warn("Error checking if student exists:", error);
        // Continuar con exists = false si hay error
      }
      
      // Si tenemos usuario pero no existe, intentar registrarlo
      if (!exists && user && user.email) {
        try {
          const registerResponse = await calculatorAuthService.registerStudentDirectly(
            user, 
            city, 
            selectedSkills,
            phoneNumber
          );
          
          // Si el registro fue exitoso, establecer exists a true
          if (registerResponse && registerResponse.success) {
            exists = true;
          }
        } catch (registerError) {
          console.error("Error registering student:", registerError);
          // Continuar incluso si falla el registro
        }
      }
      
      // Devolver siempre un objeto consistente
      return { user, exists };
    } catch (error) {
      console.error("Calculator signin error:", error);
      // Devolver un objeto vacío para evitar errores al desestructurar
      return { user: null, exists: false };
    }
  },
  
  registerStudentDirectly: async (user, city, selectedSkills, phoneNumber = "") => {
    if (!user || !user.email) {
      throw new Error("User information is incomplete");
    }
    
    // Añadir prefijo de Bolivia si no lo tiene
    const formattedPhone = phoneNumber ? 
      (phoneNumber.startsWith("+591") ? phoneNumber : `+591-${phoneNumber}`) : 
      "+591-66666666";
    
    const defaultAvailability = {
      "Miercoles": ["09:00"],
      "Lunes": [],
      "Martes": [],
      "Jueves": [],
      "Viernes": [],
      "Sabado": [],
      "Domingo": []
    };
  
    const studentData = {
      fullName: user.displayName || "",
      email: user.email || "",
      bornDate: "2000-01-01",
      phone: formattedPhone,
      city: city,
      province: "Calculadora",
      address: "Calculadora",
      university: "Calculadora",
      degree: "Calculadora",
      year: 1,
      uniID: "Calculadora",
      skills: selectedSkills,
      otherSkills: "",
      availability: defaultAvailability,
      qrCode: "pending-generation",
      classSchedule: "Miercoles de 09:00"
    };
    
    try {
      const response = await studentsService.registerStudent(studentData);
      return response;
    } catch (error) {
      console.error("Error registering student:", error);
      // Devolver un objeto para que no se rompa la cadena
      return { success: false, error: error.message };
    }
  }
};