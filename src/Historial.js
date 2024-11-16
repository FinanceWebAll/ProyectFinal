import React from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import './Historial.css';

function Historial() {
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
    <div className="historial-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
    
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
                <Link className="nav-link text-light" to="/explorar-operaciones">Realizar Operación</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/historial">Historial</Link>
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

      <div className="historial-section d-flex justify-content-center align-items-center flex-column text-center">
        <div className="card historial-card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)', maxWidth: '700px', marginTop: '50px' }}>
          <h5 style={{ color: '#ffffff' }}>Usted no ha realizado ninguna operación</h5>
        </div>
      </div>
    </div>
  );
}

export default Historial;
