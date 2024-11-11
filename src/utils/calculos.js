// utils/calculos.js

export const realizarOperacion = (formData) => {
  const {
    moneda,
    credito,
    cuotas,
    cuotaInicial,
    tipoTasa,
    capitalizacion,
    tiempoTasa,
    valorTasa,
    frecuenciaPago,
    plazoGracia,
    periodosGracia,
  } = formData;

  
  if (!credito || !cuotas || !cuotaInicial || !valorTasa) {
    return {
      error: 'Por favor, completa todos los campos antes de realizar el cálculo.',
    };
  }

  const valorCredito = parseFloat(credito);
  const numeroCuotas = parseInt(cuotas);
  const porcentajeCuotaInicial = parseFloat(cuotaInicial) / 100;
  const cuotaInicialCalculada = valorCredito * porcentajeCuotaInicial;
  const valorCreditoFinanciado = valorCredito - cuotaInicialCalculada;

  let tasaInteresMensual = parseFloat(valorTasa) / 100;

  if (tipoTasa === 'Nominal') {
    const capitalizacionesPorAno = {
      Mensual: 12,
      Trimestral: 4,
      Semestral: 2,
      Anual: 1,
    };
    const n = capitalizacionesPorAno[capitalizacion];
    tasaInteresMensual = Math.pow(1 + tasaInteresMensual / n, n / 12) - 1;
  } else if (tipoTasa === 'Efectiva') {
    const tiempoPorAno = {
      Mensual: 12,
      Trimestral: 4,
      Semestral: 2,
      Anual: 1,
    };
    const n = tiempoPorAno[tiempoTasa];
    tasaInteresMensual = Math.pow(1 + tasaInteresMensual, 1 / (12 / n)) - 1;
  }

  const cuotaMensual =
    (valorCreditoFinanciado * tasaInteresMensual) /
    (1 - Math.pow(1 + tasaInteresMensual, -numeroCuotas));

  // Calcular el plazo de gracia si existe
  let valorGracia = 0;
  if (plazoGracia.toLowerCase() !== 'sin plazo de gracia' && parseInt(periodosGracia) > 0) {
    valorGracia = parseInt(periodosGracia) * cuotaMensual;
  }

  return {
    codigoOperacion: 'C001',
    moneda,
    valorCredito: valorCredito.toFixed(2),
    cuotaInicial: cuotaInicialCalculada.toFixed(2),
    valorCreditoFinanciado: valorCreditoFinanciado.toFixed(2),
    tipoTasa,
    capitalizacion,
    TES: valorTasa,
    frecuenciaPago,
    fechaRegistroOperacion: new Date().toLocaleDateString(),
    periodoGracia: plazoGracia || 'Sin plazo de gracia',
    valorGracia: valorGracia.toFixed(2),
    cuotaMensual: cuotaMensual.toFixed(2),
  };
};
