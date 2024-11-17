import React, { useState, useEffect } from "react";
import { differenceInDays } from "date-fns"; // Para cálculo de días entre fechas
import { db, auth } from "../utils/firebase";
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore";
import { FaWallet, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function CarteraCalculations() {
    const [carteras, setCarteras] = useState([]);
    const [selectedCartera, setSelectedCartera] = useState(null);
    const [letras, setLetras] = useState([]);
    const [tasa, setTasa] = useState(""); // Tasa de interés (sin formato)
    const [tipoTasa, setTipoTasa] = useState("nominal"); // Nominal o Efectiva
    const [frecuenciaCapitalizacion, setFrecuenciaCapitalizacion] = useState("anual"); // Frecuencia de capitalización
    const [unidadTiempo, setUnidadTiempo] = useState("anual"); // Unidades: días, meses, años
    const [costesIniciales, setCostesIniciales] = useState(0); // Costes Iniciales
    const [costesFinales, setCostesFinales] = useState(0); // Costes Finales
    const [retencion, setRetencion] = useState(0); // Retención
    const [fechaDescuento, setFechaDescuento] = useState(""); // Fecha de descuento
    const [resultados, setResultados] = useState({
        valorNominal: 0,
        descuento: 0,
        valorNeto: 0,
        valorRecibido: 0,
        valorEntregado: 0,
        TCEA: 0,
        TEP: 0,
        TE:0// Nuevo resultado: Tasa Efectiva Periódica
    });

    const navigate = useNavigate();

    // Fetch carteras del usuario
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

    // Fetch letras cuando la cartera cambia
    useEffect(() => {
        const fetchLetras = async () => {
            if (selectedCartera) {
                try {
                    const q = query(
                        collection(db, "letras"),
                        where("carteraId", "==", selectedCartera)
                    );
                    const querySnapshot = await getDocs(q);
                    setLetras(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    console.error("Error fetching letras:", error);
                }
            }
        };
        fetchLetras();
    }, [selectedCartera]);

    const handleCarteraChange = (e) => {
        setSelectedCartera(e.target.value);
    };

    const calcularValores = () => {
        if (!fechaDescuento || letras.length === 0 || !tasa) {
            alert("Por favor, completa todos los campos antes de calcular.");
            return;
        }

        const valorNominal = letras.reduce((acc, letra) => acc + parseFloat(letra.monto), 0);

        // Calcular el plazo (días entre fechas)
        const plazo = differenceInDays(new Date(letras[0].fecha), new Date(fechaDescuento));

        let tasaCalculada = parseFloat(tasa) / 100;
        let tep = 0; // Tasa Efectiva Periódica (TEP)
        let tea = 0; // Tasa Efectiva Anual (TEA)
        let te = 0;  // Tasa Efectiva para la unidad de tiempo seleccionada

        // Frecuencias de capitalización
        const frecuencias = {
            anual: 1,
            semestral: 2,
            cuatrimestral: 3,
            trimestral: 4,
            bimestral: 6,
            mensual: 12,
            quincenal: 24,
            diario: 360,
        };
        const frecuenciaCapitalizacionSeleccionada = frecuencias[frecuenciaCapitalizacion] || 1;

        // Unidades de tiempo
        const unidades = {
            anual: 1,
            semestral: 2,
            cuatrimestral: 3,
            trimestral: 4,
            bimestral: 6,
            mensual: 12,
            quincenal: 24,
            diario: 360,
        };
        const unidadTiempoSeleccionada = unidades[unidadTiempo] || 1;

        // Calcular Tasa Efectiva Anual (TEA) y Tasa Efectiva para el periodo deseado
        if (tipoTasa === "nominal") {
            // Convertir la tasa nominal en tasa efectiva para la frecuencia de capitalización
            const tasaEfectivaFrecuencia = Math.pow(
                1 + tasaCalculada / frecuenciaCapitalizacionSeleccionada,
                frecuenciaCapitalizacionSeleccionada
            ) - 1;

            // Convertir la tasa efectiva de la frecuencia a la TEA
            tea = Math.pow(1 + tasaEfectivaFrecuencia, frecuencias["anual"]) - 1;

            // Convertir a TE según la unidad de tiempo seleccionada
            te = Math.pow(
                1 + tasaEfectivaFrecuencia,
                unidadTiempoSeleccionada / frecuenciaCapitalizacionSeleccionada
            ) - 1;

        } else {
            // Si la tasa es efectiva, asignamos directamente la tasa ingresada a la TEA
            tea = tasaCalculada;

            // Convertir TEA a TE según la unidad de tiempo seleccionada
            te = Math.pow(1 + tea, unidadTiempoSeleccionada / frecuencias["anual"]) - 1;
        }

        // Calcular TEP (Tasa Efectiva Periódica)
        tep = Math.pow(1 + tea, 1 / unidadTiempoSeleccionada) - 1;

        // Calcular tasa de descuento
        const tasaDescuento = tep / (1 + tep);

        // Cálculo de resultados financieros

        // Opción 1: Descuento directo
        const descuento = valorNominal * tasaDescuento;
        const valorNetoDirecto = valorNominal - descuento;

        // Opción 2: Valor Neto con fórmula de valor presente
        const valorNetoPresente = valorNominal * Math.pow(1 + tep, plazo / (360 / unidadTiempoSeleccionada));

        // Selección de valor neto según la fórmula deseada
        const valorNeto = valorNetoDirecto;  // Usa valorNetoPresente si necesitas la segunda fórmula

        // Cálculos finales
        const valorRecibido = valorNeto - costesIniciales - retencion;
        const valorEntregado = valorNominal + parseFloat(costesFinales) - parseFloat(retencion);


        // TCEA (Tasa de Costo Efectiva Anual)
        const TCEA = ((Math.pow(valorEntregado / valorRecibido, 360 / plazo) - 1) * 100).toFixed(2);

        // Actualizar resultados
        setResultados({
            TE: (te * 100).toFixed(8), // Mostrar TE con alta precisión
            TEP: (tep * 100).toFixed(8), // Mostrar TEP con alta precisión
            TEA: (tea * 100).toFixed(8), // Mostrar TEA con alta precisión
            valorNominal: valorNominal.toFixed(2),
            descuento: descuento.toFixed(2),
            valorNeto: valorNeto.toFixed(2),
            valorRecibido: valorRecibido.toFixed(2),
            valorEntregado: valorEntregado.toFixed(2),
            TCEA,
        });
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
            <div className="container mt-5">
                <div className="card p-4" style={{ backgroundColor: "#1f1f1f", borderRadius: "15px" }}>
                    <h2 className="text-center mb-4" style={{ color: "#ffffff", fontWeight: "bold" }}>
                        Cálculos de Cartera
                    </h2>
                    <div className="form-group mt-3">
                        <label style={{ color: "#b3b3b3" }}>Seleccionar Cartera:</label>
                        <select
                            className="form-control"
                            value={selectedCartera || ""}
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

                    {selectedCartera && (
                        <div className="mt-4">
                            <h4 style={{ color: "#ffffff" }}>Letras asociadas</h4>
                            <ul className="list-group">
                                {letras.map((letra) => (
                                    <li
                                        key={letra.id}
                                        className="list-group-item"
                                        style={{ backgroundColor: "#1f1f1f", color: "#ffffff" }}
                                    >
                                        {`${letra.cliente} - S/. ${letra.monto} - ${letra.fecha}`}
                                    </li>
                                ))}
                            </ul>

                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Fecha de Descuento:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fechaDescuento}
                                    onChange={(e) => setFechaDescuento(e.target.value)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Tipo de Tasa:</label>
                                <select
                                    className="form-control"
                                    value={tipoTasa}
                                    onChange={(e) => setTipoTasa(e.target.value)}
                                >
                                    <option value="nominal">Nominal</option>
                                    <option value="efectiva">Efectiva</option>
                                </select>
                            </div>

                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Unidad de Tiempo:</label>
                                <select
                                    className="form-control"
                                    value={unidadTiempo}
                                    onChange={(e) => setUnidadTiempo(e.target.value)}
                                >
                                    <option value="anual">Anual</option>
                                    <option value="semestral">Semestral</option>
                                    <option value="cuatrimestral">Cuatrimestral</option>
                                    <option value="trimestral">Trimestral</option>
                                    <option value="bimestral">Bimestral</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="quincenal">Quincenal</option>
                                    <option value="diario">Diario</option>
                                </select>
                            </div>


                            {tipoTasa === "nominal" && (
                                <div className="form-group mt-3">
                                    <label style={{ color: "#b3b3b3" }}>
                                        Frecuencia de Capitalización:
                                    </label>
                                    <select
                                        className="form-control"
                                        value={frecuenciaCapitalizacion}
                                        onChange={(e) => setFrecuenciaCapitalizacion(e.target.value)}
                                    >
                                        <option value="anual">Anual</option>
                                        <option value="semestral">Semestral</option>
                                        <option value="cuatrimestral">Cuatrimestral</option>
                                        <option value="trimestral">Trimestral</option>
                                        <option value="bimestral">Bimestral</option>
                                        <option value="mensual">Mensual</option>
                                        <option value="quincenal">Quincenal</option>
                                        <option value="diario">Diario</option>
                                    </select>
                                </div>
                            )}
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Costes Iniciales:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={costesIniciales}
                                    onChange={(e) => setCostesIniciales(e.target.value)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Costes Finales:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={costesFinales}
                                    onChange={(e) => setCostesFinales(e.target.value)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Retención:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={retencion}
                                    onChange={(e) => setRetencion(e.target.value)}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label style={{ color: "#b3b3b3" }}>Tasa de Interés (%):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={tasa}
                                    onChange={(e) => setTasa(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn btn-primary mt-4 w-100"
                                onClick={calcularValores}
                            >
                                Calcular
                            </button>
                        </div>
                    )}

                    {resultados.valorNominal > 0 && (
                        <div className="mt-5">
                            <h4 style={{ color: "#ffffff" }}>Resultados</h4>
                            <ul style={{color: "#b3b3b3"}}>
                                <li>Tasa Efectiva: {resultados.TE}%</li>
                                <li>Valor Nominal: S/. {resultados.valorNominal}</li>
                                <li>Descuento: S/. {resultados.descuento}</li>
                                <li>Valor Neto: S/. {resultados.valorNeto}</li>
                                <li>Valor Recibido: S/. {resultados.valorRecibido}</li>
                                <li>Valor Entregado: S/. {resultados.valorEntregado}</li>
                                <li>TCEA: {resultados.TCEA}%</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CarteraCalculations;
