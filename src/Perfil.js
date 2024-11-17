import React, { useEffect, useState } from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from './utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Perfil.css';

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nombreCompleto: '', correo: '', dni: '', fechaNacimiento: '', usuario: '' });

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const usuarioDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (usuarioDoc.exists()) {
            setUsuario(usuarioDoc.data());
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="perfil-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
     
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
        <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)', maxWidth: '600px', margin: '0 auto' }}>
          <div className="text-center mb-4">
            <FaUserCircle size={100} color="#4caf50" />
          </div>
          <h2 className="text-center" style={{ color: '#ffffff', fontWeight: 'bold' }}>Perfil del Usuario</h2>
          <div className="mt-4" style={{ color: '#b3b3b3' }}>
            <p><strong>Nombre Completo:</strong> {usuario.nombreCompleto}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>DNI:</strong> {usuario.dni}</p>
            <p><strong>Fecha de Nacimiento:</strong> {usuario.fechaNacimiento}</p>
            <p><strong>Usuario:</strong> {usuario.usuario}</p>
          </div>
          <button className="btn btn-success mt-4 w-100" style={{ backgroundColor: '#4caf50', border: 'none', borderRadius: '25px', fontWeight: 'bold' }}>Editar Perfil</button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
