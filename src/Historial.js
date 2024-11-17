import React, { useEffect, useState } from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import './Historial.css';

function Historial() {
  const [operaciones, setOperaciones] = useState([]);
  const navigate = useNavigate();

  const cargarHistorial = () => {
    const historialGuardado = JSON.parse(localStorage.getItem('historialOperaciones')) || [];
    setOperaciones(historialGuardado); // Cargar operaciones en el estado
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirige a la página de inicio después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="historial-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1f1f1f' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-light d-flex align-items-center" to="/home">
            <FaWallet size={30} color="#4caf50" style={{ marginRight: '10px' }} />
          </Link>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/home">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/explorar-operaciones">Realizar Operación</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/historial">Historial</Link>
              </li>
            </ul>
          </div>

          <Link to="/perfil" className="nav-link text-light d-flex align-items-center">
            <FaUserCircle size={30} color="#4caf50" />
          </Link>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Historial de Operaciones</h2>
          <div className="list-group">
            {operaciones.length === 0 ? (
              <p className="text-center text-light">No hay operaciones realizadas aún.</p>
            ) : (
              operaciones.map((operacion, index) => (
                <div className="list-group-item" key={index} style={{ backgroundColor: '#1f1f1f', color: '#fff' }}>
                  <p><strong>Descripción:</strong> {operacion.descripcion}</p>

                  {/* Para "Indicadores de Rentabilidad (VAN)", no mostrar Capital Inicial y el título Flujos de Caja */}
                  {operacion.descripcion === 'Indicadores de Rentabilidad (VAN)' && (
                    <div>
                      <p><strong>Tasa de Descuento:</strong> {operacion.tasaDescuento}%</p>
                      {operacion.flujos.map((flujo, flujoIndex) => (
                        <div key={flujoIndex}>
                          <h6><strong>AÑO {flujoIndex + 1}</strong></h6>
                          <p><strong>Año:</strong> {flujo.anio}</p>
                          <p><strong>Flujo de Caja:</strong> {flujo.flujo}</p>
                        </div>
                      ))}
                      {operacion.resultado !== undefined && (
                        <p><strong>Resultado VAN Total:</strong> {operacion.resultado}</p>
                      )}
                    </div>
                  )}

                  {/* Para las demás operaciones */}
                  {operacion.descripcion !== 'Indicadores de Rentabilidad (VAN)' && (
                    <>
                      <p><strong>Capital Inicial:</strong> {operacion.capital}</p>
                      {operacion.tasa && <p><strong>Tasa de Interés:</strong> {operacion.tasa}%</p>}
                      {operacion.tiempo && <p><strong>Tiempo:</strong> {operacion.tiempo} años</p>}
                      {operacion.monto && <p><strong>Monto Final:</strong> {operacion.monto}</p>}
                      {operacion.tcea && <p><strong>TCEA:</strong> {operacion.tcea}%</p>}
                      {operacion.descripcion === 'Evaluación de Instrumentos Financieros' && operacion.tasaAnual && (
                        <p><strong>Tasa Anual:</strong> {operacion.tasaAnual}%</p>
                      )}
                    </>
                  )}

                  {/* Mostrar la fecha solo al final */}
                  <p><strong>Fecha:</strong> {operacion.fecha}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historial;
