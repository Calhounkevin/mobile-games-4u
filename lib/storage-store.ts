import { useSyncExternalStore } from 'react';
import { GAMES_DATA, GameItem } from '@/lib/games-data';
import { SITE_CONFIG } from '@/lib/config';

// In-memory subscribers for immediate multi-component updates
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function saveLockerUrl(url: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mobilegames4u_ogads_url', url.trim());
    notify();
  }
}

export function saveCustomGames(games: GameItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mobilegames4u_custom_games', JSON.stringify(games));
    notify();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = () => callback();
  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

export function useActiveLockerUrl(): string {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (typeof window === 'undefined') return SITE_CONFIG.defaultOgAdsUrl;
      return localStorage.getItem('mobilegames4u_ogads_url') || SITE_CONFIG.defaultOgAdsUrl;
    },
    () => SITE_CONFIG.defaultOgAdsUrl
  );
}

let cachedGamesJson = '';
let cachedGamesList: GameItem[] = GAMES_DATA;

export function useActiveGames(): GameItem[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (typeof window === 'undefined') return GAMES_DATA;
      const saved = localStorage.getItem('mobilegames4u_custom_games');
      if (saved && saved !== cachedGamesJson) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            cachedGamesJson = saved;
            cachedGamesList = parsed;
          }
        } catch {
          // fallback
        }
      } else if (!saved) {
        cachedGamesJson = '';
        cachedGamesList = GAMES_DATA;
      }
      return cachedGamesList;
    },
    () => GAMES_DATA
  );
}
