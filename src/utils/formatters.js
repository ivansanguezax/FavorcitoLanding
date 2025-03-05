export const formatDate = (date) => {
  if (!date) return "No especificada";

  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Fecha inválida";

    return dateObj.toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formateando fecha:", error);
    return String(date);
  }
};

export const formatCurrency = (amount, currency = "Bs") => {
  if (amount === undefined || amount === null) return `0 ${currency}`;

  const numAmount = Number(amount);
  if (isNaN(numAmount)) return `0 ${currency}`;

  return `${numAmount.toFixed(0)} ${currency}`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

export const capitalizeText = (text) => {
  if (!text) return "";

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
