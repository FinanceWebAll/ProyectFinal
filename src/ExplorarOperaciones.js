import React from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import './ExplorarOperaciones.css';

function ExplorarOperaciones() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="explorar-operaciones-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>

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
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)', color: '#b3b3b3' }}>
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Explorar Operaciones</h2>

          <div className="row">
            
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Cálculo de Tasas de Interés</h5>
                <p>Calcula la tasa de interés simple, compuesta, y efectiva, además de realizar conversiones entre tipos de tasas.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/calculo-tasas')}
                >
                  Calcular Tasas
                </button>
              </div>
            </div>

            
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Proyecciones de Valor Futuro y Valor Presente</h5>
                <p>Calcula el valor presente y futuro para visualizar cuánto podría valer una inversión o cuánto se necesita hoy para una meta futura.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/proyeccion-valor')}
                >
                  Proyectar Valor
                </button>
              </div>
            </div>

           
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Indicadores de Rentabilidad</h5>
                <p>Calcula el VAN, la TIR y otros indicadores que evalúan la viabilidad de proyectos de inversión.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/indicadores-rentabilidad')}
                >
                  Calcular Indicadores
                </button>
              </div>
            </div>

            
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Simulaciones de Planes de Pago</h5>
                <p>Visualiza diferentes tipos de planes de pago y calcula cuotas para préstamos (americano, francés, etc.).</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/simulacion-pago')}
                >
                  Simular Pagos
                </button>
              </div>
            </div>

            
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Evaluación de Instrumentos Financieros</h5>
                <p>Realiza cálculos relacionados con bonos y acciones, incluyendo el cálculo de la TCEA.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/evaluacion-instrumentos')}
                >
                  Evaluar Instrumentos
                </button>
              </div>
            </div>

          
            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Generador de Flujos de Caja para Proyectos</h5>
                <p>Simula flujos de caja y evalúa proyectos de inversión.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/generador-flujo-caja')}
                >
                  Generar Flujos de Caja
                </button>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card p-3" style={{ backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                <h5 style={{ color: '#4caf50' }}>Wacc</h5>
                <p>Calcula el Costo Promedio Ponderado de Capital (Wacc) considerando Precio de la acción, Tasa de crecimiento, Último dividendo y Costo de flotación.</p>
                <button
                  className="btn btn-success mt-2"
                  style={{ backgroundColor: '#4caf50', border: 'none' }}
                  onClick={() => navigate('/wacc')}
                >
                  Calcular Wacc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplorarOperaciones;
