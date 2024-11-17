import React, { useState, useEffect } from "react";
import {collection, getDocs, updateDoc, doc, query, where} from "firebase/firestore";
import {auth, db} from "../utils/firebase";

function SetDiscountDate() {
    const [carteras, setCarteras] = useState([]);
    const [selectedCartera, setSelectedCartera] = useState("");
    const [discountDate, setDiscountDate] = useState("");
    const [message, setMessage] = useState("");
    const [userId, setUserId] = useState(null);

    // Obtener las carteras de Firebase
    useEffect(() => {
        const fetchUser = () => {
            const user = auth.currentUser; // Usuario autenticado
            if (user) {
                setUserId(user.uid); // Almacena el UID del usuario
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

    const handleUpdateDiscountDate = async () => {
        if (!selectedCartera || !discountDate) {
            setMessage("Por favor, selecciona una cartera y establece una fecha.");
            return;
        }

        try {
            const carteraDoc = doc(db, "carteras", selectedCartera);
            await updateDoc(carteraDoc, { fechaDescuento: discountDate });

            setMessage("Fecha de descuento actualizada exitosamente.");
        } catch (error) {
            console.error("Error al actualizar la fecha de descuento:", error);
            setMessage("Hubo un error al actualizar la fecha. Inténtalo nuevamente.");
        }
    };

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh", padding: "20px" }}>
            <div
                className="card p-4"
                style={{
                    backgroundColor: "#1f1f1f",
                    borderRadius: "15px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                }}
            >
                <h2 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>
                    Configurar Fecha de Descuento
                </h2>

                <div className="form-group">
                    <label style={{ color: "#b3b3b3" }}>Seleccionar Cartera:</label>
                    <select
                        className="form-control"
                        value={selectedCartera}
                        onChange={(e) => setSelectedCartera(e.target.value)}
                    >
                        <option value="">-- Seleccionar --</option>
                        {carteras.map((cartera) => (
                            <option key={cartera.id} value={cartera.id}>
                                {cartera.nombre || `Cartera ${cartera.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                    <label style={{ color: "#b3b3b3" }}>Fecha de Descuento:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={discountDate}
                        onChange={(e) => setDiscountDate(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-success mt-4"
                    style={{ width: "100%", backgroundColor: "#4caf50", border: "none" }}
                    onClick={handleUpdateDiscountDate}
                >
                    Guardar Fecha
                </button>

                {message && <p className="mt-3" style={{ color: "#4caf50" }}>{message}</p>}
            </div>
        </div>
    );
}

export default SetDiscountDate;
