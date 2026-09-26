'use client';

// ============================================================
// IMPORTACIONES
// ============================================================

import { useSyncExternalStore } from 'react';


// ============================================================
// HOOK: useIsClient
// ============================================================

// Suscripción vacía: no hay nada que observar.
// useSyncExternalStore requiere una función de subscribe,
// aunque no necesitemos reaccionar a cambios externos.
const emptySubscribe = () => () => {};

/**
 * Detecta si el código se está ejecutando en el cliente.
 *
 * ¿Por qué no useState + useEffect?
 * - React 19 advierte contra setState sincrónico dentro de useEffect
 *   porque causa renders en cascada.
 * - useSyncExternalStore es la forma oficial de suscribirse
 *   a un sistema externo (en este caso, "estar montado").
 *
 * ¿Cómo funciona?
 * - En el servidor: getServerSnapshot() → false.
 * - En el cliente (tras hidratar): getSnapshot() → true.
 * - React gestiona la transición sin cascada ni mismatch.
 *
 * Uso:
 *   const isClient = useIsClient();
 *   if (!isClient) return <Placeholder />; // SSR o primer render
 *   return <ComponenteConDatosReales />;
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,        // subscribe: no hay nada que suscribir
    () => true,            // getSnapshot: valor en el cliente
    () => false            // getServerSnapshot: valor en el servidor
  );
}