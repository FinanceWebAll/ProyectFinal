import React, { useState, useEffect } from 'react';
import { FaWallet, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './utils/firebase';
import './Facturacion.css';

const Facturacion = () => {
  const [facturas, setFacturas] = useState([]);
  const [cliente, setCliente] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const facturasGuardadas = JSON.parse(localStorage.getItem('facturas')) || [];
    setFacturas(facturasGuardadas);
  }, []);

  const esFechaValida = (fecha) => {
    const fechaIngresada = new Date(fecha);
    const anio = fechaIngresada.getFullYear();
    const anioActual = new Date().getFullYear();
    return anio >= 1900 && anio <= anioActual;
  };

  const agregarFactura = (e) => {
    e.preventDefault();

    if (!cliente || !monto || !fecha) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (!esFechaValida(fecha)) {
      alert('Por favor, ingrese una fecha válida (entre 1900 y el año actual).');
      return;
    }

    const nuevaFactura = {
      cliente,
      monto: parseFloat(monto),
      fecha,
    };

    const nuevasFacturas = [...facturas, nuevaFactura];
    setFacturas(nuevasFacturas);

    localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
    setCliente('');
    setMonto('');
    setFecha('');
  };

  const eliminarFactura = (index) => {
    const nuevasFacturas = facturas.filter((_, i) => i !== index);
    setFacturas(nuevasFacturas);
    localStorage.setItem('facturas', JSON.stringify(nuevasFacturas));
    setFacturaSeleccionada(null);
  };

  const calcularTCEA = () => {
    const montoTotal = facturas.reduce((total, factura) => total + factura.monto, 0);
    const tcea = montoTotal > 0 ? (montoTotal * 0.145) : 0;
    return tcea.toFixed(2);
  };

  const esVencida = (fecha) => {
    const fechaFactura = new Date(fecha);
    const fechaActual = new Date();
    return fechaFactura < fechaActual;
  };

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

  const verDetalles = (factura) => {
    setFacturaSeleccionada((prevSeleccionada) =>
      prevSeleccionada === factura ? null : factura
    );
  };

  const consolidarCuenta = () => {
    const totalFacturas = facturas.reduce((total, factura) => total + factura.monto, 0);
    const tcea = calcularTCEA();
    return { totalFacturas, tcea };
  };

  const { totalFacturas, tcea } = consolidarCuenta();
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
    <div className="facturacion-container" style={{ backgroundColor: '#121212', minHeight: '100vh' }}>
     
     
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



      <div className="facturacion-card" style={{ marginTop: '60px' }}>
        <h2>Facturación</h2>

        <form onSubmit={agregarFactura} className="facturacion-form">
          <div className="form-group">
            <label htmlFor="cliente">Cliente</label>
            <input
              type="text"
              id="cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              placeholder="Ingrese el nombre del cliente"
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto</label>
            <input
              type="number"
              id="monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto de la factura"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-agregar">Agregar Factura</button>
        </form>

        <h4>Facturas:</h4>
        <table className="facturacion-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, index) => (
              <tr
                key={index}
                className={esVencida(factura.fecha) ? 'factura-vencida' : ''}
                onClick={() => verDetalles(factura)}
              >
                <td>{factura.cliente}</td>
                <td>${factura.monto.toFixed(2)}</td>
                <td>{factura.fecha}</td>
                <td>
                  <button
                    onClick={(e) => { e.stopPropagation(); eliminarFactura(index); }}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tcea-container">
          <p><strong>TCEA de toda la cartera: </strong>{tcea}%</p>
        </div>

        <div className="consolidado-container">
          <h4>Consolidado de Facturación:</h4>
          <p><strong className="total-label">Total Facturado:</strong> ${totalFacturas.toFixed(2)}</p>
          <p><strong className="tcea-label">TCEA de toda la cartera:</strong> {tcea}%</p>
        </div>

        {facturaSeleccionada && (
          <div className="factura-detalles">
            <h4>Detalles de la Factura:</h4>
            <p><strong>Cliente:</strong> {facturaSeleccionada.cliente}</p>
            <p><strong>Monto:</strong> ${facturaSeleccionada.monto.toFixed(2)}</p>
            <p><strong>Fecha:</strong> {facturaSeleccionada.fecha}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facturacion;
