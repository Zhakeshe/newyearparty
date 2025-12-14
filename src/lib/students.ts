export function formatTicketNumber(value: number) {
  return `№${value.toString().padStart(3, "0")}`;
}
