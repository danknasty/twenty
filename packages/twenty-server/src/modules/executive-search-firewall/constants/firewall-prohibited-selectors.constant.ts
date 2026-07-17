import { FirewallContext } from './firewall-contexts.constant';

export type ProhibitedSelector = {
  selector: string;
  rule: string;
};

export const FIREWALL_PROHIBITED_SELECTORS: Record<
  FirewallContext,
  ProhibitedSelector[]
> = {
  [FirewallContext.SEARCH_FILTER]: [
    {
      selector: 'subscription_tier',
      rule: 'executives.subscription_tier must not appear in any recruiter search scoring or filter',
    },
    {
      selector: 'plan_level',
      rule: 'executives.plan_level excluded from search',
    },
    {
      selector: 'is_premium',
      rule: 'executives.is_premium excluded from search',
    },
    {
      selector: 'stripe_customer_id',
      rule: 'payment data excluded from all search delivery',
    },
    {
      selector: 'purchase_payment_history',
      rule: 'payment history excluded from search',
    },
    {
      selector: 'marketing_opt_in',
      rule: 'marketing engagement excluded from search',
    },
    {
      selector: 'learning_activity',
      rule: 'learning activity excluded unless explicit job-related credential',
    },
    {
      selector: 'course_completion',
      rule: 'course completion excluded unless candidate-authorized and job-related',
    },
    {
      selector: 'quiz_activity',
      rule: 'quiz activity excluded from search',
    },
    {
      selector: 'content_consumption',
      rule: 'content consumption excluded from search',
    },
    {
      selector: 'profile_views',
      rule: 'profile view counts excluded from search',
    },
    {
      selector: 'marketing_engagement',
      rule: 'marketing engagement excluded from search',
    },
    {
      selector: 'candidate_service_usage_frequency',
      rule: 'candidate-service usage excluded from search',
    },
    {
      selector: 'birthdate',
      rule: 'birthdate excluded from search/rank',
    },
    {
      selector: 'gender',
      rule: 'gender excluded from search/rank',
    },
    {
      selector: 'voluntary_demographics',
      rule: 'individual voluntary demographics excluded from search',
    },
  ],
  [FirewallContext.AI_CONTEXT]: [
    {
      selector: 'subscription_tier',
      rule: 'subscription data must not enter AI candidate assessment context',
    },
    {
      selector: 'plan_level',
      rule: 'plan level excluded from AI',
    },
    {
      selector: 'stripe_customer_id',
      rule: 'payment data excluded from AI',
    },
    {
      selector: 'birthdate',
      rule: 'birthdate excluded from AI context',
    },
    {
      selector: 'gender',
      rule: 'gender excluded from AI context',
    },
    {
      selector: 'voluntary_demographics',
      rule: 'individual voluntary demographics excluded from AI',
    },
  ],
  [FirewallContext.CLIENT_REPORT]: [
    {
      selector: 'subscription_tier',
      rule: 'subscription data must not appear in client-facing reports',
    },
    {
      selector: 'is_premium',
      rule: 'premium status excluded from client reports',
    },
  ],
  [FirewallContext.SLATE_PRESENTATION]: [
    {
      selector: 'subscription_tier',
      rule: 'subscription data must not appear in candidate presentations or slates',
    },
  ],
  [FirewallContext.PIPELINE_AUTOMATION]: [
    {
      selector: 'subscription_tier',
      rule: 'subscription data must not drive stage transitions or workflow automation',
    },
  ],
  [FirewallContext.SELECTION_CONTEXT]: [
    {
      selector: 'executive_psychographic',
      rule: 'psychographic data not allowed in automated selection by default',
    },
    {
      selector: 'photo_analysis_scores',
      rule: 'photo analysis/scores excluded from selection',
    },
    {
      selector: 'accommodation_medical_info',
      rule: 'medical/accommodation data excluded from evaluators',
    },
    {
      selector: 'unreviewed_culture_fit_score',
      rule: 'unreviewed AI culture-fit/success-probability excluded from progression',
    },
  ],
};
