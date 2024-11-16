import React, { useState } from 'react';
import { FaWallet, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Operaciones css/ProyeccionValor.css';

function ProyeccionValor() {
  const [principal, setPrincipal] = useState('');
  const [tasa, setTasa] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const calcularValorFuturo = () => {
    if (principal === '' || tasa === '' || tiempo === '') {
      alert("Por favor, complete todos los campos antes de calcular el valor futuro.");
      return;
    }
    const res = principal * Math.pow((1 + tasa / 100), tiempo);
    setResultado(res.toFixed(2));
  };

  return (
    <div className="proyeccion-valor-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
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
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Proyección de Valor Futuro y Presente</h2>
          <div className="form-group mt-4">
            <label style={{ color: '#b3b3b3' }}>Capital Inicial (Principal):</label>
            <input
              type="number"
              className="form-control"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Ingrese el capital inicial"
            />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tasa de Interés (%):</label>
            <input
              type="number"
              className="form-control"
              value={tasa}
              onChange={(e) => setTasa(e.target.value)}
              placeholder="Ingrese la tasa de interés"
            />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tiempo (en años):</label>
            <input
              type="number"
              className="form-control"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              placeholder="Ingrese el tiempo en años"
            />
          </div>
          <button
            className="btn btn-success mt-4"
            style={{ width: '100%', fontWeight: 'bold', borderRadius: '25px', backgroundColor: '#4caf50', border: 'none' }}
            onClick={calcularValorFuturo}
          >
            Calcular Valor Futuro
          </button>
          {resultado && (
            <div className="resultado mt-4" style={{ color: '#4caf50', fontSize: '1.5em', textAlign: 'center' }}>
              Valor Futuro: {resultado}
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

export default ProyeccionValor;
