export function equalsIgnoreCase(a?: string, b?: string): boolean {
  if (a == null && b == null) {
    return true;
  }
  if (a != null && b != null) {
    return a.toUpperCase() === b.toUpperCase();
  }
  return false;
}
