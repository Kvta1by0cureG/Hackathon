import { useEffect, useState } from 'react';
import { useApi } from './useApi.js';

function leerTokenDeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}

export function useSession() {
  const api = useApi();
  const [estado, setEstado] = useState({
    cargando: true,
    error: null,
    user: null,
    catalog: []
  });

  useEffect(() => {
    const token = leerTokenDeUrl();

    if (!token) {
      setEstado({ cargando: false, error: 'Token no encontrado en la URL', user: null, catalog: [] });
      return;
    }

    sessionStorage.setItem('token', token);
    window.history.replaceState({}, '', window.location.pathname);

    api.getSession(token)
      .then(({ user, catalog }) => {
        setEstado({ cargando: false, error: null, user, catalog });
        api.marcarSesionUsada(token).catch(() => {});
      })
      .catch((err) => {
        setEstado({ cargando: false, error: err.message, user: null, catalog: [] });
      });
  }, []);

  return estado;
}

export function getToken() {
  return sessionStorage.getItem('token');
}