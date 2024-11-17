import React, { useState } from 'react';
import { FaWallet, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Operaciones css/SimulacionPago.css';

function SimulacionPago() {
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('');
  const [tasaInteres, setTasaInteres] = useState('');
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const calcularCuotas = () => {
    if (monto === '' || cuotas === '' || tasaInteres === '') {
      alert("Por favor, complete todos los campos antes de calcular la cuota mensual.");
      return;
    }
    const tasaMensual = (tasaInteres / 100) / 12;
    const cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas));
    setResultado(cuota.toFixed(2));
  };

  return (
    <div className="simulacion-pago-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      {}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1f1f1f' }}>
        <div className="container d-flex justify-content-between align-items-center">
          {}
          <Link className="navbar-brand text-light d-flex align-items-center" to="/explorar-operaciones">
            <FaWallet size={30} color="#4caf50" style={{ marginRight: '10px' }} />
          </Link>

          {}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-light" to="/home">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/explorar-operaciones">Explorar Operaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/historial">Historial</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/facturacion">Facturación</Link>
              </li>
            </ul>
          </div>

          {}
          <Link to="/perfil" className="nav-link text-light d-flex align-items-center">
            <FaUserCircle size={30} color="#4caf50" />
          </Link>
        </div>
      </nav>

      {}
      <div className="container mt-5">
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Simulación de Planes de Pago</h2>
          <div className="form-group mt-4">
            <label style={{ color: '#b3b3b3' }}>Monto del Préstamo:</label>
            <input
              type="number"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto del préstamo"
            />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Número de Cuotas:</label>
            <input
              type="number"
              className="form-control"
              value={cuotas}
              onChange={(e) => setCuotas(e.target.value)}
              placeholder="Ingrese el número de cuotas"
            />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tasa de Interés (% anual):</label>
            <input
              type="number"
              className="form-control"
              value={tasaInteres}
              onChange={(e) => setTasaInteres(e.target.value)}
              placeholder="Ingrese la tasa de interés anual"
            />
          </div>
          <button
            className="btn btn-success mt-4"
            style={{ width: '100%', fontWeight: 'bold', borderRadius: '25px', backgroundColor: '#4caf50', border: 'none' }}
            onClick={calcularCuotas}
          >
            Calcular Cuota Mensual
          </button>
          {resultado && (
            <div className="resultado mt-4" style={{ color: '#4caf50', fontSize: '1.5em', textAlign: 'center' }}>
              Cuota Mensual: {resultado}
            </div>
          )}

          {}
          <button
            className="btn btn-secondary mt-4"
            style={{ width: '100%', border: 'none', borderRadius: '25px' }}
            onClick={() => navigate('/explorar-operaciones')}
          >
            Volver a Explorar Operaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimulacionPago;
