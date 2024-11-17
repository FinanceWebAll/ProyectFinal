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
                <Link className="nav-link text-light" to="/explorar-operaciones">Explorar Operaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Cartera">Cartera</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/historial">Historial</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/facturacion">Facturación</Link> {/* Nuevo enlace */}
              </li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <Link to="/perfil" className="nav-link text-light d-flex align-items-center">
              <FaUserCircle size={30} color="#4caf50" />
            </Link>
            <button onClick={handleLogout} className="btn btn-link nav-link text-light d-flex align-items-center" style={{ textDecoration: 'none' }}>
              <FaSignOutAlt size={30} color="#4caf50" style={{ marginLeft: '15px' }} />
            </button>
          </div>
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

                  {/* Mostrar datos específicos según la descripción */}
                  {operacion.descripcion === 'Indicadores de Rentabilidad (VAN)' && (
  <div>
    <p><strong>Tasa de Descuento:</strong> {operacion.tasaDescuento}%</p>
    {operacion.flujos.map((flujo, flujoIndex) => (
      <div key={flujoIndex}>
        <h6><strong>Periodo {flujoIndex + 1}</strong></h6> {/* Añadir número del periodo */}
        <p><strong>Año:</strong> {flujo.anio}</p>
        <p><strong>Flujo de Caja:</strong> {flujo.flujo}</p>
      </div>
    ))}
    {operacion.resultado !== undefined && (
      <p><strong>Resultado VAN Total:</strong> {operacion.resultado}</p>
    )}
  </div>
)}


                  {operacion.descripcion === 'Generador de Flujos de Caja' && (
                    <div>
                      {operacion.flujos.map((flujo, flujoIndex) => (
                        <div key={flujoIndex}>
                          <h6><strong>Periodo {flujo.periodo}</strong></h6>
                          <p><strong>Ingresos:</strong> {flujo.ingresos}</p>
                          <p><strong>Costos:</strong> {flujo.costos}</p>
                          <p><strong>Flujo de Caja:</strong> {flujo.flujoNeto}</p>
                        </div>
                      ))}
                      {operacion.flujoTotal && (
                        <p><strong>Flujo de Caja Total:</strong> {operacion.flujoTotal}</p>
                      )}
                    </div>
                  )}

                  {operacion.descripcion === 'Simulación de Planes de Pago' && (
                    <div>
                      <p><strong>Monto del préstamo:</strong> {operacion.monto}</p>
                      <p><strong>Número de cuotas:</strong> {operacion.cuotas}</p>
                      <p><strong>Tasa de interés (% anual):</strong> {operacion.tasaInteres}%</p>
                      <p><strong>Cuota mensual:</strong> {operacion.cuotaMensual}</p>
                    </div>
                  )}

                  {operacion.descripcion !== 'Generador de Flujos de Caja' &&
                    operacion.descripcion !== 'Indicadores de Rentabilidad (VAN)' &&
                    operacion.descripcion !== 'Simulación de Planes de Pago' && (
                      <>
                        {operacion.capital && (
                          <p><strong>Capital Inicial:</strong> {operacion.capital}</p>
                        )}
                        {operacion.tasa && <p><strong>Tasa de Interés:</strong> {operacion.tasa}%</p>}
                        {operacion.tiempo && <p><strong>Tiempo:</strong> {operacion.tiempo} años</p>}
                        {operacion.monto && <p><strong>Monto Final:</strong> {operacion.monto}</p>}
                        {operacion.tcea && <p><strong>TCEA:</strong> {operacion.tcea}%</p>}
                        {operacion.tasaAnual && (
                          <p><strong>Tasa Anual:</strong> {operacion.tasaAnual}%</p>
                        )}
                      </>
                    )}

                  {/* Mostrar la fecha solo una vez */}
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
