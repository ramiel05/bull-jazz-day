/**
 * Contract Tests: Streak Storage
 * Feature: 002-streak-counter-consecutive
 *
 * Tests for localStorage persistence of streak state.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { getStreakState, saveStreakState } from './streak-storage';
import type { StreakState } from '~/features/day-guessing-game/streak/types/streak-types';

describe('streak-storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStreakState', () => {
    it('returns initial state when localStorage is empty', () => {
      const state = getStreakState();

      expect(state).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        currentMilestoneColor: null,
        lastGuessDate: null,
      });
    });

    it('returns stored state when valid data exists', () => {
      const storedState: StreakState = {
        currentStreak: 5,
        bestStreak: 10,
        currentMilestoneColor: 'text-green-500',
        lastGuessDate: '2025-10-07',
      };

      localStorage.setItem('streak-state', JSON.stringify(storedState));

      const state = getStreakState();
      expect(state).toEqual(storedState);
    });

    it('returns initial state when localStorage contains corrupted JSON', () => {
      localStorage.setItem('streak-state', '{invalid json');

      const state = getStreakState();

      expect(state).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        currentMilestoneColor: null,
        lastGuessDate: null,
      });
    });

    it('returns initial state when stored data is missing required fields', () => {
      localStorage.setItem('streak-state', JSON.stringify({ currentStreak: 5 }));

      const state = getStreakState();

      expect(state).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        currentMilestoneColor: null,
        lastGuessDate: null,
      });
    });

    it('returns initial state when stored data is not an object', () => {
      localStorage.setItem('streak-state', JSON.stringify('not an object'));

      const state = getStreakState();

      expect(state).toEqual({
        currentStreak: 0,
        bestStreak: 0,
        currentMilestoneColor: null,
        lastGuessDate: null,
      });
    });
  });

  describe('saveStreakState', () => {
    it('saves state to localStorage with correct key', () => {
      const state: StreakState = {
        currentStreak: 7,
        bestStreak: 7,
        currentMilestoneColor: 'text-purple-500',
        lastGuessDate: '2025-10-08',
      };

      saveStreakState(state);

      const stored = localStorage.getItem('streak-state');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual(state);
    });

    it('overwrites existing state', () => {
      const initialState: StreakState = {
        currentStreak: 3,
        bestStreak: 5,
        currentMilestoneColor: 'text-blue-500',
        lastGuessDate: '2025-10-06',
      };

      saveStreakState(initialState);

      const updatedState: StreakState = {
        currentStreak: 0,
        bestStreak: 5,
        currentMilestoneColor: null,
        lastGuessDate: '2025-10-07',
      };

      saveStreakState(updatedState);

      const stored = localStorage.getItem('streak-state');
      expect(JSON.parse(stored!)).toEqual(updatedState);
    });

    it('handles localStorage quota exceeded gracefully', () => {
      // Mock localStorage.setItem to throw quota exceeded error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = () => {
        throw new Error('QuotaExceededError');
      };

      const state: StreakState = {
        currentStreak: 1,
        bestStreak: 1,
        currentMilestoneColor: null,
        lastGuessDate: '2025-10-07',
      };

      // Should not throw
      expect(() => saveStreakState(state)).not.toThrow();

      // Restore original
      localStorage.setItem = originalSetItem;
    });
  });
});
