export const transformNumberToCurrenty = (
  value?: number
): string | undefined => {
  const formattedValue = value?.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  return formattedValue?.endsWith(",00")
    ? formattedValue.slice(0, -3)
    : formattedValue;
};
