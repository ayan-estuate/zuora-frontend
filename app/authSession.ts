// Simple pub/sub for auth session events (e.g., unauthorized)
type Listener = () => void;

const unauthorizedListeners = new Set<Listener>();

export function subscribeUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener);
  return () => {
    unauthorizedListeners.delete(listener);
  };
}

export function notifyUnauthorized() {
  unauthorizedListeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}


