import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos del estudiante (estos podrían venir de un contexto o estado global)
  const studentName = "JEREZ MELGAR, ALEJANDRO MANUEL";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar obtener cursos de la API (ajusta según tu backend)
      // Por ahora, usaremos datos de ejemplo hasta que tengas la ruta de cursos
      const exampleCourses = [
        { id: 'CALC1', name: 'Cálculo 1', code: 'MAT101' },
        { id: 'ALG1', name: 'Álgebra Lineal 1', code: 'MAT102' },
        { id: 'EST1', name: 'Estadística 1', code: 'EST101' }
      ];
      
      setCourses(exampleCourses);
      
      // Verificar que la API esté funcionando
      await apiService.healthCheck();
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching courses:', err);
      
      // En caso de error, usar datos de ejemplo
      const fallbackCourses = [
        { id: 'CALC1', name: 'Cálculo 1', code: 'MAT101' },
        { id: 'ALG1', name: 'Álgebra Lineal 1', code: 'MAT102' },
        { id: 'EST1', name: 'Estadística 1', code: 'EST101' }
      ];
      setCourses(fallbackCourses);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    // Navegar a la página de selección de profesores pasando información del curso
    navigate(`/cursos/${course.id}`, { 
      state: { 
        course: course,
        studentName: studentName
      } 
    });
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
              <div className="text-xl text-gray-600">Cargando cursos...</div>
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
          <h1 className="text-3xl font-bold text-teal-600 border-b-2 border-teal-500 pb-2 mb-10">
            Asignación de Cursos
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
              <br />
              <small>Mostrando datos de ejemplo</small>
            </div>
          )}

          <div className="space-y-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                className="block bg-white hover:bg-gray-50 border border-gray-200 hover:border-teal-300 p-6 w-full text-left rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">Código: {course.code}</p>
                  </div>
                  <div className="text-teal-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {courses.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No hay cursos disponibles</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;