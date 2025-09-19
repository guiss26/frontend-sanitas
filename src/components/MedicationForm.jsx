import React from "react";
import { useForm } from "react-hook-form";
import "./MedicationForm.css";

export default function MedicationForm({ defaultValues = {}, onSubmit, buttonLabel = "Guardar" }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, // 🔹 aquí importamos watch
    } = useForm({ defaultValues });

    const selectedFrequency = watch("frequency"); // ahora sí funciona

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="medication-form">
            <div className="form-field">
                <label className="name-input">Nombre:</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        {...register("name", { required: "Campo obligatorio" })}
                        className={errors.name ? "error-input" : ""}
                    />
                    {errors.name && <span className="error-inside">{errors.name.message}</span>}
                </div>

            </div>

            <div className="form-field">
                <label className="dosis-input">Dosis:</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        {...register("dose", { required: "Campo obligatorio" })}
                        className={errors.dose ? "error-input" : ""}
                    />
                    {errors.name && <span className="error-inside">{errors.name.message}</span>}
                </div>
            </div>

            <div className="form-field input-wrapper">
                <label className="frecuence-input">Frecuencia:</label>
                <select
                    {...register("frequency", { required: "Este campo es obligatorio" })}
                >
                    <option value="">-- Selecciona una opción --</option>
                    <option value="una-vez-al-dia">Una vez al día</option>
                    <option value="dos-veces-al-dia">Dos veces al día</option>
                    <option value="tres-veces-al-dia">Tres veces al día</option>
                    <option value="cuatro-veces-al-dia">Cuatro veces al día</option>
                    <option value="cada-cuatro-horas">Cada 4 horas</option>
                    <option value="cada-seis-horas">Cada 6 horas</option>
                    <option value="cada-ocho-horas">Cada 8 horas</option>
                    <option value="una-vez-semana">Una vez a la semana</option>
                    <option value="dos-veces-semana">Dos veces a la semana</option>
                </select>

                {errors.frequency && (
                    <span className="error-inside">{errors.frequency.message}</span>
                )}
            </div>

            <div className="form-field input-wrapper">
                <label className="data-input">Hora de la primera toma:</label>
                <input
                    type="time"
                    {...register("time", { required: "Selecciona la hora" })}
                />
                {errors.time && (
                    <span className="error-inside">{errors.time.message}</span>
                )}
            </div>

            <div className="form-field input-wrapper">
                <label className="data-input">Fecha de inicio de toma:</label>
                <input
                    type="date"
                    {...register("startDate", { required: "Selecciona la fecha de inicio" })}
                />
                {errors.startDate && (
                    <span className="error-inside">{errors.startDate.message}</span>
                )}
            </div>

            <div className="form-field input-wrapper">
                <label className="data-input">Fecha de fin de toma:</label>
                <input
                    type="date"
                    {...register("endDate", { required: "Selecciona la fecha de fin" })}
                />
                {errors.endDate && (
                    <span className="error-inside">{errors.endDate.message}</span>
                )}
            </div>
            <button type="submit">{buttonLabel}</button>
        </form>
    );
}