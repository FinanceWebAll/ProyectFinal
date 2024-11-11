import React, { useState } from 'react';
import './Operacion.css';
import { realizarOperacion } from './utils/calculos'; 

function Operacion() {
  const [formData, setFormData] = useState({
    moneda: 'Soles',
    credito: '',
    cuotas: '',
    cuotaInicial: '',
    tipoTasa: 'Efectiva',
    capitalizacion: 'Mensual',
    tiempoTasa: 'Mensual',
    valorTasa: '',
    frecuenciaPago: 'Mensual',
    plazoGracia: '',
    periodosGracia: '',
  });

  const [operacionResultado, setOperacionResultado] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCalculate = () => {
    const resultado = realizarOperacion(formData);

    if (resultado.error) {
      setError(resultado.error);
      setOperacionResultado(null);
    } else {
      setError('');
      setOperacionResultado(resultado);
    }
  };

  return (
    <div className="operacion-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      {}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1f1f1f' }}>
        <div className="container d-flex justify-content-between align-items-center">
          {}
          <a className="navbar-brand text-light d-flex align-items-center" href="/">
            <i className="fa fa-wallet" aria-hidden="true" style={{ fontSize: '1.5rem', color: '#4caf50', marginRight: '10px' }}></i>
          </a>

          {}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-light" href="/home">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="/operacion">Realizar Operación</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="/historial">Historial</a>
              </li>
            </ul>
          </div>

          {}
          <a href="/perfil" className="nav-link text-light d-flex align-items-center">
            <i className="fa fa-user-circle" style={{ fontSize: '30px', color: '#4caf50' }}></i>
          </a>
        </div>
      </nav>

      {}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-5 mb-4">
            <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)' }}>
              <h5 style={{ color: '#4caf50' }}>1. Seleccionar moneda:</h5>
              <div className="form-group">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="moneda"
                    id="moneda"
                    value="Soles"
                    checked={formData.moneda === 'Soles'}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="soles" style={{ color: '#fff' }}>Soles</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="moneda"
                    id="moneda"
                    value="Dólares"
                    checked={formData.moneda === 'Dólares'}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="dolares" style={{ color: '#fff' }}>Dólares</label>
                </div>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="credito" style={{ color: '#fff' }}>2. Valor del crédito:</label>
                <input type="text" className="form-control" id="credito" value={formData.credito} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="cuotas" style={{ color: '#fff' }}>3. Número de cuotas:</label>
                <input type="text" className="form-control" id="cuotas" value={formData.cuotas} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="cuotaInicial" style={{ color: '#fff' }}>4. Porcentaje de cuota inicial:</label>
                <input type="text" className="form-control" id="cuotaInicial" value={formData.cuotaInicial} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="tipoTasa" style={{ color: '#fff' }}>5. Seleccionar tipo de tasa:</label>
                <select className="form-select" id="tipoTasa" value={formData.tipoTasa} onChange={handleInputChange}>
                  <option>Efectiva</option>
                  <option>Nominal</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="capitalizacion" style={{ color: '#fff' }}>6. Seleccionar capitalización:</label>
                <select className="form-select" id="capitalizacion" value={formData.capitalizacion} onChange={handleInputChange}>
                  <option>Mensual</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-md-5 mb-4">
            <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)' }}>
              <div className="form-group">
                <label htmlFor="tiempoTasa" style={{ color: '#fff' }}>7. Seleccionar tiempo de la tasa:</label>
                <select className="form-select" id="tiempoTasa" value={formData.tiempoTasa} onChange={handleInputChange}>
                  <option>Mensual</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="valorTasa" style={{ color: '#fff' }}>8. Ingresa el valor de la tasa:</label>
                <input type="text" className="form-control" id="valorTasa" value={formData.valorTasa} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="frecuenciaPago" style={{ color: '#fff' }}>9. Selecciona frecuencia de pago:</label>
                <select className="form-select" id="frecuenciaPago" value={formData.frecuenciaPago} onChange={handleInputChange}>
                  <option>Mensual</option>
                  <option>Trimestral</option>
                  <option>Semestral</option>
                  <option>Anual</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label htmlFor="plazoGracia" style={{ color: '#fff' }}>10. Seleccionar plazo de gracia:</label>
                <input type="text" className="form-control" id="plazoGracia" value={formData.plazoGracia} onChange={handleInputChange} />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="periodosGracia" style={{ color: '#fff' }}>11. Número de periodos de gracia:</label>
                <input type="text" className="form-control" id="periodosGracia" value={formData.periodosGracia} onChange={handleInputChange} />
              </div>
              <button
                className="btn btn-success w-100 mt-4"
                style={{ backgroundColor: '#4caf50', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}
                onClick={handleCalculate}
              >
                Calcular
              </button>
            </div>
          </div>

          <div className="col-md-2">
            <div
              className="card p-4 text-center"
              style={{
                backgroundColor: '#1f1f1f',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
                color: '#b3b3b3',
              }}
            >
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {operacionResultado ? (
                <>
                  <h5>Resultado de la Operación:</h5>
                  <p>Código de Operación: {operacionResultado.codigoOperacion}</p>
                  <p>Valor del crédito: {operacionResultado.valorCredito}</p>
                  <p>Cuota inicial: {operacionResultado.cuotaInicial}</p>
                  <p>Valor financiado: {operacionResultado.valorCreditoFinanciado}</p>
                  <p>Cuota mensual: {operacionResultado.cuotaMensual}</p>
                  <p>Periodo de gracia: {operacionResultado.periodoGracia}</p>
                  <p>Valor de gracia: {operacionResultado.valorGracia}</p>
                  <p>Frecuencia de pago: {operacionResultado.frecuenciaPago}</p>
                  <p>Fecha de registro: {operacionResultado.fechaRegistroOperacion}</p>
                </>
              ) : (
                'Aquí se mostrarán los detalles de la operación'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Operacion;
