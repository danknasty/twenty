import { CandidacyStatus } from 'src/modules/executive-search/common/enums/candidacy-status.enum';

export const CANDIDACY_STATUS_TRANSITIONS: Record<
  CandidacyStatus,
  CandidacyStatus[]
> = {
  [CandidacyStatus.IDENTIFIED]: [
    CandidacyStatus.RESEARCHING,
    CandidacyStatus.OFF_LIMITS,
    CandidacyStatus.CONFLICT,
  ],
  [CandidacyStatus.RESEARCHING]: [CandidacyStatus.RESEARCH_COMPLETE],
  [CandidacyStatus.RESEARCH_COMPLETE]: [CandidacyStatus.CONTACT_PLANNED],
  [CandidacyStatus.CONTACT_PLANNED]: [CandidacyStatus.APPROACHED],
  [CandidacyStatus.APPROACHED]: [
    CandidacyStatus.NO_RESPONSE,
    CandidacyStatus.DECLINED,
    CandidacyStatus.INTERESTED,
  ],
  [CandidacyStatus.INTERESTED]: [CandidacyStatus.QUALIFYING],
  [CandidacyStatus.QUALIFYING]: [CandidacyStatus.QUALIFIED],
  [CandidacyStatus.QUALIFIED]: [CandidacyStatus.LONGLIST],
  [CandidacyStatus.LONGLIST]: [CandidacyStatus.CALIBRATION],
  [CandidacyStatus.CALIBRATION]: [CandidacyStatus.PRESENTED],
  [CandidacyStatus.PRESENTED]: [
    CandidacyStatus.CLIENT_HOLD,
    CandidacyStatus.SHORTLIST,
  ],
  [CandidacyStatus.CLIENT_HOLD]: [CandidacyStatus.SHORTLIST],
  [CandidacyStatus.SHORTLIST]: [CandidacyStatus.CLIENT_INTERVIEW],
  [CandidacyStatus.CLIENT_INTERVIEW]: [CandidacyStatus.FINALIST],
  [CandidacyStatus.FINALIST]: [CandidacyStatus.REFERENCES_STAGE],
  [CandidacyStatus.REFERENCES_STAGE]: [CandidacyStatus.DILIGENCE],
  [CandidacyStatus.DILIGENCE]: [CandidacyStatus.OFFER_NEGOTIATION],
  [CandidacyStatus.OFFER_NEGOTIATION]: [CandidacyStatus.PLACED],
  [CandidacyStatus.NO_RESPONSE]: [CandidacyStatus.FUTURE_FIT],
  [CandidacyStatus.DECLINED]: [CandidacyStatus.FUTURE_FIT],
  // Terminal states (no exits)
  [CandidacyStatus.PLACED]: [],
  [CandidacyStatus.OFF_LIMITS]: [],
  [CandidacyStatus.CONFLICT]: [],
  [CandidacyStatus.FUTURE_FIT]: [],
};
