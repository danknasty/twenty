export enum CriterionAssessmentSource {
  /** Human assessor manually evaluated the candidate against the criterion */
  HUMAN = 'human',
  /** AI generated a shadow assessment — must be reviewed by a human before use */
  AI_SHADOW = 'ai_shadow',
}
