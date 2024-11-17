import React, { useState } from 'react';
import { FaWallet, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../Operaciones css/GeneradorFlujoCaja.css';

function GeneradorFlujoCaja() {
  const [flujos, setFlujos] = useState([{ periodo: 1, ingresos: '', costos: '', flujoNeto: '' }]);
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (index, event) => {
    const values = [...flujos];
    values[index][event.target.name] = event.target.value;

    // Calcular el flujo neto al momento de modificar los ingresos o los costos
    if (values[index].ingresos !== '' && values[index].costos !== '') {
      values[index].flujoNeto = parseFloat(values[index].ingresos) - parseFloat(values[index].costos);
    } else {
      values[index].flujoNeto = '';
    }

    setFlujos(values);
  };

  const agregarPeriodo = () => {
    setFlujos([...flujos, { periodo: flujos.length + 1, ingresos: '', costos: '', flujoNeto: '' }]);
  };

  const guardarOperacionEnHistorial = (flujoTotal) => {
    const nuevaOperacion = {
      descripcion: 'Generador de Flujos de Caja',
      flujos: flujos.map(({ periodo, ingresos, costos, flujoNeto }) => ({
        periodo,
        ingresos,
        costos,
        flujoNeto,
      })),
      flujoTotal,  // El flujo total que es el resultado final
      fecha: new Date().toLocaleString(),  // Fecha en que se hizo la operación
    };
  
    // Guardar en localStorage solo los detalles del flujo en el historial
    const historialActual = JSON.parse(localStorage.getItem('historialOperaciones')) || [];
    historialActual.push(nuevaOperacion);
    localStorage.setItem('historialOperaciones', JSON.stringify(historialActual));
  };
  

  const calcularFlujoCaja = () => {
    if (flujos.some(flujo => flujo.ingresos === '' || flujo.costos === '')) {
      alert("Por favor, complete todos los ingresos y costos antes de calcular.");
      return;
    }

    // Calcular los flujos netos
    const flujosNetos = flujos.map(({ ingresos, costos }) => parseFloat(ingresos) - parseFloat(costos));
    const flujoTotal = flujosNetos.reduce((total, flujo) => total + flujo, 0);

    setResultado(flujoTotal.toFixed(2));

    // Guardar en historial después de calcular
    guardarOperacionEnHistorial(flujoTotal.toFixed(2));
  };

  return (
    <div className="generador-flujo-caja-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
      {/* Navbar */}
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
            </ul>
          </div>
          <Link to="/perfil" className="nav-link text-light d-flex align-items-center">
            <FaUserCircle size={30} color="#4caf50" />
          </Link>
        </div>
      </nav>

      {/* Contenido */}
      <div className="container mt-5">
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Generador de Flujos de Caja para Proyectos</h2>
          {flujos.map((flujo, index) => (
            <div key={index} className="form-group mt-4">
              <h5 style={{ color: '#4caf50' }}>Periodo {flujo.periodo}:</h5>
              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Ingresos:</label>
                <input
                  type="number"
                  name="ingresos"
                  className="form-control"
                  value={flujo.ingresos}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Ingrese los ingresos"
                />
              </div>
              <div className="form-group mt-3">
                <label style={{ color: '#b3b3b3' }}>Costos:</label>
                <input
                  type="number"
                  name="costos"
                  className="form-control"
                  value={flujo.costos}
                  onChange={(e) => handleInputChange(index, e)}
                  placeholder="Ingrese los costos"
                />
              </div>

              {/* Mostrar flujo neto de cada periodo */}
              {flujo.flujoNeto !== '' && (
                <div className="mt-2" style={{ color: '#b3b3b3' }}>
                  Flujo Neto: {flujo.flujoNeto.toFixed(2)}
                </div>
              )}
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={agregarPeriodo}>
              Agregar Periodo
            </button>
            <button className="btn btn-success" onClick={calcularFlujoCaja}>
              Calcular Flujo de Caja
            </button>
          </div>

          {resultado && (
            <div className="resultado mt-4" style={{ color: '#4caf50', fontSize: '1.5em', textAlign: 'center' }}>
              Flujo de Caja Total: {resultado}
            </div>
          )}

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

export default GeneradorFlujoCaja;