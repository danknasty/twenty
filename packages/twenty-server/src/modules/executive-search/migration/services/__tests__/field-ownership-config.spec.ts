import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { CutoverStage } from 'src/modules/executive-search/common/enums/cutover-stage.enum';
import { FieldOwnershipAuthority } from 'src/modules/executive-search/common/enums/field-ownership-authority.enum';
import {
  authoritiesAtStage,
  CUTOVER_STAGE_ORDER,
  cutoverStageForRow,
  FIELD_OWNERSHIP_COLLECTIONS,
  FIELD_OWNERSHIP_CONFIG,
  FIELD_OWNERSHIP_ROWS,
  groupRowsByCutoverStage,
  parseCsvLine,
  parseFieldOwnershipCsv,
  rowsTransferringAt,
  stageRank,
} from 'src/modules/executive-search/migration/services/field-ownership-config';

const CSV_PATH = path.resolve(
  __dirname,
  '../../../../../../../../docs/executive-search/directus-field-ownership.csv',
);

const readRawCsv = (): string => readFileSync(CSV_PATH, 'utf8');

describe('field-ownership-config — CSV parsing', () => {
  describe('parseCsvLine', () => {
    it('splits a plain comma line', () => {
      expect(parseCsvLine('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    it('preserves commas inside quoted cells', () => {
      expect(parseCsvLine('executives,"Name, email, phone",DIRECTUS')).toEqual([
        'executives',
        'Name, email, phone',
        'DIRECTUS',
      ]);
    });

    it('unescapes doubled quotes', () => {
      expect(parseCsvLine('"she said ""hi""",x')).toEqual([
        'she said "hi"',
        'x',
      ]);
    });
  });

  describe('parseFieldOwnershipCsv', () => {
    it('parses all 21 rows from the canonical CSV', () => {
      const rows = parseFieldOwnershipCsv(readRawCsv());

      expect(rows).toHaveLength(21);
    });

    it('maps every row to a typed FieldOwnershipAuthority', () => {
      const rows = parseFieldOwnershipCsv(readRawCsv());
      const valid = new Set(Object.values(FieldOwnershipAuthority));

      for (const row of rows) {
        expect(valid.has(row.authority)).toBe(true);
      }
    });

    it('only contains the four documented authority values', () => {
      const rows = parseFieldOwnershipCsv(readRawCsv());
      const authorities = new Set(rows.map((row) => row.authority));

      expect(authorities).toEqual(
        new Set<FieldOwnershipAuthority>([
          FieldOwnershipAuthority.DIRECTUS_AUTHORITATIVE,
          FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
          FieldOwnershipAuthority.SPLIT_BY_FIELD,
          FieldOwnershipAuthority.APPEND_ONLY_BOTH_WITH_SHARED_IDEMPOTENCY,
        ]),
      );
    });

    it('rejects an unknown authority', () => {
      const bad = [
        'collection,field_group,canonical_authority,sync_direction,twenty_behavior,data_classification,source_citation',
        'x,group,NOT_A_REAL_AUTHORITY,Inbound,behavior,class,cite',
      ].join('\n');

      expect(() => parseFieldOwnershipCsv(bad)).toThrow(
        /unknown canonical_authority/,
      );
    });
  });
});

describe('field-ownership-config — stage assignment', () => {
  const rows = FIELD_OWNERSHIP_ROWS;

  it('exposes all five stages in monotonic order', () => {
    expect(CUTOVER_STAGE_ORDER).toEqual([
      CutoverStage.STAGE_0_READONLY,
      CutoverStage.STAGE_1_LINKS,
      CutoverStage.STAGE_2_INBOUND,
      CutoverStage.STAGE_3_OUTBOUND_NARROW,
      CutoverStage.STAGE_4_FULL,
    ]);
  });

  it('stageRank reflects progression', () => {
    expect(stageRank(CutoverStage.STAGE_0_READONLY)).toBe(0);
    expect(stageRank(CutoverStage.STAGE_4_FULL)).toBe(4);
  });

  it('groups every row into exactly one stage (all 21 accounted for)', () => {
    const grouped = groupRowsByCutoverStage(rows);
    const total = grouped.reduce((sum, def) => sum + def.rows.length, 0);

    expect(total).toBe(rows.length);
    expect(grouped.map((def) => def.stage)).toEqual([...CUTOVER_STAGE_ORDER]);
  });

  it('assigns the documented row counts per stage', () => {
    const counts = FIELD_OWNERSHIP_CONFIG.map(
      (def) => def.rows.length,
    );

    // STAGE_0=7 guardrails, STAGE_1=4 identity, STAGE_2=5 inbound,
    // STAGE_3=2 outbound narrow, STAGE_4=3 full.
    expect(counts).toEqual([7, 4, 5, 2, 3]);
  });

  it('places ats_uuid identity rows at STAGE_1_LINKS', () => {
    const stage1 = rowsTransferringAt(CutoverStage.STAGE_1_LINKS);
    const atsUuidRows = stage1.filter((row) => row.fieldGroup === 'ats_uuid');

    // executives, companies, opportunities each declare an ats_uuid row.
    expect(atsUuidRows.map((row) => row.collection).sort()).toEqual([
      'companies',
      'executives',
      'opportunities',
    ]);
    for (const row of atsUuidRows) {
      expect(row.authority).toBe(FieldOwnershipAuthority.TWENTY_AUTHORITATIVE);
    }
  });

  it('places append-only stage history at STAGE_4_FULL', () => {
    const stage4 = rowsTransferringAt(CutoverStage.STAGE_4_FULL);
    const stageHistory = stage4.find((row) =>
      row.fieldGroup.startsWith('Stage history'),
    );

    expect(stageHistory).toBeDefined();
    expect(stageHistory?.authority).toBe(
      FieldOwnershipAuthority.APPEND_ONLY_BOTH_WITH_SHARED_IDEMPOTENCY,
    );
  });

  it('cutoverStageForRow is consistent with the grouped config', () => {
    for (const def of FIELD_OWNERSHIP_CONFIG) {
      for (const row of def.rows) {
        expect(cutoverStageForRow(row)).toBe(def.stage);
      }
    }
  });
});

describe('field-ownership-config — authoritiesAtStage', () => {
  it('resolves a per-collection authority rollup at STAGE_1', () => {
    const states = authoritiesAtStage(
      FIELD_OWNERSHIP_ROWS,
      CutoverStage.STAGE_1_LINKS,
    );
    const map = new Map(states.map((s) => [s.collection, s]));

    // opportunities first transfers its ats_uuid (TWENTY) at STAGE_1.
    expect(map.get('opportunities')?.authority).toBe(
      FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
    );
  });

  it('evolves a collection authority as stages advance', () => {
    const at1 = new Map(
      authoritiesAtStage(
        FIELD_OWNERSHIP_ROWS,
        CutoverStage.STAGE_1_LINKS,
      ).map((s) => [s.collection, s.authority]),
    );
    const at4 = new Map(
      authoritiesAtStage(
        FIELD_OWNERSHIP_ROWS,
        CutoverStage.STAGE_4_FULL,
      ).map((s) => [s.collection, s.authority]),
    );

    // applications: at STAGE_1 only its internal TWENTY guardrail is in
    // effect; by STAGE_4 the append-only stage-history row wins.
    expect(at1.get('applications')).toBe(
      FieldOwnershipAuthority.TWENTY_AUTHORITATIVE,
    );
    expect(at4.get('applications')).toBe(
      FieldOwnershipAuthority.APPEND_ONLY_BOTH_WITH_SHARED_IDEMPOTENCY,
    );
  });

  it('exposes all five collections', () => {
    expect(FIELD_OWNERSHIP_COLLECTIONS).toEqual([
      'executives',
      'companies',
      'opportunities',
      'applications',
      'scheduled_interviews',
    ]);
  });
});
