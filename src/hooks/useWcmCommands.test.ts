import { describe, expect, it } from 'vitest';
import {
  COMMAND_DELIVERY_DELAY_MS,
  isCommandDeliveryDelayed,
  type WcmCommandRequest,
} from './useWcmCommands';

const cmd = (
  overrides: Partial<Pick<WcmCommandRequest, 'status' | 'created_at'>>,
): Pick<WcmCommandRequest, 'status' | 'created_at'> => ({
  status: 'SUBMITTED',
  created_at: '2026-08-26T10:00:00Z',
  ...overrides,
});

const base = new Date('2026-08-26T10:00:00Z').getTime();

describe('isCommandDeliveryDelayed', () => {
  it('is false for a freshly submitted command', () => {
    expect(isCommandDeliveryDelayed(cmd({}), base + 60_000)).toBe(false);
  });

  it('is true once SUBMITTED exceeds the 10 minute threshold', () => {
    expect(isCommandDeliveryDelayed(cmd({}), base + COMMAND_DELIVERY_DELAY_MS)).toBe(true);
    expect(isCommandDeliveryDelayed(cmd({}), base + COMMAND_DELIVERY_DELAY_MS + 1)).toBe(true);
  });

  it('never applies to non-SUBMITTED statuses', () => {
    for (const status of ['CLAIMED', 'RECORDED', 'STALE', 'REJECTED', 'FAILED'] as const) {
      expect(isCommandDeliveryDelayed(cmd({ status }), base + COMMAND_DELIVERY_DELAY_MS)).toBe(
        false,
      );
    }
  });

  it('handles missing or invalid input safely', () => {
    expect(isCommandDeliveryDelayed(null)).toBe(false);
    expect(isCommandDeliveryDelayed(undefined)).toBe(false);
    expect(isCommandDeliveryDelayed(cmd({ created_at: 'not-a-date' }), base)).toBe(false);
  });
});
