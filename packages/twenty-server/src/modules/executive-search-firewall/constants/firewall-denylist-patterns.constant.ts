export enum DenylistRule {
  NO_SYNC = 'NO_SYNC',
  NO_SYNC_SELECTION = 'NO_SYNC_SELECTION',
  NO_SYNC_INDIVIDUAL = 'NO_SYNC_INDIVIDUAL',
  NO_SYNC_ORDINARY_CONTEXT = 'NO_SYNC_ORDINARY_CONTEXT',
  REFERENCE_ONLY = 'REFERENCE_ONLY',
  QUARANTINE = 'QUARANTINE',
}

export type DenylistPattern = {
  fieldOrPattern: string;
  dataClassification: string;
  rule: DenylistRule;
  reason: string;
};

export const FIREWALL_DENYLIST_PATTERNS: DenylistPattern[] = [
  {
    fieldOrPattern: 'executives.subscription_tier',
    dataClassification: 'Commercial/subscription data',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never enters search, AI context, client reports, or pipeline automation',
  },
  {
    fieldOrPattern: 'executives.plan_level',
    dataClassification: 'Commercial/subscription data',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never enters search, AI context, client reports, or pipeline automation',
  },
  {
    fieldOrPattern: 'executives.is_premium',
    dataClassification: 'Commercial/subscription data',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never enters search, AI context, client reports, or pipeline automation',
  },
  {
    fieldOrPattern: 'executives.birthdate',
    dataClassification: 'Restricted personal data',
    rule: DenylistRule.NO_SYNC_SELECTION,
    reason:
      'No indexing, search, rank, AI/client output; compliance reference only',
  },
  {
    fieldOrPattern: 'executives.gender',
    dataClassification: 'Restricted personal data',
    rule: DenylistRule.NO_SYNC_SELECTION,
    reason:
      'No indexing, search, rank, AI/client output; compliance reference only',
  },
  {
    fieldOrPattern: 'candidate_demographics_voluntary.*',
    dataClassification: 'Restricted voluntary demographics',
    rule: DenylistRule.NO_SYNC_INDIVIDUAL,
    reason:
      'Aggregate-only by approved policy; never individual recruiter/search/AI context',
  },
  {
    fieldOrPattern: 'candidate_demographics_justification.*',
    dataClassification: 'Restricted compliance data',
    rule: DenylistRule.REFERENCE_ONLY,
    reason: 'Compliance officer access only',
  },
  {
    fieldOrPattern: 'accommodation_requests.medical_documents',
    dataClassification: 'Restricted medical data',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Medical docs remain in Directus/restricted store; evaluators must not see',
  },
  {
    fieldOrPattern: 'executive_settings.stripe_customer_id',
    dataClassification: 'Commercial/payment data',
    rule: DenylistRule.NO_SYNC,
    reason: 'Never replicated into search delivery',
  },
  {
    fieldOrPattern: 'executive_settings.password/security_fields',
    dataClassification: 'Authentication/security secret',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never copy password, token, TFA secret, or auth payload',
  },
  {
    fieldOrPattern: 'executive_psychographic.*',
    dataClassification: 'Restricted legacy assessment',
    rule: DenylistRule.NO_SYNC_ORDINARY_CONTEXT,
    reason: 'Not allowed in automated selection by default',
  },
  {
    fieldOrPattern: 'magic_auth_challenges.otp_ciphertext_hash',
    dataClassification: 'Authentication/security secret',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never copy OTP/token ciphertext/hash/attempts into ATS records',
  },
  {
    fieldOrPattern: 'magic_auth_events.*',
    dataClassification: 'Authentication/security secret',
    rule: DenylistRule.NO_SYNC,
    reason: 'Aggregate health telemetry only',
  },
  {
    fieldOrPattern: 'directus_users.password_hash',
    dataClassification: 'Authentication/security secret',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Never replicate password hash, token, TFA secret, auth data',
  },
  {
    fieldOrPattern: 'executive_settings.product_engagement_metrics',
    dataClassification: 'Commercial engagement data',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Candidate-service telemetry excluded from search delivery',
  },
  {
    fieldOrPattern: 'ai_application_analysis.culture_fit_score',
    dataClassification: 'Risky legacy AI output',
    rule: DenylistRule.QUARANTINE,
    reason:
      'Excluded from automatic progression and default client reports',
  },
  {
    fieldOrPattern: 'ai_application_analysis.success_probability',
    dataClassification: 'Risky legacy AI output',
    rule: DenylistRule.QUARANTINE,
    reason:
      'Excluded from automatic progression and default client reports',
  },
  {
    fieldOrPattern: 'ai_application_analysis.matching_score',
    dataClassification: 'Risky legacy AI output',
    rule: DenylistRule.QUARANTINE,
    reason:
      'Excluded from automatic progression and default client reports',
  },
  {
    fieldOrPattern: 'ai_application_analysis.competitive_analysis',
    dataClassification: 'Risky legacy AI output',
    rule: DenylistRule.QUARANTINE,
    reason:
      'Excluded from automatic progression and default client reports',
  },
  {
    fieldOrPattern: 'executive_opportunity_single_page_analysis.raw_score',
    dataClassification: 'Legacy AI output',
    rule: DenylistRule.QUARANTINE,
    reason:
      'Do not promote raw score into internal selection',
  },
  {
    fieldOrPattern: 'profile_analyses.photo_analysis_scores',
    dataClassification: 'Restricted AI signal',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Exclude photo analysis and scores from selection',
  },
  {
    fieldOrPattern: 'linkedin_*.profile_engagement_content_activity',
    dataClassification: 'Candidate-services reference',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Exclude engagement, content activity, coaching usage from selection',
  },
  {
    fieldOrPattern: 'learning_path_*.course_completion_quiz_activity',
    dataClassification: 'Candidate-services reference',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Exclude learning activity unless explicit job-related credential',
  },
  {
    fieldOrPattern: 'pitch_practice_*.rehearsal_data',
    dataClassification: 'Candidate-services reference',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Private rehearsal data stays in Directus',
  },
  {
    fieldOrPattern: 'social_login_events.*',
    dataClassification: 'Authentication telemetry',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Do not use login behavior in selection',
  },
  {
    fieldOrPattern: 'meilisearch_settings.*',
    dataClassification: 'Infrastructure secret',
    rule: DenylistRule.NO_SYNC,
    reason:
      'Contains search infrastructure/API-key configuration',
  },
];
