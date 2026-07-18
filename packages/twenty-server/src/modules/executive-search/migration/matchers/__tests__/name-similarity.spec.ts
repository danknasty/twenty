import {
  bucketNameScore,
  bucketToConfidence,
  compareNameStrings,
  jaroSimilarity,
  jaroWinklerSimilarity,
  normalizeString,
  STRONG_NAME_MATCH_THRESHOLD,
  tokenize,
  WEAK_NAME_MATCH_THRESHOLD,
} from 'src/modules/executive-search/migration/matchers/name-similarity.util';
import { IdentityMatchConfidence } from 'src/modules/executive-search/common/enums/identity-match-confidence.enum';

describe('name-similarity util', () => {
  describe('normalizeString', () => {
    it('lowercases, trims, strips punctuation, collapses whitespace', () => {
      expect(normalizeString('  Jane  Marie, Doe!  ')).toBe('jane marie doe');
    });

    it('returns empty string for null/undefined/whitespace', () => {
      expect(normalizeString(null)).toBe('');
      expect(normalizeString(undefined)).toBe('');
      expect(normalizeString('   ')).toBe('');
    });

    it('preserves unicode letters and digits', () => {
      expect(normalizeString('Renée Müller-Zurich123')).toBe(
        'renée müller zurich123',
      );
    });
  });

  describe('tokenize', () => {
    it('produces a sorted, de-duplicated token array', () => {
      expect(tokenize('Doe Jane Doe')).toEqual(['doe', 'jane']);
    });

    it('returns empty array for empty input', () => {
      expect(tokenize('')).toEqual([]);
    });
  });

  describe('jaroSimilarity', () => {
    it('is 1 for identical strings', () => {
      expect(jaroSimilarity('martha', 'martha')).toBe(1);
    });

    it('is 0 for empty inputs', () => {
      expect(jaroSimilarity('', 'abc')).toBe(0);
    });

    it('matches the canonical MARTHA / MARHTA example', () => {
      // Classic Jaro reference value: 0.944...
      expect(jaroSimilarity('MARTHA', 'MARHTA')).toBeCloseTo(0.9444, 3);
    });
  });

  describe('jaroWinklerSimilarity', () => {
    it('is 1 for identical strings', () => {
      expect(jaroWinklerSimilarity('jane', 'jane')).toBe(1);
    });

    it('rewards common prefixes more than raw Jaro', () => {
      const a = 'johnson';
      const b = 'johnsen';
      expect(jaroWinklerSimilarity(a, b)).toBeGreaterThan(jaroSimilarity(a, b));
    });
  });

  describe('bucketNameScore — documented thresholds', () => {
    it('scores >= 0.92 are STRONG', () => {
      expect(bucketNameScore(0.92)).toBe('STRONG');
      expect(bucketNameScore(1)).toBe('STRONG');
    });

    it('scores in [0.80, 0.92) are WEAK', () => {
      expect(bucketNameScore(0.8)).toBe('WEAK');
      expect(bucketNameScore(0.919)).toBe('WEAK');
    });

    it('scores below 0.80 are NONE', () => {
      expect(bucketNameScore(0.799)).toBe('NONE');
      expect(bucketNameScore(0)).toBe('NONE');
    });

    it('threshold constants match the documented contract', () => {
      expect(STRONG_NAME_MATCH_THRESHOLD).toBe(0.92);
      expect(WEAK_NAME_MATCH_THRESHOLD).toBe(0.8);
    });
  });

  describe('bucketToConfidence', () => {
    it('maps STRONG → MEDIUM, WEAK → LOW, NONE → NONE', () => {
      expect(bucketToConfidence('STRONG')).toBe(IdentityMatchConfidence.MEDIUM);
      expect(bucketToConfidence('WEAK')).toBe(IdentityMatchConfidence.LOW);
      expect(bucketToConfidence('NONE')).toBe(IdentityMatchConfidence.NONE);
    });
  });

  describe('compareNameStrings — boundary behavior', () => {
    it('returns score 1 + STRONG for identical normalized names', () => {
      const result = compareNameStrings('Jane Doe', 'Jane Doe');

      expect(result.score).toBe(1);
      expect(result.bucket).toBe('STRONG');
    });

    it('is order-independent (token reordering)', () => {
      const result = compareNameStrings('Jane Doe', 'Doe, Jane');

      expect(result.bucket).toBe('STRONG');
    });

    it('returns NONE when either side is empty', () => {
      expect(compareNameStrings('', 'Jane Doe').bucket).toBe('NONE');
      expect(compareNameStrings('Jane Doe', null).bucket).toBe('NONE');
    });

    it('classifies a near-identical name as STRONG (>= 0.92)', () => {
      // Strong: a single transposition / minor typo on a long name.
      const result = compareNameStrings('Alexander Hamilton', 'Alexnader Hamilton');

      expect(result.score).toBeGreaterThanOrEqual(STRONG_NAME_MATCH_THRESHOLD);
      expect(result.bucket).toBe('STRONG');
    });

    it('classifies a clearly different name as NONE (< 0.80)', () => {
      const result = compareNameStrings('Jane Doe', 'Wolfgang Amadeus Mozart');

      expect(result.bucket).toBe('NONE');
    });

    it('handles case + punctuation differences as STRONG', () => {
      const result = compareNameStrings('JANE  doe!', 'jane doe');

      expect(result.bucket).toBe('STRONG');
    });
  });
});
