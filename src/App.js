import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './utils/firebase';
import { FaWallet } from 'react-icons/fa';

import Register from './Register';
import Home from './Home';
import Operacion from './Operacion';
import Historial from './Historial';
import Perfil from './Perfil';
import ExplorarOperaciones from './ExplorarOperaciones';
import CalculoTasas from './Operaciones/CalculoTasas';
import ProyeccionValor from './Operaciones/ProyeccionValor';
import IndicadoresRentabilidad from './Operaciones/IndicadoresRentabilidad';
import SimulacionPago from './Operaciones/SimulacionPago';
import EvaluacionInstrumentos from './Operaciones/EvaluacionInstrumentos';
import GeneradorFlujoCaja from './Operaciones/GeneradorFlujoCaja';
import Facturacion from './Facturacion';
import Wacc from './Operaciones/Wacc';  
import Cartera from './Cartera/Cartera.js'
import Facture from './Cartera/Facture'
import ManageCarteras from "./Cartera/ManageCarteras";
import SetDiscountDate from "./Cartera/setDiscountDate";
import Report from "./Cartera/Report";



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/operacion" element={<Operacion />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/explorar-operaciones" element={<ExplorarOperaciones />} />
        <Route path="/calculo-tasas" element={<CalculoTasas />} />
        <Route path="/proyeccion-valor" element={<ProyeccionValor />} />
        <Route path="/indicadores-rentabilidad" element={<IndicadoresRentabilidad />} />
        <Route path="/simulacion-pago" element={<SimulacionPago />} />
        <Route path="/evaluacion-instrumentos" element={<EvaluacionInstrumentos />} />
        <Route path="/generador-flujo-caja" element={<GeneradorFlujoCaja />} />
        <Route path="/wacc" element={<Wacc />} />
        <Route path="/facturacion" element={<Facturacion />} />
        <Route path="/cartera" element={<Cartera />} />
        <Route path="/facture" element={<Facture />} />
        <Route path="/manage-carteras" element={<ManageCarteras />} />
        <Route path="/set-discountDate" element={<SetDiscountDate />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#121212' }}>
      <div className="card p-5" style={{ width: '600px', borderRadius: '25px', boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.8)', backgroundColor: '#1f1f1f' }}>
        <div className="text-center mb-4">
          <FaWallet size={80} color="#4caf50" />
          <h1 className="mt-3" style={{ fontWeight: 'bold', color: '#4caf50', fontSize: '2.5rem' }}>SAFEPOCKET</h1>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="email" className="form-label" style={{ color: '#b3b3b3', fontWeight: '500' }}>Correo:</label>
            <input type="email" id="email" className="form-control" placeholder="Correo" style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: '1px solid #4caf50', padding: '10px', borderRadius: '10px' }} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="form-label" style={{ color: '#b3b3b3', fontWeight: '500' }}>Contraseña:</label>
            <input type="password" id="password" className="form-control" placeholder="Contraseña" style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: '1px solid #4caf50', padding: '10px', borderRadius: '10px' }} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {errorMessage && <div className="alert alert-danger" role="alert" style={{ fontSize: '0.9rem' }}>{errorMessage}</div>}
          <button type="submit" className="btn btn-success w-100" style={{ backgroundColor: '#4caf50', border: 'none', borderRadius: '25px', padding: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>Ingresar</button>
        </form>
        <p className="text-center mt-4" style={{ color: '#b3b3b3' }}>
          ¿Eres un usuario nuevo?{' '}
          <Link to="/register" className="btn btn-link" style={{ color: '#4caf50', fontWeight: 'bold', padding: 0 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default App;
