import { create } from 'zustand';
import type { Tournament } from '../types';

interface TournamentState {
    tournaments: Tournament[];
    loading: boolean;
    selectedTournament: Tournament | null;
    setTournaments: (ts: Tournament[]) => void;
    setLoading: (v: boolean) => void;
    setSelectedTournament: (t: Tournament | null) => void;
}

export const useTournamentStore = create<TournamentState>(set => ({
    tournaments: [],
    loading: true,
    selectedTournament: null,
    setTournaments: tournaments => set({ tournaments, loading: false }),
    setLoading: loading => set({ loading }),
    setSelectedTournament: t => set({ selectedTournament: t }),
}));
