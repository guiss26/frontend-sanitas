import { useNavigate } from 'react-router-dom';
import MedicationForm from "../components/MedicationForm";
import { createMedication } from '../services/MedicationsServices';
import "./AddMedication.css"
import ResetButton from "../components/resetButton/ResetButton.jsx"

const AddMedication = () => {
    const navigate = useNavigate();

    const handleAddMedication = async (data) => {
        console.log("Datos del formulario:", data);

        try {
            // Call the real API
            await createMedication(data);

            // Navigate back to medication list on success
            navigate('/medication');

        } catch (error) {
            console.error('Error creating medication:', error);
            // Error handling is already done in the service with SweetAlert
        }
    };

    return (
        <>
            <div className="add-medication-page">
                <div className="form-container">
                    <h1>Añade tu nueva medicación</h1>
                    <MedicationForm onSubmit={handleAddMedication} buttonLabel="Guardar" />
                </div>
            </div>
            {/* <ResetButton></ResetButton> */}
        </>
    )
}

export default AddMedication