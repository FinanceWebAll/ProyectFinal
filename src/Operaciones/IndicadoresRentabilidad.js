import React, { useState } from 'react';
import { FaWallet, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Operaciones css/IndicadoresRentabilidad.css';

function IndicadoresRentabilidad() {
  const [flujos, setFlujos] = useState([{ anio: '', flujo: '' }]);
  const [tasaDescuento, setTasaDescuento] = useState('');
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const values = [...flujos];
    values[index][event.target.name] = event.target.value;
    setFlujos(values);
  };

  const agregarFlujo = () => {
    setFlujos([...flujos, { anio: '', flujo: '' }]);
  };

  const calcularVAN = () => {
    if (tasaDescuento === '' || flujos.some(flujo => flujo.anio === '' || flujo.flujo === '')) {
      alert("Por favor, complete todos los campos antes de calcular el VAN.");
      return;
    }

    let van = 0;
    flujos.forEach(({ anio, flujo }) => {
      van += parseFloat(flujo) / Math.pow(1 + tasaDescuento / 100, parseInt(anio));
    });
    setResultado(van.toFixed(2));
  };

  return (
    <div className="indicadores-rentabilidad-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
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
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Indicadores de Rentabilidad (VAN, TIR)</h2>

          {}
          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tasa de Descuento (%):</label>
            <input
              type="number"
              className="form-control"
              value={tasaDescuento}
              onChange={(e) => setTasaDescuento(e.target.value)}
              placeholder="Ingrese la tasa de descuento"
            />
          </div>

          {}
          {flujos.map((flujo, index) => (
            <div key={index} className="form-group mt-4">
              <h5 style={{ color: '#4caf50' }}>Año {index + 1}:</h5>
              <div className="form-group mt-2">
                <label style={{ color: '#b3b3b3' }}>Año:</label>
                <input
                  type="number"
                  name="anio"
                  placeholder="Ingrese el año"
                  value={flujo.anio}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control mb-2"
                />
              </div>
              <div className="form-group mt-2">
                <label style={{ color: '#b3b3b3' }}>Flujo de Caja:</label>
                <input
                  type="number"
                  name="flujo"
                  placeholder="Ingrese el flujo de caja"
                  value={flujo.flujo}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                />
              </div>
            </div>
          ))}

          {}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" onClick={agregarFlujo}>
              Agregar Año
            </button>
            <button className="btn btn-success" onClick={calcularVAN}>
              Calcular VAN
            </button>
          </div>

          {}
          {resultado && (
            <div className="resultado mt-4" style={{ color: '#4caf50', fontSize: '1.5em', textAlign: 'center' }}>
              VAN: {resultado}
            </div>
          )}

          {}
          <button
            className="btn btn-secondary mt-4"
            style={{ width: '100%', border: 'none' }}
            onClick={() => navigate('/explorar-operaciones')}
          >
            Volver a Explorar Operaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default IndicadoresRentabilidad;
