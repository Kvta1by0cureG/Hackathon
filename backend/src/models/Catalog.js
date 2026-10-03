// backend/src/models/Catalog.js
import mongoose from 'mongoose';

const catalogSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  floor:       { type: Number, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, default: 0 },
  imageUrl:    { type: String, default: '' },
  active:      { type: Boolean, default: true }
}, { timestamps: true });

// Índice para consultar catálogo por piso rápido
catalogSchema.index({ floor: 1, active: 1 });

export const Catalog = mongoose.model('Catalog', catalogSchema);