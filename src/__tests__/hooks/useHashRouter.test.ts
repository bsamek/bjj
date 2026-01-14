import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  useHashRouter,
  parseHash,
  buildHash,
} from '../../hooks/useHashRouter';

describe('parseHash', () => {
  it('parses #/principles as principles view', () => {
    expect(parseHash('#/principles')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('parses #/position/side-control as position view with default top perspective', () => {
    expect(parseHash('#/position/side-control')).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
      perspective: 'top',
    });
  });

  it('parses #/position/side-control/top as position view with top perspective', () => {
    expect(parseHash('#/position/side-control/top')).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
      perspective: 'top',
    });
  });

  it('parses #/position/side-control/bottom as position view with bottom perspective', () => {
    expect(parseHash('#/position/side-control/bottom')).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
      perspective: 'bottom',
    });
  });

  it('handles empty hash as principles view', () => {
    expect(parseHash('')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('handles hash without leading slash', () => {
    expect(parseHash('#principles')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('handles position without id as position view with null id', () => {
    expect(parseHash('#/position/')).toEqual({
      currentView: 'position',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('handles position path without trailing content', () => {
    expect(parseHash('#/position')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });
});

describe('buildHash', () => {
  it('builds principles hash', () => {
    expect(
      buildHash({ currentView: 'principles', selectedPositionId: null, perspective: 'top' })
    ).toBe('#/principles');
  });

  it('builds position hash with id and perspective', () => {
    expect(
      buildHash({ currentView: 'position', selectedPositionId: 'mount', perspective: 'top' })
    ).toBe('#/position/mount/top');
  });

  it('builds position hash with bottom perspective', () => {
    expect(
      buildHash({ currentView: 'position', selectedPositionId: 'mount', perspective: 'bottom' })
    ).toBe('#/position/mount/bottom');
  });

  it('builds principles hash when position view has no id', () => {
    expect(
      buildHash({ currentView: 'position', selectedPositionId: null, perspective: 'top' })
    ).toBe('#/principles');
  });
});

describe('useHashRouter', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('returns principles view for empty hash', () => {
    const { result } = renderHook(() => useHashRouter());
    expect(result.current[0]).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('parses initial hash on mount', () => {
    window.location.hash = '#/position/closed-guard/bottom';
    const { result } = renderHook(() => useHashRouter());
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'closed-guard',
      perspective: 'bottom',
    });
  });

  it('updates hash when navigating to position', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('position', 'side-control');
    });

    expect(window.location.hash).toBe('#/position/side-control/top');
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
      perspective: 'top',
    });
  });

  it('updates hash when navigating to position with perspective', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('position', 'side-control', 'bottom');
    });

    expect(window.location.hash).toBe('#/position/side-control/bottom');
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
      perspective: 'bottom',
    });
  });

  it('updates hash when navigating to principles', () => {
    window.location.hash = '#/position/mount/bottom';
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('principles');
    });

    expect(window.location.hash).toBe('#/principles');
    expect(result.current[0]).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('responds to hashchange events', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      window.location.hash = '#/position/half-guard/bottom';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'half-guard',
      perspective: 'bottom',
    });
  });

  it('cleans up hashchange listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useHashRouter());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'hashchange',
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });

  it('clears selectedPositionId when navigating to principles', () => {
    window.location.hash = '#/position/mount/bottom';
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('principles', 'some-id');
    });

    expect(result.current[0]).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('handles navigate to position with null positionId', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('position', null);
    });

    expect(window.location.hash).toBe('#/principles');
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: null,
      perspective: 'top',
    });
  });

  it('handles navigate to position with undefined positionId', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('position');
    });

    expect(window.location.hash).toBe('#/principles');
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: null,
      perspective: 'top',
    });
  });
});
