import { describe, expect, it } from 'vitest';
import { parseExecutionWorkflow, parseExecutionWorkflows } from './execution.ts';

const base = {
  workflow_instance_id: 'WF-001',
  workflow: 'PROLOGUE_BOARD_GATE',
  status: 'WAITING_AUTHORITY',
  true_stop_condition: 'Decisione board registrata',
  resume_required: false,
  source_path: 'projects/prima-di-noi/runtime/workflows/WF-001.json',
};

describe('DEC-012/013 · exact execution_workflows contract', () => {
  it('accetta exact enum ed enforce project_id', () => {
    const parsed = parseExecutionWorkflow({ ...base, project_id: 'altro-progetto' }, 'prima-di-noi');
    expect('row' in parsed).toBe(true);
    if (!('row' in parsed)) return;
    expect(parsed.row.status).toBe('WAITING_AUTHORITY');
    expect(parsed.row.project_id).toBe('prima-di-noi');
    expect(parsed.row.resume_required).toBe(false);
    expect(parsed.row.authority_refs).toEqual([]);
  });

  it('rifiuta status fuzzy o fuori enum', () => {
    expect('error' in parseExecutionWorkflow({ ...base, status: 'waiting-authority' }, 'prima-di-noi')).toBe(true);
    expect('error' in parseExecutionWorkflow({ ...base, status: 'SLEEPING' }, 'prima-di-noi')).toBe(true);
  });

  it('rifiuta resume_required non boolean o mancante', () => {
    expect('error' in parseExecutionWorkflow({ ...base, resume_required: 'false' }, 'prima-di-noi')).toBe(true);
    const { resume_required: _omit, ...rest } = base;
    expect('error' in parseExecutionWorkflow(rest, 'prima-di-noi')).toBe(true);
  });

  it('rifiuta campi required mancanti', () => {
    const { true_stop_condition: _omit, ...rest } = base;
    expect('error' in parseExecutionWorkflow(rest, 'prima-di-noi')).toBe(true);
  });

  it('impone il boundary di source_path', () => {
    expect(
      'error' in parseExecutionWorkflow(
        { ...base, source_path: 'projects/prima-di-noi/kb/WF.json' },
        'prima-di-noi',
      ),
    ).toBe(true);
    expect(
      'error' in parseExecutionWorkflow(
        { ...base, source_path: 'projects/prima-di-noi/runtime/workflows/WF.md' },
        'prima-di-noi',
      ),
    ).toBe(true);
    expect(
      'error' in parseExecutionWorkflow(
        { ...base, source_path: 'projects/altro/runtime/workflows/WF.json' },
        'prima-di-noi',
      ),
    ).toBe(true);
  });

  it('accetta solo strutture JSON native per array e object', () => {
    const parsed = parseExecutionWorkflow(
      {
        ...base,
        authority_refs: ['DEC-013'],
        completed_step_ids: ['S1', 'S2'],
        interruption_evidence: ['evidenza'],
        completion_gate: { gate: 'BOARD' },
      },
      'prima-di-noi',
    );
    if (!('row' in parsed)) throw new Error('parse failed');
    expect(parsed.row.authority_refs).toEqual(['DEC-013']);
    expect(parsed.row.completed_step_ids).toEqual(['S1', 'S2']);
    expect(parsed.row.interruption_evidence).toEqual(['evidenza']);
    expect(parsed.row.completion_gate).toEqual({ gate: 'BOARD' });

    expect(
      'error' in parseExecutionWorkflow({ ...base, completed_step_ids: '["S1"]' }, 'prima-di-noi'),
    ).toBe(true);
    expect(
      'error' in parseExecutionWorkflow({ ...base, completion_gate: '{"gate":"BOARD"}' }, 'prima-di-noi'),
    ).toBe(true);
  });

  it('rifiuta COMPLETED contrario al Completion Gate', () => {
    expect(
      'error' in parseExecutionWorkflow(
        { ...base, status: 'COMPLETED', completion_gate: { closure_allowed: false } },
        'prima-di-noi',
      ),
    ).toBe(true);
  });

  it('rifiuta workflow_instance_id duplicati e accetta liste vuote', () => {
    expect('error' in (parseExecutionWorkflows([base, base], 'prima-di-noi') as object)).toBe(true);
    expect(parseExecutionWorkflows([], 'prima-di-noi')).toEqual([]);
  });
});
