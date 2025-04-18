export const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const transformNumberToCurrenty = (
  value?: number
): string | undefined => {
  if (value === undefined) return undefined;

  // Round up the value and remove decimals
  const roundedValue = Math.ceil(value);

  // Format the value as currency without decimals
  const formattedValue = roundedValue.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedValue;
};

function esBisiesto(year: number): boolean {
  if (year % 4 !== 0) {
    return false;
  } else if (year % 100 !== 0) {
    return true;
  } else if (year % 400 === 0) {
    return true;
  } else {
    return false;
  }
}

export const obtenerDiasEnElMes = (fecha: Date) => {
  const mes = fecha.getMonth();
  const meses = months.map((m) => m.toLowerCase());

  let diasEnElMes = 0;
  const diasEnFebrero = esBisiesto(fecha.getFullYear()) ? 29 : 28;

  switch (meses[mes]) {
    case "enero":
    case "marzo":
    case "mayo":
    case "julio":
    case "agosto":
    case "octubre":
    case "diciembre":
      diasEnElMes = 31;
      break;
    case "febrero":
      diasEnElMes = diasEnFebrero;
      break;
    default:
      diasEnElMes = 30;
      break;
  }

  return diasEnElMes;
};

export const generateUUID = (): string => {
  let d = new Date().getTime();

  if (
    globalThis.window &&
    globalThis.window.performance &&
    typeof globalThis.window.performance.now === "function"
  ) {
    d += performance.now(); // use high-precision timer if available
  }

  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );

  return uuid;
};
