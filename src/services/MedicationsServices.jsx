// Servicio para obtener información de las creadoras desde la API local

const URL_API_MEDICATION = "http://localhost:8080/api/medications";
const URL_API_REMINDER = "http://localhost:8080/api/reminders"

import Swal from 'sweetalert2';




// TODO: Actualizar estas URLs cuando el backend esté listo
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const ENDPOINTS = {
  medications: `${API_BASE_URL}/medications`,
  // Si el backend usa rutas diferentes, actualizar aquí:
  // medications: `${API_BASE_URL}/api/medications`,
  // medications: `${API_BASE_URL}/api/v1/medications`,
};

// Método GET para el READ - Obtener todos los medicamentos
export async function getAllMedications() {
  try {
    const response = await fetch(ENDPOINTS.medications);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    
    // LOG para debugging - quitar en producción
    console.log('Medicamentos obtenidos:', data);
    
    return data;
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudieron cargar los medicamentos. Verifica tu conexión.',
    });
    throw error;
  }
}

// Método GET para obtener un medicamento específico
export async function getOneMedication(id) {
  try {
    const response = await fetch(`${ENDPOINTS.medications}/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener medicamento:', error);
    throw error;
  }
}

// Método POST para el CREATE - Crear nuevo medicamento
export async function createMedication(newMedication) {
  try {
    // LOG para debugging - verificar datos que se envían
    console.log('Enviando medicamento:', newMedication);
    
    const response = await fetch(ENDPOINTS.medications, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMedication)
    });

    if (response.ok) {
      const created = await response.json();
      
      // LOG para debugging - verificar respuesta
      console.log('Medicamento creado:', created);
      
      Swal.fire({
        icon: 'success',
        title: '¡Medicamento añadido!',
        text: 'El medicamento se ha guardado correctamente.',
        confirmButtonText: 'Perfecto',
        customClass: { confirmButton: 'swal2-confirm-ok' }
      });
      return created;
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.message || 'Error al crear el medicamento');
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al crear',
      text: error.message || 'No se pudo añadir el medicamento.',
    });
    throw error;
  }
}

// Método PUT para el UPDATE - Actualizar medicamento
export async function updateMedication(id, updatedMedication) {
  try {
    console.log('Actualizando medicamento ID:', id, 'con datos:', updatedMedication);
    
    const response = await fetch(`${ENDPOINTS.medications}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMedication),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.log("Status del error:", response.status);
      throw new Error(errorData.message || "Error al actualizar medicamento");
    }

    const data = await response.json();
    console.log("Medicamento actualizado correctamente", data);
    
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'El medicamento se ha actualizado correctamente.',
      timer: 2000,
      showConfirmButton: false
    });
    
    return data;

  } catch (error) {
    console.error("Error al actualizar:", error.message);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: error.message || 'No se pudo actualizar el medicamento.',
    });
    throw error;
  }
}

// Método DELETE para eliminar medicamento
export async function deleteMedication(id) {
  try {
    let medicationName = '';

    // Intentar obtener el nombre del medicamento antes de eliminarlo
    try {
      const medication = await getOneMedication(id);
      // Adaptar según los campos que use el backend
      medicationName = medication.name || medication.nombre || medication.medicamento || '';
    } catch (error) {
      console.warn('No se pudo obtener el nombre del medicamento:', error);
      medicationName = '';
    }

    // Confirmar eliminación antes de proceder
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: medicationName 
        ? `¿Quieres eliminar el medicamento "${medicationName}"?`
        : '¿Quieres eliminar este medicamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return null; // Usuario canceló la eliminación
    }

    // Hacer la petición DELETE al servidor
    const response = await fetch(`${ENDPOINTS.medications}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    

    // Petición exitosa - mostrar mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Eliminado!',
      text: medicationName
        ? `El medicamento "${medicationName}" fue eliminado correctamente.`
        : `El medicamento con ID ${id} fue eliminado correctamente.`,
      timer: 2000,
      showConfirmButton: false
    });

    return response;

  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al eliminar',
      text: error.message || 'No se pudo eliminar el medicamento.',
    });
    throw error;
  }
}
