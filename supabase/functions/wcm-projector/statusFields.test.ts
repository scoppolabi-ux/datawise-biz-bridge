import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const source = readFileSync(
  fileURLToPath(new URL('./index.ts', import.meta.url)),
  'utf8',
);

const statusFieldsBlock = source.slice(
  source.indexOf('const STATUS_FIELDS'),
  source.indexOf('const META_FIELDS'),
);

const WRITER_MEMORY_STATUS_FIELDS = [
  'writer_memory_processing_status',
  'writer_memory_review_status',
  'writer_memory_review_open_count',
];

describe('wcm-projector status transport', () => {
  it('accetta i tre campi osservativi Writer Memory Review nella projection', () => {
    for (const field of WRITER_MEMORY_STATUS_FIELDS) {
      expect(statusFieldsBlock).toContain(`'${field}'`);
    }
  });

  it('persiste i campi via ALL_STATUS_FIELDS (insert + diff idempotente)', () => {
    // insert path
    expect(source).toContain('for (const field of ALL_STATUS_FIELDS)');
    // diff path
    expect(source).toContain(
      'if (!sameValue(field, incoming[field], (current as Record<string, unknown>)[field]))',
    );
    expect(source).toContain(
      'const ALL_STATUS_FIELDS = [...STATUS_FIELDS, ...META_FIELDS]',
    );
  });

  it('non introduce campi board o command surface aggiuntivi', () => {
    // Board block mapping stays exactly as before.
    for (const key of [
      'needs_stefano',
      'reason',
      'action_requested',
      'verdict',
      'narrative_mass',
      'review_summary',
    ]) {
      expect(source).toContain(`${key}:`);
    }
    expect(source).not.toContain('writer_memory_resolve');
  });

  it('mantiene la whitelist stretta: campi projection sconosciuti sono rifiutati', () => {
    expect(source).toContain("return json({ error: 'Unsupported projection fields'");
  });

  it('accetta i need WRITER_MEMORY_AUTHORITY tramite la collection generica needs', () => {
    // No special-cased need_type: needs flow through the generic collection config.
    expect(source).not.toContain('WRITER_MEMORY_AUTHORITY');
    expect(source).toContain("key: 'need_id'");
  });
});
