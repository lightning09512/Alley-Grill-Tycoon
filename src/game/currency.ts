/** Game money values are stored in thousands of Vietnamese đồng. */
export function formatVndFromThousands(amountInThousands: number): string {
  const dong = Math.round(amountInThousands * 1_000);
  return `${dong.toLocaleString("vi-VN")}đ`;
}
