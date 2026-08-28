import { describe, expect, it } from 'vitest';
import {
  isSafeManifestPath,
  maintenanceStatusLabel,
  maintenanceStatusTone,
  manifestLink,
} from './wcmSystemMaintenance';

describe('maintenanceStatusLabel', () => {
  it('maps the declared statuses to italian labels', () => {
    expect(maintenanceStatusLabel('OPEN')).toBe('Aperto');
    expect(maintenanceStatusLabel('READY_FOR_CLOSURE')).toBe('Pronto per la chiusura');
    expect(maintenanceStatusLabel('CLOSED')).toBe('Chiuso');
    expect(maintenanceStatusLabel('FAILED')).toBe('Fallito');
  });

  it('never infers a closure that the source does not declare', () => {
    expect(maintenanceStatusLabel('READY_FOR_CLOSURE')).not.toBe('Chiuso');
    expect(maintenanceStatusTone('READY_FOR_CLOSURE')).toBe('ready');
  });

  it('echoes unknown statuses without deduction', () => {
    expect(maintenanceStatusLabel('WEIRD_STATE')).toBe('Stato: WEIRD_STATE');
    expect(maintenanceStatusTone('WEIRD_STATE')).toBe('unknown');
    expect(maintenanceStatusLabel(null)).toBe('Stato non dichiarato');
  });
});

describe('manifest path allowlist', () => {
  const valid = 'wcm/change-manifests/WCM-CHANGE-2026-08-28-MAINT.json';

  it('accepts an exact allowlisted change manifest path', () => {
    expect(isSafeManifestPath(valid)).toBe(true);
    expect(manifestLink(valid)).toBe(
      `https://github.com/scoppolabi-ux/WCM-LAB/blob/main/${valid}`,
    );
  });

  it('fails closed for any other path', () => {
    for (const path of [
      '',
      null,
      undefined,
      'wcm/change-manifests/OTHER.json',
      'wcm/change-manifests/WCM-CHANGE-x.md',
      'projects/prima-di-noi/doc.md',
      '/wcm/change-manifests/WCM-CHANGE-x.json',
      'wcm/change-manifests/../../secret/WCM-CHANGE-x.json',
      'https://evil.example/WCM-CHANGE-x.json',
      'wcm/change-manifests//WCM-CHANGE-x.json',
    ]) {
      expect(isSafeManifestPath(path as string | null | undefined)).toBe(false);
      expect(manifestLink(path as string | null | undefined)).toBeNull();
    }
  });
});
