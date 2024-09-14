export const formatPrice = (value: number) => {
  if (isNaN(value)) {
    return "₹0.00"; // Default value if the input is not a valid number
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};
