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
    });
  });

  it('parses #/position/side-control as position view', () => {
    expect(parseHash('#/position/side-control')).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
    });
  });

  it('handles empty hash as principles view', () => {
    expect(parseHash('')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
    });
  });

  it('handles hash without leading slash', () => {
    expect(parseHash('#principles')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
    });
  });

  it('handles position without id as position view with null id', () => {
    expect(parseHash('#/position/')).toEqual({
      currentView: 'position',
      selectedPositionId: null,
    });
  });

  it('handles position path without trailing content', () => {
    expect(parseHash('#/position')).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
    });
  });
});

describe('buildHash', () => {
  it('builds principles hash', () => {
    expect(
      buildHash({ currentView: 'principles', selectedPositionId: null })
    ).toBe('#/principles');
  });

  it('builds position hash with id', () => {
    expect(
      buildHash({ currentView: 'position', selectedPositionId: 'mount' })
    ).toBe('#/position/mount');
  });

  it('builds principles hash when position view has no id', () => {
    expect(
      buildHash({ currentView: 'position', selectedPositionId: null })
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
    });
  });

  it('parses initial hash on mount', () => {
    window.location.hash = '#/position/closed-guard';
    const { result } = renderHook(() => useHashRouter());
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'closed-guard',
    });
  });

  it('updates hash when navigating to position', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('position', 'side-control');
    });

    expect(window.location.hash).toBe('#/position/side-control');
    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'side-control',
    });
  });

  it('updates hash when navigating to principles', () => {
    window.location.hash = '#/position/mount';
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('principles');
    });

    expect(window.location.hash).toBe('#/principles');
    expect(result.current[0]).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
    });
  });

  it('responds to hashchange events', () => {
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      window.location.hash = '#/position/half-guard';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current[0]).toEqual({
      currentView: 'position',
      selectedPositionId: 'half-guard',
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
    window.location.hash = '#/position/mount';
    const { result } = renderHook(() => useHashRouter());

    act(() => {
      result.current[1]('principles', 'some-id');
    });

    expect(result.current[0]).toEqual({
      currentView: 'principles',
      selectedPositionId: null,
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
    });
  });
});
