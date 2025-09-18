import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import './MedicationDetail.css';

export default function MedicationDetail() {
  const { id } = useParams(); // id del medicamento
//   const location = useLocation();
//   const [medication, setMedication] = useState(location.state?.medication || null);
//   const [loading, setLoading] = useState(!medication);
//   const [error, setError] = useState(null);

   const mockMedications = [
    { id: 1, name: "Ibuprofeno", dose: "400mg", frequency: "Cada 8 horas", time: "08:00", startDate: "2025-09-18", endDate: "2025-09-25" },
    { id: 2, name: "Metformina", dose: "500mg", frequency: "2 veces al día", time: "09:00", startDate: "2025-09-18", endDate: "2025-10-18" },
    { id: 3, name: "Amoxicilina", dose: "250mg", frequency: "Cada 12 horas", time: "07:00", startDate: "2025-09-18", endDate: "2025-09-25" },
  ];
   const medication = mockMedications.find(m => m.id === parseInt(id));
    if (!medication) {
    return <p>Medicamento no encontrado</p>;
  }


//   useEffect(() => {
//     // Si ya tenemos medication por state, no hacemos fetch
//     if (medication) return;

//     // Fetch al backend para obtener el medicamento por id
//     const fetchMedication = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`http://localhost:5000/medicationdetail/${id}`); 
//         if (!response.ok) throw new Error("Medicamento no encontrado");
//         const data = await response.json();
//         setMedication(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMedication();
//   }, [id, medication]);

//   if (loading) return <p>Cargando medicamento...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!medication) return <p>Medicamento no encontrado</p>;

  return (
    <div className="medication-detail">
      <h2 className="medication-title">{medication.name}</h2>

      <div className="detail-field">
        <span className="label">Dosis:</span>
        <span className="value">{medication.dose}</span>
       
      </div>

      <div className="detail-field">
        <span className="label">Frecuencia:</span>
        <span className="value">{medication.frequency}</span>
      </div>

      <div className="detail-field">
        <span className="label">Hora de la primera toma:</span>
        <span className="value">{medication.time}</span>
      </div>

      <div className="detail-field">
        <span className="label">Fecha de inicio de toma:</span>
        <span className="value">{medication.startDate}</span>
      </div>

      <div className="detail-field">
        <span className="label">Fecha de fin de toma:</span>
        <span className="value">{medication.endDate}</span>
      </div>
    </div>
  );
}