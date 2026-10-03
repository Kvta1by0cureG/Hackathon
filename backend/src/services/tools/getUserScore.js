import { User } from '../../models/User.js';
import { calcularPiso } from '../score.js';

export async function getUserScore({ userId, phone }) {
  const query = userId ? { _id: userId } : { phone };
  const user = await User.findOne(query);

  if (!user) {
    return { error: 'Usuario no encontrado' };
  }

  return {
    userId: user._id,
    phone: user.phone,
    name: user.name,
    score: user.score,
    floor: user.floor || calcularPiso(user.score)
  };
}