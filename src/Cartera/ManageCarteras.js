import React, { useState, useEffect } from "react";
import { db, auth } from "../utils/firebase";
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { FaWallet, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function ManageCarteras() {
    const [carteras, setCarteras] = useState([]);
    const [newCartera, setNewCartera] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = () => {
            const user = auth.currentUser;
            if (user) {
                setUserId(user.uid);
                fetchCarteras(user.uid);
            }
        };

        fetchUser();
    }, []);

    const fetchCarteras = async (userId) => {
        try {
            const q = query(collection(db, "carteras"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const userCarteras = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCarteras(userCarteras);
        } catch (error) {
            console.error("Error al obtener carteras:", error);
        }
    };

    const handleAddCartera = async (e) => {
        e.preventDefault();

        if (!newCartera.trim()) {
            alert("El nombre de la cartera no puede estar vacío.");
            return;
        }

        try {
            await addDoc(collection(db, "carteras"), {
                nombre: newCartera,
                descripcion: "Cartera personalizada del usuario",
                userId: userId,
                fechaCreacion: new Date().toISOString(),
            });

            alert("Cartera creada exitosamente.");
            setNewCartera("");
            fetchCarteras(userId);
        } catch (error) {
            console.error("Error al crear la cartera:", error);
        }
    };

    const handleDeleteCartera = async (id) => {
        try {
            await deleteDoc(doc(db, "carteras", id));
            alert("Cartera eliminada exitosamente.");
            setCarteras(carteras.filter((cartera) => cartera.id !== id));
        } catch (error) {
            console.error("Error al eliminar la cartera:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: "#1f1f1f" }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand text-light d-flex align-items-center" to="/home">
                        <FaWallet size={30} color="#4caf50" style={{ marginRight: "10px" }} />
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
                                <Link className="nav-link text-light" to="/cartera">Cartera</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/historial">Historial</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/facturacion">Facturación</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="d-flex align-items-center">
                        <Link to="/perfil" className="nav-link text-light d-flex align-items-center">
                            <FaUserCircle size={30} color="#4caf50" />
                        </Link>
                        <button onClick={handleLogout} className="btn btn-link nav-link text-light d-flex align-items-center" style={{ textDecoration: "none" }}>
                            <FaSignOutAlt size={30} color="#4caf50" style={{ marginLeft: "15px" }} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mt-5">
                <div
                    className="card p-4"
                    style={{
                        backgroundColor: "#1f1f1f",
                        borderRadius: "15px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <h2 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>
                        Gestionar Carteras
                    </h2>

                    {/* Crear Nueva Cartera */}
                    <form onSubmit={handleAddCartera}>
                        <div className="form-group">
                            <label style={{ color: "#b3b3b3" }}>Nombre de Cartera:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newCartera}
                                onChange={(e) => setNewCartera(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                            style={{ width: "100%", backgroundColor: "#4caf50", border: "none" }}
                        >
                            Crear Cartera
                        </button>
                    </form>

                    {/* Listar y Eliminar Carteras */}
                    <h3 className="text-center mt-5" style={{ color: "#ffffff" }}>
                        Mis Carteras
                    </h3>
                    <ul className="list-group mt-3">
                        {carteras.length > 0 ? (
                            carteras.map((cartera) => (
                                <li
                                    key={cartera.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                    style={{ backgroundColor: "#1f1f1f", color: "#ffffff" }}
                                >
                                    {cartera.nombre}
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteCartera(cartera.id)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p style={{ color: "#b3b3b3", textAlign: "center" }}>
                                No tienes carteras creadas.
                            </p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ManageCarteras;
