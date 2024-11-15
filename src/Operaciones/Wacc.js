import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../Operaciones css/Wacc.css';  // Asegúrate de que la ruta de tu CSS sea correcta

function Wacc() {
  const navigate = useNavigate();

  // Datos de la primera parte
  const [precioAccion, setPrecioAccion] = useState('');
  const [tasaCrecimiento, setTasaCrecimiento] = useState('');
  const [ultimoDividendo, setUltimoDividendo] = useState('');
  const [costoFlotacion, setCostoFlotacion] = useState('');
  const [dividendoProyectado, setDividendoProyectado] = useState('');
  const [ks, setKs] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Variables que guardan los valores operativos
  const [crecimientoOperador, setCrecimientoOperador] = useState('');
  const [flotacionOperador, setFlotacionOperador] = useState('');

  // Datos de la segunda parte (Años)
  const [años, setAños] = useState('');  // Variable para el número de años
  const [segundoPaso, setSegundoPaso] = useState(false);  // Flag para mostrar la segunda parte

  const calcularWacc = () => {
    // Validar campos
    if (!precioAccion || !tasaCrecimiento || !ultimoDividendo || !costoFlotacion) {
      setErrorMessage("Por favor, ingrese todos los campos.");
      return;
    }
    setErrorMessage("");

    // Convertir tasa de crecimiento y costo de flotación a valores operacionales
    const crecimientoOperadorValue = tasaCrecimiento / 100;
    const flotacionOperadorValue = costoFlotacion / 100;

    setCrecimientoOperador(crecimientoOperadorValue);
    setFlotacionOperador(flotacionOperadorValue);

    // Dividendo proyectado: Último dividendo * (1 + Tasa de crecimiento)
    const dividendoProj = ultimoDividendo * (1 + crecimientoOperadorValue);
    setDividendoProyectado(dividendoProj.toFixed(7));  // Redondear a 7 decimales para operaciones

    // KS: (Dividendo proyectado / (Precio de la acción * (1 - Costo de flotación))) + Tasa de crecimiento
    const ksCalc = (dividendoProj / (precioAccion * (1 - flotacionOperadorValue))) + crecimientoOperadorValue;
    setKs((ksCalc * 100).toFixed(3));  // KS como porcentaje, con 3 decimales y multiplicado por 100

    // Mostrar la segunda parte (añadir años)
    setSegundoPaso(true);
  };

  return (
    <div className="wacc-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1f1f1f' }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-light" href="/home">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="/explorar-operaciones">Explorar Operaciones</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="/historial">Historial</a>
              </li>
            </ul>
          </div>
          <a href="/perfil" className="nav-link text-light d-flex align-items-center">
            <FaUserCircle size={30} color="#4caf50" />
          </a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones Comunes</h2>
          
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {/* Primera parte: Campos principales */}
          <div className="form-group mt-4">
            <label style={{ color: '#b3b3b3' }}>Precio de la Acción:</label>
            <input
              type="number"
              className="form-control"
              value={precioAccion}
              onChange={(e) => setPrecioAccion(e.target.value)}
              placeholder="Ingrese el precio de la acción"
            />
          </div>

          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Tasa de Crecimiento (%):</label>
            <input
              type="number"
              className="form-control"
              value={tasaCrecimiento}
              onChange={(e) => setTasaCrecimiento(e.target.value)}
              placeholder="Ingrese la tasa de crecimiento (%)"
            />
          </div>

          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Último Dividendo:</label>
            <input
              type="number"
              className="form-control"
              value={ultimoDividendo}
              onChange={(e) => setUltimoDividendo(e.target.value)}
              placeholder="Ingrese el último dividendo"
            />
          </div>

          <div className="form-group mt-3">
            <label style={{ color: '#b3b3b3' }}>Costo de Flotación (%):</label>
            <input
              type="number"
              className="form-control"
              value={costoFlotacion}
              onChange={(e) => setCostoFlotacion(e.target.value)}
              placeholder="Ingrese el costo de flotación (%)"
            />
          </div>

          <button
            className="btn btn-success mt-4"
            style={{ width: '100%', fontWeight: 'bold', borderRadius: '25px', backgroundColor: '#4caf50', border: 'none' }}
            onClick={calcularWacc}
          >
            Calcular
          </button>

          {/* Mostrar los resultados de la primera parte */}
          <div className="resultado mt-4" style={{ color: '#ffffff', fontSize: '1em', textAlign: 'center' }}>
            <p><strong>Datos Ingresados:</strong></p>
            <p><strong>Precio de la Acción:</strong> {precioAccion}</p>
            <p><strong>Tasa de Crecimiento:</strong> {tasaCrecimiento}%</p>
            <p><strong>Último Dividendo:</strong> {ultimoDividendo}</p>
            <p><strong>Costo de Flotación:</strong> {costoFlotacion}%</p>

            {/* Mostrar los resultados calculados de la primera parte */}
            {dividendoProyectado && ks && (
              <>
                <p><strong>Dividendo Proyectado:</strong> {parseFloat(dividendoProyectado).toFixed(2)}</p>
                <p><strong>KS:</strong> {ks}%</p>
              </>
            )}
          </div>

          {/* Segunda parte: Solicitar años después del primer cálculo */}
          {segundoPaso && (
            <div className="form-group mt-3">
              <label style={{ color: '#b3b3b3' }}>Años:</label>
              <input
                type="number"
                className="form-control"
                value={años}
                onChange={(e) => setAños(e.target.value)}
                placeholder="Ingrese el número de años"
              />
            </div>
          )}

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

export default Wacc;
