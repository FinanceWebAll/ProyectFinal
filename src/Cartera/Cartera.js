import React from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import {Link, Route, useNavigate} from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import '../ExplorarOperaciones.css';
import Facture from "./Facture";
import ManageCarteras from "./ManageCarteras";
import setDiscountDate from "./setDiscountDate";

function ExplorarOperaciones() {
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
        <div className="explorar-operaciones-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>

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
                <div className="card p-4" style={{ backgroundColor: '#1f1f1f', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)', color: '#b3b3b3' }}>
                    <h2 className="text-center mb-4" style={{ color: '#ffffff', fontWeight: 'bold' }}>Cartera de Procesos</h2>

                    <div className="row">

                        <div className="col-md-6 mb-4">
                            <div className="card p-3" style={{backgroundColor: '#2c2c2c', borderRadius: '10px'}}>
                                <h5 style={{color: '#4caf50'}}>Administrar Carteras</h5>
                                <p>Permite gestionar las carteras, incluyendo la creación de nuevas,
                                    la eliminación de existentes y la visualización de las carteras actuales.
                                    </p>
                                <button
                                    className="btn btn-success mt-2"
                                    style={{backgroundColor: '#4caf50', border: 'none'}}
                                    onClick={() => navigate('/manage-carteras')}
                                >
                                    Administrar Carteras
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card p-3" style={{backgroundColor: '#2c2c2c', borderRadius: '10px'}}>
                                <h5 style={{color: '#4caf50'}}>Factura/letra</h5>
                                <p>Permite seleccionar una cartera específica y asignarle facturas con su correspondiente fecha.</p>
                                <button
                                    className="btn btn-success mt-2"
                                    style={{backgroundColor: '#4caf50', border: 'none'}}
                                    onClick={() => navigate('/facture')}
                                >
                                    factura/letra
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <div className="card p-3" style={{backgroundColor: '#2c2c2c', borderRadius: '10px'}}>
                                <h5 style={{color: '#4caf50'}}>Reporte</h5>
                                <p>Genera un reporte detallado sobre una cartera seleccionada,
                                    mostrando datos relevantes, resultados financieros y el cálculo de la TCEA</p>
                                <button
                                    className="btn btn-success mt-2"
                                    style={{backgroundColor: '#4caf50', border: 'none'}}
                                    onClick={() => navigate('/report')}
                                >
                                    Definir Descuento
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExplorarOperaciones;
