import { ViewType, ViewKey } from 'twenty-shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view/create-standard-view-flat-metadata.util';

const buildStandardResearchOfflimitsViews = <P extends string>(
  viewName: string,
  args: Omit<CreateStandardViewArgs<P>, 'context'>,
): Record<string, FlatView> => ({
  [viewName]: createStandardViewFlatMetadata({
    ...args,
    objectName: args.objectName,
    context: {
      viewName,
      name: 'All {objectLabelPlural}',
      type: ViewType.TABLE,
      key: ViewKey.INDEX,
      position: 0,
      icon: 'IconList',
    },
  }),
});

export const computeStandardOffLimitsRestrictionViews = (
  args: Omit<
    CreateStandardViewArgs<'offLimitsRestriction'>,
    'context'
  >,
) => buildStandardResearchOfflimitsViews('allOffLimitsRestrictions', args);

export const computeStandardConflictCheckViews = (
  args: Omit<CreateStandardViewArgs<'conflictCheck'>, 'context'>,
) => buildStandardResearchOfflimitsViews('allConflictChecks', args);

export const computeStandardConfidentialityRecordViews = (
  args: Omit<
    CreateStandardViewArgs<'confidentialityRecord'>,
    'context'
  >,
) => buildStandardResearchOfflimitsViews('allConfidentialityRecords', args);

export const computeStandardMarketMapViews = (
  args: Omit<CreateStandardViewArgs<'marketMap'>, 'context'>,
) => buildStandardResearchOfflimitsViews('allMarketMaps', args);

export const computeStandardRelationshipEdgeViews = (
  args: Omit<CreateStandardViewArgs<'relationshipEdge'>, 'context'>,
) => buildStandardResearchOfflimitsViews('allRelationshipEdges', args);

export const computeStandardResearchCandidateViews = (
  args: Omit<CreateStandardViewArgs<'researchCandidate'>, 'context'>,
) => buildStandardResearchOfflimitsViews('allResearchCandidates', args);

export const computeStandardResearchStrategyViews = (
  args: Omit<
    CreateStandardViewArgs<'researchStrategy'>,
    'context'
  >,
) => buildStandardResearchOfflimitsViews('allResearchStrategies', args);

export const computeStandardTargetCompanyViews = (
  args: Omit<CreateStandardViewArgs<'targetCompany'>, 'context'>,
) => buildStandardResearchOfflimitsViews('allTargetCompanies', args);
