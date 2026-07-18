import {
  STANDARD_OBJECTS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-shared/metadata';

import { PageLayoutType } from 'src/engine/metadata-modules/page-layout/enums/page-layout-type.enum';
import {
  TAB_PROPS,
  WIDGET_PROPS,
} from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-page-layout-tabs.template';
import {
  type StandardPageLayoutConfig,
  type StandardPageLayoutTabConfig,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-page-layout-config.type';

const ANALYTICS_METRIC_SNAPSHOT_PAGE_TABS = {
  home: {
    universalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
        .analyticsMetricSnapshotRecordPage.tabs.home.universalIdentifier,
    ...TAB_PROPS.home,
    widgets: {
      fields: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .analyticsMetricSnapshotRecordPage.tabs.home.widgets.fields
            .universalIdentifier,
        ...WIDGET_PROPS.fields,
      },
    },
  },
  timeline: {
    universalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
        .analyticsMetricSnapshotRecordPage.tabs.timeline.universalIdentifier,
    ...TAB_PROPS.timeline,
    widgets: {
      timeline: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .analyticsMetricSnapshotRecordPage.tabs.timeline.widgets.timeline
            .universalIdentifier,
        ...WIDGET_PROPS.timeline,
      },
    },
  },
} as const satisfies Record<string, StandardPageLayoutTabConfig>;

export const STANDARD_ANALYTICS_METRIC_SNAPSHOT_PAGE_LAYOUT_CONFIG = {
  name: 'Default Analytics Metric Snapshot Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier:
    STANDARD_OBJECTS.analyticsMetricSnapshot.universalIdentifier,
  universalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.analyticsMetricSnapshotRecordPage
      .universalIdentifier,
  defaultTabUniversalIdentifier: null,
  tabs: ANALYTICS_METRIC_SNAPSHOT_PAGE_TABS,
} as const satisfies StandardPageLayoutConfig;
