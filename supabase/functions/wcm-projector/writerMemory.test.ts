import { describe, expect, it } from 'vitest';
import {
  parseWriterMemory,
  parseWriterMemoryItem,
  resolveWriterMemoryCollection,
} from './writerMemory.ts';

const base = {
  memory_id: 'WM-001',
  scope: 'Tommaso',
  category: 'CHARACTER',
  guidance: 'Tommaso non spiega mai la propria epistemologia in modo diretto.',
  origin_type: 'BOARD_DECISION',
  origin_ref: 'CH07-BOARD',
  origin_context: 'Editorial Board Report CH07',
  status: 'ACTIVE',
  source_path: 'projects/prima-di-noi/memory/writer-memory.md',
  source_sha: 'abc123',
};

describe('writer_memory · contratto esatto', () => {
  it('accetta un item valido e impone il project_id server-side', () => {
    const parsed = parseWriterMemoryItem({ ...base, project_id: 'altro' }, 'prima-di-noi');
    expect('row' in parsed).toBe(true);
    if (!('row' in parsed)) return;
    expect(parsed.row.project_id).toBe('prima-di-noi');
    expect(parsed.row.memory_id).toBe('WM-001');
    expect(parsed.row.status).toBe('ACTIVE');
  });

  it('richiede memory_id, scope, guidance, status', () => {
    for (const field of ['memory_id', 'scope', 'guidance', 'status']) {
      const item: Record<string, unknown> = { ...base };
      delete item[field];
      expect('error' in parseWriterMemoryItem(item, 'prima-di-noi')).toBe(true);
    }
  });

  it('rifiuta status fuori enum e accetta i tre stati ammessi', () => {
    for (const status of ['ACTIVE', 'SUPERSEDED', 'CLOSED']) {
      expect('row' in parseWriterMemoryItem({ ...base, status }, 'prima-di-noi')).toBe(true);
    }
    expect('error' in parseWriterMemoryItem({ ...base, status: 'active' }, 'prima-di-noi')).toBe(true);
    expect('error' in parseWriterMemoryItem({ ...base, status: 'ARCHIVED' }, 'prima-di-noi')).toBe(true);
  });

  it('rifiuta campi non in whitelist', () => {
    expect('error' in parseWriterMemoryItem({ ...base, extra: 'x' }, 'prima-di-noi')).toBe(true);
  });

  it('confina source_path dentro projects/<project_id>/', () => {
    expect('error' in parseWriterMemoryItem({ ...base, source_path: 'projects/altro/x.md' }, 'prima-di-noi')).toBe(true);
    expect('error' in parseWriterMemoryItem({ ...base, source_path: 'projects/prima-di-noi/../x.md' }, 'prima-di-noi')).toBe(true);
  });

  it('accetta categorie future e category assente', () => {
    const parsed = parseWriterMemoryItem({ ...base, category: 'FUTURE_KIND' }, 'prima-di-noi');
    expect('row' in parsed).toBe(true);
    const noCat: Record<string, unknown> = { ...base };
    delete noCat.category;
    const parsed2 = parseWriterMemoryItem(noCat, 'prima-di-noi');
    expect('row' in parsed2 && parsed2.row.category).toBe(null);
  });

  it('rifiuta memory_id duplicati e non-array', () => {
    expect('error' in (parseWriterMemory('x', 'prima-di-noi') as object)).toBe(true);
    const dup = parseWriterMemory([base, { ...base }], 'prima-di-noi');
    expect(Array.isArray(dup)).toBe(false);
  });

  it('accetta lineage come metadata opzionale ma non lo persiste', () => {
    const parsed = parseWriterMemoryItem(
      { ...base, lineage: { from: 'CH07', chain: ['a', 'b'] } },
      'prima-di-noi',
    );
    expect('row' in parsed).toBe(true);
    if (!('row' in parsed)) return;
    expect('lineage' in parsed.row).toBe(false);
    expect(parsed.row.memory_id).toBe('WM-001');
  });

  it('rifiuta comunque campi sconosciuti diversi da lineage', () => {
    const parsed = parseWriterMemoryItem({ ...base, lineage: 'x', bogus: 1 }, 'prima-di-noi');
    expect('error' in parsed).toBe(true);
    if (!('error' in parsed)) return;
    expect(parsed.fields).toEqual(['bogus']);
  });

  it('assegna sort_order posizionale quando assente', () => {
    const item: Record<string, unknown> = { ...base };
    delete item.sort_order;
    const rows = parseWriterMemory([item, { ...item, memory_id: 'WM-002' }], 'prima-di-noi');
    expect(Array.isArray(rows)).toBe(true);
    if (!Array.isArray(rows)) return;
    expect(rows[1].sort_order).toBe(1);
  });
});

describe('writer_memory · confine non-fatale nel projector', () => {
  it('writer_memory valida produce payload snapshot invariato', () => {
    const resolved = resolveWriterMemoryCollection([base], 'prima-di-noi');
    expect('payload' in resolved).toBe(true);
    if (!('payload' in resolved)) return;
    expect(resolved.payload.snapshot).toBe(true);
    expect(resolved.payload.rows).toHaveLength(1);
    expect(resolved.payload.rows[0].memory_id).toBe('WM-001');
  });

  it('flag partial disattiva la semantica snapshot', () => {
    const resolved = resolveWriterMemoryCollection([base], 'prima-di-noi', true);
    expect('payload' in resolved && resolved.payload.snapshot).toBe(false);
  });

  it('writer_memory con lineage resta valida e proiettabile', () => {
    const resolved = resolveWriterMemoryCollection(
      [{ ...base, lineage: ['CH07-BOARD'] }],
      'prima-di-noi',
    );
    expect('payload' in resolved).toBe(true);
    if (!('payload' in resolved)) return;
    expect('lineage' in resolved.payload.rows[0]).toBe(false);
  });

  it('writer_memory invalida produce solo un warning: nessun abort della projection core', () => {
    const resolved = resolveWriterMemoryCollection([{ ...base, bogus: 1 }], 'prima-di-noi');
    expect('warning' in resolved).toBe(true);
    if (!('warning' in resolved)) return;
    expect(resolved.warning.collection).toBe('writer_memory');
    expect(resolved.warning.skipped).toBe(true);
    expect(resolved.warning.error).toBe('Unsupported writer_memory fields');
  });

  it('writer_memory non-array produce warning invece di errore fatale', () => {
    const resolved = resolveWriterMemoryCollection('nope', 'prima-di-noi');
    expect('warning' in resolved).toBe(true);
    if (!('warning' in resolved)) return;
    expect(resolved.warning.error).toBe('writer_memory must be an array');
  });
});
