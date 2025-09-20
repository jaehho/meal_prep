export type Unit = 'lb' | 'oz' | 'cups' | 'tbsp' | 'tsp' | 'cloves' | 'slices' | 'count' | 'stalks';

export const unitOrderBias: Record<Unit, number> = {
  lb: 0, oz: 1, cups: 2, tbsp: 3, tsp: 4, cloves: 5, slices: 6, count: 7, stalks: 8,
};

export function formatQty(n: number) {
  return Number.isInteger(n) ? n.toString() : Number(n.toFixed(3)).toString();
}
