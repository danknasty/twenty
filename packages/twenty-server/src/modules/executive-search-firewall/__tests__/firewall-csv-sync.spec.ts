import * as fs from 'fs';
import * as path from 'path';

import { FirewallContext } from 'src/modules/executive-search-firewall/constants/firewall-contexts.constant';
import { FIREWALL_PROHIBITED_SELECTORS } from 'src/modules/executive-search-firewall/constants/firewall-prohibited-selectors.constant';
import { FIREWALL_DENYLIST_PATTERNS, DenylistRule } from 'src/modules/executive-search-firewall/constants/firewall-denylist-patterns.constant';

const CSV_ROOT = path.resolve(__dirname, '../../../../../../docs/executive-search');

interface FirewallCsvRow {
  prohibited_selector: string;
  context: string;
  status: string;
  rule: string;
}

interface DenylistCsvRow {
  field_or_pattern: string;
  data_classification: string;
  rule: string;
  reason: string;
}

const parseCsv = <T extends Record<string, string>>(
  content: string,
): T[] => {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] ?? '';
    });
    return row as unknown as T;
  });
};

describe('firewall-csv-sync', () => {
  describe('commercial-selection-firewall.csv', () => {
    const csvPath = path.join(CSV_ROOT, 'commercial-selection-firewall.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    it('exists and is non-empty', () => {
      expect(csvContent).toBeTruthy();
      expect(csvContent.trim().length).toBeGreaterThan(0);
    });

    it('transcribes all rows into FIREWALL_PROHIBITED_SELECTORS', () => {
      const rows = parseCsv<FirewallCsvRow>(csvContent);

      expect(rows.length).toBeGreaterThan(0);

      const totalEntries = Object.values(FIREWALL_PROHIBITED_SELECTORS).reduce(
        (sum, entries) => sum + entries.length,
        0,
      );

      expect(totalEntries).toBe(rows.length);
    });

    it('maps every CSV context to a valid FirewallContext enum value', () => {
      const rows = parseCsv<FirewallCsvRow>(csvContent);
      const validContexts = Object.values(FirewallContext);

      for (const row of rows) {
        expect(validContexts).toContain(row.context);
      }
    });

    it('matches each CSV row to a corresponding TS constant entry', () => {
      const rows = parseCsv<FirewallCsvRow>(csvContent);

      for (const row of rows) {
        const context = row.context as FirewallContext;
        const entries = FIREWALL_PROHIBITED_SELECTORS[context];

        expect(entries).toBeDefined();

        const matchingEntry = entries.find(
          (e) => e.selector === row.prohibited_selector,
        );
        expect(matchingEntry).toBeDefined();
        expect(matchingEntry!.rule).toBe(row.rule);
      }
    });
  });

  describe('candidate-facing-nonreplication-denylist.csv', () => {
    const csvPath = path.join(
      CSV_ROOT,
      'candidate-facing-nonreplication-denylist.csv',
    );
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    it('exists and is non-empty', () => {
      expect(csvContent).toBeTruthy();
      expect(csvContent.trim().length).toBeGreaterThan(0);
    });

    it('transcribes all rows into FIREWALL_DENYLIST_PATTERNS', () => {
      const rows = parseCsv<DenylistCsvRow>(csvContent);

      expect(rows.length).toBeGreaterThan(0);
      expect(FIREWALL_DENYLIST_PATTERNS.length).toBe(rows.length);
    });

    it('maps every denylist rule to a valid DenylistRule enum value', () => {
      const rows = parseCsv<DenylistCsvRow>(csvContent);
      const validRules = Object.values(DenylistRule);

      for (const row of rows) {
        expect(validRules).toContain(row.rule);
      }
    });

    it('matches each CSV row to a corresponding TS constant entry', () => {
      const rows = parseCsv<DenylistCsvRow>(csvContent);

      for (const row of rows) {
        const matchingEntry = FIREWALL_DENYLIST_PATTERNS.find(
          (e) => e.fieldOrPattern === row.field_or_pattern,
        );

        expect(matchingEntry).toBeDefined();
        expect(matchingEntry!.dataClassification).toBe(
          row.data_classification,
        );
        expect(matchingEntry!.rule).toBe(row.rule as DenylistRule);
        expect(matchingEntry!.reason).toBe(row.reason);
      }
    });
  });
});
