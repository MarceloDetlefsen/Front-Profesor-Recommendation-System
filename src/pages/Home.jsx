import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import Card_Estudiante from '../Components/Cards/Card_Estudiante';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Dashboard = () => {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Nombre del estudiante - esto podría venir de un contexto de autenticación
    const studentName = "JEREZ MELGAR, ALEJANDRO MANUEL";

    useEffect(() => {
        fetchStudentData();
        checkApiHealth();
    }, []);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Intentar obtener datos del estudiante desde la API
            const response = await apiService.getEstudiante(studentName);
            
            if (response.data) {
                setStudentData(response.data);
            } else {
                // Si no se encuentran datos en la API, usar datos por defecto
                setDefaultStudentData();
            }
            
        } catch (err) {
            console.error('Error fetching student data:', err);
            setError(err.message);
            // Usar datos por defecto en caso de error
            setDefaultStudentData();
        } finally {
            setLoading(false);
        }
    };

    const setDefaultStudentData = () => {
        setStudentData({
            nombre: "JEREZ MELGAR, ALEJANDRO MANUEL",
            carne: "2023-12345",
            carrera: "7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN",
            pensum: "RENOVACIÓN CURRICULAR 2022",
            promedio_ciclo_anterior: 90,
            grado: 2,
            carga_maxima: "Puede asignarse un máximo de 8 cursos"
        });
    };

    const checkApiHealth = async () => {
        try {
            await apiService.healthCheck();
            console.log('API connection successful');
        } catch (err) {
            console.warn('API connection failed:', err.message);
        }
    };

    const handleNavigateToCourses = () => {
        navigate('/cursos');
    };

    if (loading) {
        return (
            <div className="flex">
                <Sidebar Name={studentName} />
                <div className="ml-64 flex-1 w-full">
                    <Header />
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                            Asignación de Cursos
                        </h1>
                        <div className="flex justify-center items-center h-64">
                            <div className="text-xl text-gray-600">Cargando información del estudiante...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar Name={studentData?.nombre || studentName} />
            <div className="ml-64 flex-1 w-full">
                <Header />
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
                        Asignación de Cursos
                    </h1>

                    {error && (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>
                                    <strong>Conexión limitada:</strong> {error}
                                </span>
                            </div>
                            <p className="text-sm mt-1">Mostrando información local del estudiante.</p>
                        </div>
                    )}

                    <div className="flex justify-center mt-8">
                        <Card_Estudiante
                            Carne={studentData?.carne || "2023-12345"}
                            Name={studentData?.nombre || "JEREZ MELGAR, ALEJANDRO MANUEL"}
                            Carrera={studentData?.carrera || "7010 - LICENCIATURA EN INGENIERÍA EN CIENCIA DE LA COMPUTACIÓN Y TECNOLOGÍAS DE LA INFORMACIÓN"}
                            Pensum={studentData?.pensum || "RENOVACIÓN CURRICULAR 2022"}
                            Promedio_Ciclo_Anterior={studentData?.promedio_ciclo_anterior || "90"}
                            Grado={studentData?.grado || "2"}
                            Carga_MAX={studentData?.carga_maxima || "Puede asignarse un máximo de 8 cursos"}
                        />
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleNavigateToCourses}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Asignarse Cursos
                        </button>
                    </div>

                    {/* Indicador de estado de la conexión API */}
                    <div className="mt-8 flex justify-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            error 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {error ? 'Modo sin conexión' : 'Conectado al sistema'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;