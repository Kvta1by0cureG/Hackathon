import { User } from '../../models/User.js';
import { sumarScore, calcularPiso } from '../score.js';

export async function updateScore({ userId, phone, puntos }) {
  const query = userId ? { _id: userId } : { phone };
  const user = await User.findOne(query);

  if (!user) {
    return { error: 'Usuario no encontrado' };
  }

  user.score = sumarScore(user.score, puntos);
  user.floor = calcularPiso(user.score);
  await user.save();

  return {
    userId: user._id,
    phone: user.phone,
    score: user.score,
    floor: user.floor
  };
}