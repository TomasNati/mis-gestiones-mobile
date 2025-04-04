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
