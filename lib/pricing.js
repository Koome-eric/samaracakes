import { SIZES, FLAVOURS } from "./config";
// Price is always computed on the server so customers cannot change it.
export function priceItem(i, products) {
  const c = products.find((x) => x.name === i.name);
  const s = SIZES.find((x) => x.label === i.size);
  const f = FLAVOURS.find((x) => x.label === i.flavour);
  return c && s && f ? c.base + s.add + f.add : null;
}
