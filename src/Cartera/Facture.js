import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

function RegisterInvoice({ userId }) {
    const [formData, setFormData] = useState({
        carteraId: "",
    });
    const [carteras, setCarteras] = useState([]);
    const [letras, setLetras] = useState([]); // Letras cargadas desde Firebase
    const [newLetra, setNewLetra] = useState({ cliente: "", monto: "", fecha: "" });

    // Fetch available carteras from Firebase
    useEffect(() => {
        const fetchCarteras = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    const q = query(collection(db, "carteras"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    setCarteras(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    console.error("Error fetching carteras:", error);
                }
            }
        };

        fetchCarteras();
    }, []);

    // Fetch letras when cartera changes
    useEffect(() => {
        const fetchLetras = async () => {
            const { carteraId } = formData;
            if (carteraId) {
                try {
                    const q = query(collection(db, "letras"), where("carteraId", "==", carteraId));
                    const querySnapshot = await getDocs(q);
                    setLetras(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    console.error("Error fetching letras:", error);
                }
            } else {
                setLetras([]);
            }
        };

        fetchLetras();
    }, [formData.carteraId]);

    const handleCarteraChange = (e) => {
        setFormData({ ...formData, carteraId: e.target.value });
    };

    const handleLetraChange = (e) => {
        const { name, value } = e.target;
        setNewLetra({ ...newLetra, [name]: value });
    };

    const agregarLetra = async () => {
        const { carteraId } = formData;
        if (!carteraId) {
            alert("Primero selecciona una cartera.");
            return;
        }
        if (!newLetra.cliente || !newLetra.monto || !newLetra.fecha) {
            alert("Completa todos los campos de la letra.");
            return;
        }

        const letra = { ...newLetra, carteraId };

        try {
            // Guardar letra en Firebase
            const docRef = await addDoc(collection(db, "letras"), letra);
            setLetras([...letras, { id: docRef.id, ...letra }]);
            setNewLetra({ cliente: "", monto: "", fecha: "" });
        } catch (error) {
            console.error("Error adding letra:", error);
        }
    };

    const eliminarLetra = async (id) => {
        try {
            // Eliminar letra en Firebase
            await deleteDoc(doc(db, "letras", id));
            setLetras(letras.filter((letra) => letra.id !== id));
        } catch (error) {
            console.error("Error deleting letra:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            <div className="container mt-5">
                <div className="card p-4" style={{ backgroundColor: "#1f1f1f", borderRadius: "15px" }}>
                    <h2 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>
                        Registrar Factura
                    </h2>
                    <div className="form-group mt-3">
                        <label style={{ color: "#b3b3b3" }}>Seleccionar Cartera:</label>
                        <select
                            className="form-control"
                            name="carteraId"
                            value={formData.carteraId}
                            onChange={handleCarteraChange}
                        >
                            <option value="">-- Seleccionar --</option>
                            {carteras.map((cartera) => (
                                <option key={cartera.id} value={cartera.id}>
                                    {cartera.nombre || `Cartera ${cartera.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Letras Section */}
                    {formData.carteraId && (
                        <div className="mt-4">
                            <h4 style={{ color: "#ffffff" }}>Letras para la cartera seleccionada</h4>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Cliente:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="cliente"
                                    value={newLetra.cliente}
                                    onChange={handleLetraChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Monto:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="monto"
                                    value={newLetra.monto}
                                    onChange={handleLetraChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Fecha:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="fecha"
                                    value={newLetra.fecha}
                                    onChange={handleLetraChange}
                                />
                            </div>
                            <button
                                className="btn btn-success mt-3"
                                onClick={agregarLetra}
                                style={{ backgroundColor: "#4caf50", border: "none" }}
                            >
                                Agregar Letra
                            </button>

                            {/* Display Letras */}
                            <h5 className="mt-4" style={{ color: "#ffffff" }}>
                                Letras registradas:
                            </h5>
                            <ul className="list-group">
                                {letras.map((letra) => (
                                    <li
                                        key={letra.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                        style={{ backgroundColor: "#1f1f1f", color: "#ffffff" }}
                                    >
                                        <span>{`${letra.cliente} - S/. ${letra.monto} - ${letra.fecha}`}</span>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarLetra(letra.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegisterInvoice;
