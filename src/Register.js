import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dni: '',
    correo: '',
    nombreCompleto: '',
    usuario: '',
    fechaNacimiento: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar que el DNI solo contenga números y tenga máximo 8 caracteres
    if (name === 'dni') {
      if (/^\d*$/.test(value) && value.length <= 8) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos.';
    }
    if (!formData.correo) {
      newErrors.correo = 'El correo es obligatorio.';
    }
    if (!formData.nombreCompleto) {
      newErrors.nombreCompleto = 'El nombre completo es obligatorio.';
    }
    if (!formData.usuario) {
      newErrors.usuario = 'El nombre de usuario es obligatorio.';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.';
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.correo,
        formData.password
      );

      // Obtener el UID del usuario registrado
      const user = userCredential.user;

      // Crear un documento en Firestore con el UID del usuario
      await setDoc(doc(db, 'usuarios', user.uid), {
        dni: formData.dni,
        nombreCompleto: formData.nombreCompleto,
        usuario: formData.usuario,
        fechaNacimiento: formData.fechaNacimiento,
        correo: formData.correo
      });

      // Mostrar mensaje de éxito
      alert('Registro exitoso. Redirigiendo a la pantalla de inicio de sesión.');

      // Navegar a la página de inicio de sesión después del registro exitoso
      navigate('/');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      let errorMessage = 'Error al registrar el usuario.';

      // Manejo de errores específicos de Firebase Authentication
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El correo ya está en uso. Por favor, utiliza otro correo.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil. Por favor, utiliza una contraseña más fuerte.';
      }

      // Mostrar mensaje de error
      alert(errorMessage);
    }
  };

  return (
    <div className="register-container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#121212' }}>
      <div className="card p-5" style={{ maxWidth: '700px', borderRadius: '20px', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.8)', backgroundColor: '#1f1f1f' }}>
        <div className="text-center mb-4">
          <h1 className="mt-3" style={{ fontWeight: 'bold', color: '#4caf50' }}>Regístrate</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-4">
                <label htmlFor="dni" className="form-label" style={{ color: '#b3b3b3' }}>DNI:</label>
                <input type="text" id="dni" name="dni" className="form-control" placeholder="DNI" value={formData.dni} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.dni && <span style={{ color: 'red' }}>{errors.dni}</span>}
              </div>
              <div className="form-group mb-4">
                <label htmlFor="nombreCompleto" className="form-label" style={{ color: '#b3b3b3' }}>Nombre Completo:</label>
                <input type="text" id="nombreCompleto" name="nombreCompleto" className="form-control" placeholder="Nombre Completo" value={formData.nombreCompleto} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.nombreCompleto && <span style={{ color: 'red' }}>{errors.nombreCompleto}</span>}
              </div>
              <div className="form-group mb-4">
                <label htmlFor="fechaNacimiento" className="form-label" style={{ color: '#b3b3b3' }}>Fecha de Nacimiento:</label>
                <input type="date" id="fechaNacimiento" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.fechaNacimiento && <span style={{ color: 'red' }}>{errors.fechaNacimiento}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mb-4">
                <label htmlFor="correo" className="form-label" style={{ color: '#b3b3b3' }}>Correo:</label>
                <input type="email" id="correo" name="correo" className="form-control" placeholder="Correo" value={formData.correo} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.correo && <span style={{ color: 'red' }}>{errors.correo}</span>}
              </div>
              <div className="form-group mb-4">
                <label htmlFor="usuario" className="form-label" style={{ color: '#b3b3b3' }}>Usuario:</label>
                <input type="text" id="usuario" name="usuario" className="form-control" placeholder="Usuario" value={formData.usuario} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.usuario && <span style={{ color: 'red' }}>{errors.usuario}</span>}
              </div>
              <div className="form-group mb-4">
                <label htmlFor="password" className="form-label" style={{ color: '#b3b3b3' }}>Contraseña:</label>
                <input type="password" id="password" name="password" className="form-control" placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{ backgroundColor: '#2c2c2c', color: '#ffffff', border: 'none' }} />
                {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100" style={{ backgroundColor: '#4caf50', border: 'none', borderRadius: '25px', padding: '10px', fontWeight: 'bold' }}>Registrarme</button>
        </form>
        <p className="text-center mt-4" style={{ color: '#b3b3b3' }}>
          ¿Ya tienes una cuenta?{' '}
          <a href="/" className="btn btn-link" style={{ color: '#4caf50', fontWeight: 'bold', padding: 0 }}>Iniciar Sesión</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
