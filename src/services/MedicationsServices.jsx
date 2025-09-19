// Servicio para obtener información de las creadoras desde la API local
import Swal from 'sweetalert2';

// Backend API base URL - change this to match your backend
const API_BASE_URL = "http://localhost:8080";

const ENDPOINTS = {
  medications: `${API_BASE_URL}/api/medications`,
  reminders: `${API_BASE_URL}/api/reminders`,
};

// Método GET para el READ - Obtener todos los medicamentos
export async function getAllMedications() {
  try {
    const response = await fetch(ENDPOINTS.medications);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
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
    console.log('Enviando medicamento:', newMedication);

    // Transform frontend data to match backend format
    const backendFormat = {
      name: newMedication.name,
      dose: newMedication.dose,
      frequency: mapFrequencyToEnum(newMedication.frequency),
      timeToTake: newMedication.time, // HH:mm format
      intervalHours: null,
      intervalDays: null
    };

    const response = await fetch(ENDPOINTS.medications, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendFormat)
    });

    if (response.ok) {
      const created = await response.json();
      console.log('Medicamento creado:', created);

      Swal.fire({
        icon: 'success',
        title: '¡Medicamento añadido!',
        text: 'El medicamento se ha guardado correctamente.',
        confirmButtonText: 'Perfecto',
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

    const backendFormat = {
      name: updatedMedication.name,
      dose: updatedMedication.dose,
      frequency: mapFrequencyToEnum(updatedMedication.frequency),
      timeToTake: updatedMedication.time,
      intervalHours: null,
      intervalDays: null
    };

    const response = await fetch(`${ENDPOINTS.medications}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendFormat),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
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
      medicationName = medication.name || '';
    } catch (error) {
      console.warn('No se pudo obtener el nombre del medicamento:', error);
    }

    // Confirmar eliminación
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
      return null;
    }

    const response = await fetch(`${ENDPOINTS.medications}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      throw new Error(errorData.message || 'Error al eliminar medicamento');
    }

    Swal.fire({
      icon: 'success',
      title: '¡Eliminado!',
      text: medicationName
        ? `El medicamento "${medicationName}" fue eliminado correctamente.`
        : `El medicamento fue eliminado correctamente.`,
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

// Helper function to map frontend frequency values to backend enum
function mapFrequencyToEnum(frontendFrequency) {
  const frequencyMap = {
    'una-vez-al-dia': 'ONCE_A_DAY',
    'dos-veces-al-dia': 'TWICE_A_DAY',
    'tres-veces-al-dia': 'THREE_TIMES_A_DAY',
    'cuatro-veces-al-dia': 'FOUR_TIMES_A_DAY',
    'cada-cuatro-horas': 'EVERY_FOUR_HOURS',
    'cada-seis-horas': 'EVERY_SIX_HOURS',
    'cada-ocho-horas': 'EVERY_EIGHT_HOURS',
    'una-vez-semana': 'CUSTOM', // You might need to handle this differently
    'dos-veces-semana': 'CUSTOM',
  };

  return frequencyMap[frontendFrequency] || 'ONCE_A_DAY';
}

// Reminder services
export async function getActiveReminders() {
  try {
    const response = await fetch(`${ENDPOINTS.reminders}/active`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    throw error;
  }
}

export async function markReminderAsTaken(id) {
  try {
    const response = await fetch(`${ENDPOINTS.reminders}/${id}/taken`, {
      method: 'PUT'
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error al marcar recordatorio como tomado:', error);
    throw error;
  }
}