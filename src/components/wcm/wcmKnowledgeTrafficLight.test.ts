import { describe, expect, it } from 'vitest';
import {
  effectiveHealthStatus,
  knowledgeScoreOf,
  knowledgeTrafficLight,
  normalizeHealthStatus,
} from './wcmKnowledge';
import type { WcmKnowledgeHealth } from '@/hooks/useWcmKnowledgeHealth';

const health = (over: Partial<WcmKnowledgeHealth> = {}) =>
  ({ health_status: 'HEALTHY', knowledge_integrity_score: 94, ...over }) as WcmKnowledgeHealth;

describe('semaforo Knowledge Health', () => {
  it('mappa CURRENT/HEALTHY su verde', () => {
    expect(normalizeHealthStatus('CURRENT')).toBe('HEALTHY');
    const light = knowledgeTrafficLight(effectiveHealthStatus(health({ health_status: 'CURRENT' })));
    expect(light.tone).toBe('green');
    expect(light.label).toBe('Conoscenza in salute');
  });

  it('mappa DEGRADED su giallo e CRITICAL su rosso', () => {
    expect(knowledgeTrafficLight('DEGRADED').tone).toBe('amber');
    expect(knowledgeTrafficLight('DEGRADED').label).toBe('Conoscenza da monitorare');
    expect(knowledgeTrafficLight('CRITICAL').tone).toBe('red');
    expect(knowledgeTrafficLight('CRITICAL').label).toBe('Conoscenza bloccante');
  });

  it('resta neutro su stato assente o sconosciuto', () => {
    expect(knowledgeTrafficLight(effectiveHealthStatus(null)).tone).toBe('neutral');
    expect(knowledgeTrafficLight(effectiveHealthStatus(health({ health_status: 'WAT' }))).label).toBe(
      'Knowledge Health non disponibile',
    );
  });

  it('espone il punteggio solo se numerico', () => {
    expect(knowledgeScoreOf(health())).toBe(94);
    expect(knowledgeScoreOf(health({ knowledge_integrity_score: null }))).toBeNull();
    expect(knowledgeScoreOf(null)).toBeNull();
  });
});
