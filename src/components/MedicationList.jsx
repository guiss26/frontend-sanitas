import { useState, useEffect } from 'react'
import MedicationItem from './MedicationItem';
import { getAllMedications } from '../services/MedicationsServices';
import './MedicationList.css'

const MedicationList = () => {
    const [medications, setMedications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchMedications = async () => {
        try {
            setLoading(true)
            setError(null)

            // Use the real API service
            const data = await getAllMedications();

            // Transform backend data to frontend format
            const transformedData = data.map(med => ({
                id: med.id,
                name: med.name,
                dosage: med.dose,
                frequency: med.frequencyDisplay,
                type: 'eventual', // You might want to add type field to backend
                notes: `Hora: ${med.timeToTake}`,
                dose: med.dose,
                time: med.timeToTake,
                startDate: new Date().toISOString().split('T')[0], // Default to today
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Default to 7 days
            }));

            setMedications(transformedData);
            setLoading(false);

        } catch (err) {
            console.log('Error al cargar los medicamentos', err)
            setError('Error al cargar los medicamentos')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedications()
    }, [])

    if (loading) {
        return (
            <div className="empty-state-style">
                <p>Cargando medicamentos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-style">
                <p className='paragraph'>{error}</p>
                <button onClick={fetchMedications} className='button-retry'>Reintentar</button>
            </div>
        )
    }

    //estado vacío
    if (medications.length === 0) {
        return (
            <div className="empty-state-style">
                <p>No hay medicamentos registrados</p>
                <button onClick={fetchMedications} className='button-update'>Actualizar</button>
            </div>
        )
    }

    //lista de medicamentos 
    return (
        <div className="list-style">
            {medications.map(medication => (
                <MedicationItem key={medication.id} medication={medication}></MedicationItem>
            ))}
        </div>
    )
}

export default MedicationList