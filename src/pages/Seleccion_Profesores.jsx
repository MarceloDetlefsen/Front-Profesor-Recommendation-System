import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Seleccion_Profesores = () => {
  const { cursoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [assignmentStatus, setAssignmentStatus] = useState(null);

  // Obtener datos del curso y estudiante del estado de navegación
  const courseData = location.state?.course;
  const studentName = location.state?.studentName || "JEREZ MELGAR, ALEJANDRO MANUEL";

  useEffect(() => {
    fetchProfesores();
  }, [cursoId, studentName]);

  const fetchProfesores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener recomendaciones de profesores para el estudiante
      const response = await apiService.getRecomendaciones(studentName, 5);
      
      if (response.data && Array.isArray(response.data)) {
        // Filtrar profesores que enseñen el curso específico (si tienes esa información)
        // Por ahora mostramos todos los profesores recomendados
        const profesoresData = response.data.map(prof => ({
          id: prof.id || prof.nombre,
          nombre: prof.nombre,
          puntuacion: prof.puntuacion_compatibilidad || prof.score || 0,
          especialidad: prof.especialidad || 'No especificada',
          metodologia: prof.metodologia_preferida || 'No especificada',
          experiencia: prof.experiencia || 'No especificada'
        }));
        
        setProfesores(profesoresData);
      } else {
        // Datos de ejemplo si no hay respuesta de la API
        const ejemploProfesores = [
          {
            id: 'prof1',
            nombre: 'Dr. María González',
            puntuacion: 0.95,
            especialidad: 'Matemáticas',
            metodologia: 'Práctica',
            experiencia: '10 años'
          },
          {
            id: 'prof2',
            nombre: 'Ing. Carlos Rodríguez',
            puntuacion: 0.87,
            especialidad: 'Matemáticas Aplicadas',
            metodologia: 'Teórica',
            experiencia: '8 años'
          },
          {
            id: 'prof3',
            nombre: 'Dra. Ana Martínez',
            puntuación: 0.82,
            especialidad: 'Álgebra',
            metodologia: 'Mixta',
            experiencia: '12 años'
          }
        ];
        setProfesores(ejemploProfesores);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profesores:', err);
      
      // Datos de ejemplo en caso de error
      const fallbackProfesores = [
        {
          id: 'prof1',
          nombre: 'Dr. María González',
          puntuacion: 0.95,
          especialidad: 'Matemáticas',
          metodologia: 'Práctica',
          experiencia: '10 años'
        },
        {
          id: 'prof2',
          nombre: 'Ing. Carlos Rodríguez',
          puntuacion: 0.87,
          especialidad: 'Matemáticas Aplicadas',
          metodologia: 'Teórica',
          experiencia: '8 años'
        }
      ];
      setProfesores(fallbackProfesores);
    } finally {
      setLoading(false);
    }
  };

  const handleProfesorSelect = (profesor) => {
    setSelectedProfesor(profesor);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedProfesor) return;

    try {
      setAssignmentStatus('loading');
      
      // Registrar la asignación (simulada)
      await apiService.registrarAprobacion(
        studentName,
        selectedProfesor.nombre,
        courseData?.code || cursoId
      );
      
      setAssignmentStatus('success');
      
      // Redirigir después de un momento
      setTimeout(() => {
        navigate('/cursos');
      }, 2000);
      
    } catch (err) {
      console.error('Error al asignar profesor:', err);
      setAssignmentStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar Name={studentName} />
        <div className="ml-64 flex-1 w-full">
          <Header />
          <div className="p-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-xl text-gray-600">Cargando profesores recomendados...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar Name={studentName} />
      <div className="ml-64 flex-1 w-full">
        <Header />
        <div className="p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/cursos')}
              className="text-teal-600 hover:text-teal-800 flex items-center mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a cursos
            </button>
            
            <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-4">
              Profesores Recomendados
            </h1>
            
            {courseData && (
              <div className="bg-teal-50 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-teal-800">{courseData.name}</h2>
                <p className="text-teal-600">Código: {courseData.code}</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Advertencia:</strong> {error}
              <br />
              <small>Mostrando datos de ejemplo</small>
            </div>
          )}

          <div className="grid gap-4 mb-6">
            {profesores.map((profesor) => (
              <div
                key={profesor.id}
                className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                  selectedProfesor?.id === profesor.id
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                }`}
                onClick={() => handleProfesorSelect(profesor)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {profesor.nombre}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Especialidad:</span> {profesor.especialidad}
                      </div>
                      <div>
                        <span className="font-medium">Metodología:</span> {profesor.metodologia}
                      </div>
                      <div>
                        <span className="font-medium">Experiencia:</span> {profesor.experiencia}
                      </div>
                      <div>
                        <span className="font-medium">Compatibilidad:</span> 
                        <span className="ml-1 font-bold text-teal-600">
                          {Math.round(profesor.puntuacion * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end">
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-teal-600">
                        {Math.round(profesor.puntuacion * 100)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Score</span>
                  </div>
                </div>
                
                {selectedProfesor?.id === profesor.id && (
                  <div className="mt-4 p-3 bg-white rounded border border-teal-200">
                    <div className="flex items-center text-teal-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Profesor seleccionado
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {profesores.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No hay profesores disponibles para este curso</div>
            </div>
          )}

          {selectedProfesor && (
            <div className="flex justify-center">
              <button
                onClick={handleConfirmAssignment}
                disabled={assignmentStatus === 'loading'}
                className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300 ${
                  assignmentStatus === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {assignmentStatus === 'loading' ? 'Asignando...' : 'Confirmar Asignación'}
              </button>
            </div>
          )}

          {assignmentStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded text-center">
              ¡Asignación exitosa! Redirigiendo...
            </div>
          )}

          {assignmentStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
              Error al realizar la asignación. Por favor, inténtelo de nuevo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Seleccion_Profesores;