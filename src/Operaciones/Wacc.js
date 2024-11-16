
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

  // Variables que guardan los valores operacionales
  const [crecimientoOperador, setCrecimientoOperador] = useState('');
  const [flotacionOperador, setFlotacionOperador] = useState('');

  // Datos de la segunda parte (Acciones Preferentes)
  const [precioAccionPreferentes, setPrecioAccionPreferentes] = useState('');
  const [DividendoAccionesPreferentes, setDividendoAccionesPreferentes] = useState('');
  const [costoFlotacionPreferentes, setCostoFlotacionPreferentes] = useState('');
  const [ksPreferentes, setKsPreferentes] = useState('');

  // Datos de la tercera parte (Utilidades)
  const [precioAccionUtilidades, setPrecioAccionUtilidades] = useState('');
  const [tasaCrecimientoUtilidades, setTasaCrecimientoUtilidades] = useState('');
  const [ultimoDividendoUtilidades, setUltimoDividendoUtilidades] = useState('');
  const [dividendoProyectadoUtilidades, setDividendoProyectadoUtilidades] = useState('');
  const [ksUtilidades, setKsUtilidades] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [segundoPaso, setSegundoPaso] = useState(false);
  const [tercerPaso, setTercerPaso] = useState(false); // Flag para mostrar la tercera parte

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
    setDividendoProyectado(dividendoProj.toFixed(2));  

    // KS: (Dividendo proyectado / (Precio de la acción * (1 - Costo de flotación))) + Tasa de crecimiento
    const ksCalc = (dividendoProj / (precioAccion * (1 - flotacionOperadorValue))) + crecimientoOperadorValue;
    setKs((ksCalc * 100).toFixed(3));  // KS como porcentaje, con 3 decimales y multiplicado por 100

    // Mostrar la segunda parte (Acciones Preferentes)
    setSegundoPaso(true);
  };

  const calcularPreferentes = () => {
    // Validar campos de acciones preferentes
    if (!precioAccionPreferentes || !DividendoAccionesPreferentes || !costoFlotacionPreferentes) {
      setErrorMessage("Por favor, ingrese todos los campos para Acciones Preferentes.");
      return;
    }
    setErrorMessage("");

    // Convertir costo de flotación a valor operativo
    const flotacionOperadorPreferentes = costoFlotacionPreferentes / 100;

    // KS para preferentes
    const ksCalcPreferentes = DividendoAccionesPreferentes / (precioAccionPreferentes * (1 - flotacionOperadorPreferentes));
    setKsPreferentes((ksCalcPreferentes * 100).toFixed(3));  // KS en porcentaje

    // Mostrar la tercera parte (Utilidades)
    setTercerPaso(true);
  };

  const calcularUtilidades = () => {
    // Validar campos de utilidades
    if (!precioAccionUtilidades || !ultimoDividendoUtilidades || !tasaCrecimientoUtilidades) {
      setErrorMessage("Por favor, ingrese todos los campos para Utilidades.");
      return;
    }
    setErrorMessage("");

    // Dividendo proyectado para utilidades
    const dividendoProjUtilidades = ultimoDividendoUtilidades * (1 + tasaCrecimientoUtilidades / 100);
    setDividendoProyectadoUtilidades(dividendoProjUtilidades.toFixed(2));  // Redondear a 7 decimales

    // KS para utilidades
    const ksCalcUtilidades = dividendoProjUtilidades / precioAccionUtilidades + tasaCrecimientoUtilidades / 100;
    setKsUtilidades((ksCalcUtilidades * 100).toFixed(3));  // KS en porcentaje
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
          {/* Primera parte: Acciones Comunes */}
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones Comunes</h2>
          
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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

          <button className="btn btn-success mt-4" onClick={calcularWacc}>
            Calcular Acciones Comunes
          </button>

          {segundoPaso && (
            <div className="mt-5">
              <h4 className="text-light">Datos Ingresados:</h4>
              <p style={{ color: '#b3b3b3' }}><strong>Precio de la Acción:</strong> {precioAccion}</p>
              <p style={{ color: '#b3b3b3' }}><strong>Tasa de Crecimiento:</strong> {tasaCrecimiento}%</p>
              <p style={{ color: '#b3b3b3' }}><strong>Último Dividendo:</strong> {ultimoDividendo}</p>
              <p style={{ color: '#b3b3b3' }}><strong>Costo de Flotación:</strong> {costoFlotacion}%</p>
              <p style={{ color: '#b3b3b3' }}><strong>Dividendo Proyectado:</strong> {dividendoProyectado}</p>
              <p style={{ color: '#b3b3b3' }}><strong>KS:</strong> {ks}%</p>
            </div>
          )}
          
          {/* Segunda parte: Acciones Preferentes */}
          {segundoPaso && (
            <>
              <h2 className="text-center mb-4 mt-5" style={{ color: '#ffffff', fontWeight: 'bold' }}>Acciones Preferentes</h2>
              <div className="form-group mt-4">
                <label style={{ color: '#b3b3b3' }}>Precio de la Acción Preferentes:</label>
                <input
                  type="number"
                  className="form-control"
                  value={precioAccionPreferentes}
                  onChange={(e) => setPrecioAccionPreferentes(e.target.value)}
                  placeholder="Ingrese el precio de la acción preferentes"
                />
              </div>

              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Dividendo de Acciones Preferentes:</label>
                <input
                  type="number"
                  className="form-control"
                  value={DividendoAccionesPreferentes}
                  onChange={(e) => setDividendoAccionesPreferentes(e.target.value)}
                  placeholder="Ingrese el Dividendo de Acciones Preferentes"
                />
              </div>

              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Costo de Flotación Preferentes (%):</label>
                <input
                  type="number"
                  className="form-control"
                  value={costoFlotacionPreferentes}
                  onChange={(e) => setCostoFlotacionPreferentes(e.target.value)}
                  placeholder="Ingrese el costo de flotación preferentes (%)"
                />
              </div>

              <button className="btn btn-success mt-4" onClick={calcularPreferentes}>
                Calcular Acciones Preferentes
              </button>

              <div className="mt-5">
                <h4 className="text-light">Datos Ingresados Preferentes:</h4>
                <p style={{ color: '#b3b3b3' }}><strong>Dividendo de Acciones Preferentes:</strong> {DividendoAccionesPreferentes}</p>
                <p style={{ color: '#b3b3b3' }}><strong>Precio de la Acción Preferentes:</strong> {precioAccionPreferentes}</p>
                <p style={{ color: '#b3b3b3' }}><strong>Costo de Flotación Preferentes:</strong> {costoFlotacionPreferentes}%</p>
                <p style={{ color: '#b3b3b3' }}><strong>KS Preferentes:</strong> {ksPreferentes}%</p>
              </div>
            </>
          )}
          
          {/* Tercera parte: Utilidades */}
          {tercerPaso && (
            <>
              <h2 className="text-center mb-4 mt-5" style={{ color: '#ffffff', fontWeight: 'bold' }}>Utilidades</h2>
              <div className="form-group mt-4">
                <label style={{ color: '#b3b3b3' }}>Precio de la Acción Utilidades:</label>
                <input
                  type="number"
                  className="form-control"
                  value={precioAccionUtilidades}
                  onChange={(e) => setPrecioAccionUtilidades(e.target.value)}
                  placeholder="Ingrese el precio de la acción utilidades"
                />
              </div>

              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Tasa de Crecimiento Utilidades (%):</label>
                <input
                  type="number"
                  className="form-control"
                  value={tasaCrecimientoUtilidades}
                  onChange={(e) => setTasaCrecimientoUtilidades(e.target.value)}
                  placeholder="Ingrese la tasa de crecimiento de utilidades (%)"
                />
              </div>

              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Último Dividendo Utilidades:</label>
                <input
                  type="number"
                  className="form-control"
                  value={ultimoDividendoUtilidades}
                  onChange={(e) => setUltimoDividendoUtilidades(e.target.value)}
                  placeholder="Ingrese el último dividendo de utilidades"
                />
              </div>

              <button className="btn btn-success mt-4" onClick={calcularUtilidades}>
                Calcular Utilidades
              </button>

              <div className="mt-5">
                <h4 className="text-light">Datos Ingresados Utilidades:</h4>
                <p style={{ color: '#b3b3b3' }}><strong>Precio de la Acción Utilidades:</strong> {precioAccionUtilidades}</p>
                <p style={{ color: '#b3b3b3' }}><strong>Tasa de Crecimiento Utilidades:</strong> {tasaCrecimientoUtilidades}%</p>
                <p style={{ color: '#b3b3b3' }}><strong>Último Dividendo Utilidades:</strong> {ultimoDividendoUtilidades}</p>
                <p style={{ color: '#b3b3b3' }}><strong>Dividendo Proyectado Utilidades:</strong> {dividendoProyectadoUtilidades}</p>
                <p style={{ color: '#b3b3b3' }}><strong>KS Utilidades:</strong> {ksUtilidades}%</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wacc;