import React, { useState } from 'react';
import { FaWallet, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import '../Operaciones css/CalculoTasas.css';

function CalculoTasas() {
  const [tipoTasa, setTipoTasa] = useState('simple');
  const [principal, setPrincipal] = useState('');
  const [tasa, setTasa] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [detalles, setDetalles] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const calcularTasa = async () => {
    setError('');
    setResultado(null);
    setDetalles(null);

    if (!principal || !tasa || !tiempo || parseFloat(principal) <= 0 || parseFloat(tasa) <= 0 || parseFloat(tiempo) <= 0) {
      setError('Por favor, completa todos los campos con valores positivos.');
      return;
    }

    const P = parseFloat(principal);
    const rAnual = parseFloat(tasa) / 100; // Tasa anual
    const rMensual = rAnual / 12; // Tasa mensual
    const t = parseFloat(tiempo); // Tiempo en años
    const n = t * 12; // Tiempo en meses

    let pagoMensual, interesTotal, total;

    try {
      if (tipoTasa === 'simple') {
        // Cálculo de interés simple
        total = P * (1 + rAnual * t);
        interesTotal = total - P;
        pagoMensual = total / n;
      } else if (tipoTasa === 'compuesta') {
        // Cálculo de interés compuesto
        pagoMensual = P * (rMensual * Math.pow(1 + rMensual, n)) / (Math.pow(1 + rMensual, n) - 1);
        total = pagoMensual * n;
        interesTotal = total - P;
      }

      const resultadoFinal = total.toFixed(2);

      setResultado(resultadoFinal);
      setDetalles({
        pagoMensual: pagoMensual.toFixed(2),
        interesTotal: interesTotal.toFixed(2),
        total: resultadoFinal,
      });

      // Guardar en Firebase
      const operacion = {
        descripcion: 'Cálculo de Tasa de Interés',
        tipoTasa,
        principal,
        tasa,
        tiempo,
        resultado: resultadoFinal,
        fecha: new Date().toLocaleString(),
      };

      await addDoc(collection(db, 'historialOperaciones'), operacion);
    } catch (error) {
      setError('Error al calcular o guardar la operación. Inténtalo nuevamente.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="calculo-tasas-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1f1f1f' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand text-light d-flex align-items-center" to="/explorar-operaciones">
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
                <Link className="nav-link text-light" to="/historial">Historial</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/facturacion">Facturación</Link>
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
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Cálculo de Tasas de Interés</h2>
          {error && (
            <div className="alert alert-danger" style={{ fontSize: '1rem' }}>
              {error}
            </div>
          )}
          <div className="form-group mt-4">
            <label style={{ color: '#b3b3b3' }}>Tipo de Tasa:</label>
            <select className="form-control" value={tipoTasa} onChange={(e) => setTipoTasa(e.target.value)}>
              <option value="simple">Tasa Simple</option>
              <option value="compuesta">Tasa Compuesta</option>
            </select>
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Capital Inicial (Principal):</label>
            <input type="number" className="form-control" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tasa de Interés (%):</label>
            <input type="number" className="form-control" value={tasa} onChange={(e) => setTasa(e.target.value)} />
          </div>
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tiempo (en años):</label>
            <input type="number" className="form-control" value={tiempo} onChange={(e) => setTiempo(e.target.value)} />
          </div>
          <button className="btn btn-success mt-4" style={{ width: '100%', backgroundColor: '#4caf50', border: 'none' }} onClick={calcularTasa}>
            Calcular
          </button>
          {resultado && detalles && (
            <div className="resultado mt-4" style={{ color: '#4caf50', fontSize: '1.2em', textAlign: 'center' }}>
              <p><strong>Pago Mensual:</strong> S/ {detalles.pagoMensual}</p>
              <p><strong>Interés Total:</strong> S/ {detalles.interesTotal}</p>
              <p><strong>Total P&I:</strong> S/ {detalles.total}</p>
            </div>
          )}
          <button className="btn btn-secondary mt-4" style={{ width: '100%', border: 'none' }} onClick={() => navigate('/explorar-operaciones')}>
            Volver a Explorar Operaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalculoTasas;
