import React, { useEffect, useState } from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from './utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import walletImage from './images/Wallet.png';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const obtenerNombreUsuario = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usuarioDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (usuarioDoc.exists()) {
            setNombreUsuario(usuarioDoc.data().usuario);
          }
        }
      } catch (error) {
        console.error('Error al obtener el nombre del usuario:', error);
      }
    };

    obtenerNombreUsuario();
  }, []);

  const handleExploreOperations = () => {
    navigate('/explorar-operaciones');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="home-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
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
                <Link className="nav-link text-light" to="/explorar-operaciones">Explorar Operaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/Cartera">Cartera</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/historial">Historial</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light" to="/facturacion">Facturación</Link> {/* Nuevo enlace */}
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

      <div className="container mt-5">
        <div className="card p-5 text-center" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ color: '#ffffff', fontWeight: 'bold' }}>¡Hola {nombreUsuario}, bienvenido a SafePocket!</h2>
          <p style={{ color: '#b3b3b3' }}>Gestiona y organiza todas tus finanzas personales de una manera sencilla y segura.</p>
          <div className="mt-4">
            <img src={walletImage} alt="Wallet Illustration" className="img-fluid" style={{ maxHeight: '250px', borderRadius: '15px' }} />
          </div>
          <button
            className="btn btn-success mt-4 action-btn"
            style={{ borderRadius: '25px', padding: '10px 30px', fontWeight: 'bold', backgroundColor: '#4caf50', border: 'none' }}
            onClick={handleExploreOperations}
          >
            Explorar Operaciones
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
