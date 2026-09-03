import { describe, expect, it } from 'vitest';
import { writerMemoryStatusLabel } from './WcmWriterMemoryStatusBadge';

describe('writerMemoryStatusLabel', () => {
  it('ritorna null quando il read-model non espone i campi', () => {
    expect(writerMemoryStatusLabel({})).toBeNull();
    expect(
      writerMemoryStatusLabel({
        writer_memory_processing_status: null,
        writer_memory_review_status: null,
        writer_memory_review_open_count: null,
      }),
    ).toBeNull();
  });

  it('mostra processing + review quando entrambi presenti', () => {
    expect(
      writerMemoryStatusLabel({
        writer_memory_processing_status: 'IN_PROGRESS',
        writer_memory_review_status: 'PENDING',
      }),
    ).toBe('Writer Memory: IN_PROGRESS · PENDING');
    expect(
      writerMemoryStatusLabel({
        writer_memory_processing_status: 'DONE',
        writer_memory_review_status: 'COMPLETED',
      }),
    ).toBe('Writer Memory: DONE · COMPLETED');
  });

  it('mostra il solo stato disponibile se l’altro manca', () => {
    expect(
      writerMemoryStatusLabel({ writer_memory_review_status: 'PENDING' }),
    ).toBe('Writer Memory: PENDING');
  });

  it('aggiunge il conteggio review aperte solo quando positivo', () => {
    expect(
      writerMemoryStatusLabel({
        writer_memory_processing_status: 'DONE',
        writer_memory_review_status: 'PENDING',
        writer_memory_review_open_count: 3,
      }),
    ).toBe('Writer Memory: DONE · PENDING · 3 aperte');
    expect(
      writerMemoryStatusLabel({
        writer_memory_review_status: 'COMPLETED',
        writer_memory_review_open_count: 0,
      }),
    ).toBe('Writer Memory: COMPLETED');
  });
});
