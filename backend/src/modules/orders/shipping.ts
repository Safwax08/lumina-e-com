export const FREE_SHIPPING_THRESHOLD = 1999;
export const STANDARD_SHIPPING_FEE = 99;

export function calculateShippingFee(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal <= 0) {
    return 0;
  }
  return STANDARD_SHIPPING_FEE;
}
