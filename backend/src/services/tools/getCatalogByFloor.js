import { Catalog } from '../../models/Catalog.js';

export async function getCatalogByFloor({ floor }) {
  const items = await Catalog.find({ floor, active: true }).lean();
  return { floor, items };
}