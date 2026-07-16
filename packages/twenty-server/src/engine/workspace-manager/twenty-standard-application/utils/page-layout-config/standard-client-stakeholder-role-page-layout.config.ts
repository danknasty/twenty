import {
  STANDARD_OBJECTS,
  STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-shared/metadata';

import { WidgetType } from 'src/engine/metadata-modules/page-layout-widget/enums/widget-type.enum';
import { PageLayoutType } from 'src/engine/metadata-modules/page-layout/enums/page-layout-type.enum';
import {
  GRID_POSITIONS,
  TAB_PROPS,
  VERTICAL_LIST_LAYOUT_POSITIONS,
  WIDGET_PROPS,
} from 'src/engine/workspace-manager/twenty-standard-application/constants/standard-page-layout-tabs.template';
import {
  type StandardPageLayoutConfig,
  type StandardPageLayoutTabConfig,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/page-layout-config/standard-page-layout-config.type';

const CLIENT_STAKEHOLDER_ROLE_PAGE_TABS = {
  home: {
    universalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
        .clientStakeholderRoleRecordPage.tabs.home.universalIdentifier,
    ...TAB_PROPS.home,
    widgets: {
      fields: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .clientStakeholderRoleRecordPage.tabs.home.widgets.fields
            .universalIdentifier,
        ...WIDGET_PROPS.fields,
      },
      person: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .clientStakeholderRoleRecordPage.tabs.home.widgets.person
            .universalIdentifier,
        title: 'Person',
        type: WidgetType.FIELD,
        gridPosition: GRID_POSITIONS.FULL_WIDTH,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.SECOND,
        fieldUniversalIdentifier:
          STANDARD_OBJECTS.clientStakeholderRole.fields.person
            .universalIdentifier,
      },
      company: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .clientStakeholderRoleRecordPage.tabs.home.widgets.company
            .universalIdentifier,
        title: 'Company',
        type: WidgetType.FIELD,
        gridPosition: GRID_POSITIONS.FULL_WIDTH,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.THIRD,
        fieldUniversalIdentifier:
          STANDARD_OBJECTS.clientStakeholderRole.fields.company
            .universalIdentifier,
      },
      clientAccountProfile: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .clientStakeholderRoleRecordPage.tabs.home.widgets
            .clientAccountProfile.universalIdentifier,
        title: 'Client Account Profile',
        type: WidgetType.FIELD,
        gridPosition: GRID_POSITIONS.FULL_WIDTH,
        position: VERTICAL_LIST_LAYOUT_POSITIONS.FOURTH,
        fieldUniversalIdentifier:
          STANDARD_OBJECTS.clientStakeholderRole.fields.clientAccountProfile
            .universalIdentifier,
      },
    },
  },
  timeline: {
    universalIdentifier:
      STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
        .clientStakeholderRoleRecordPage.tabs.timeline.universalIdentifier,
    ...TAB_PROPS.timeline,
    widgets: {
      timeline: {
        universalIdentifier:
          STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS
            .clientStakeholderRoleRecordPage.tabs.timeline.widgets.timeline
            .universalIdentifier,
        ...WIDGET_PROPS.timeline,
      },
    },
  },
} as const satisfies Record<string, StandardPageLayoutTabConfig>;

export const STANDARD_CLIENT_STAKEHOLDER_ROLE_PAGE_LAYOUT_CONFIG = {
  name: 'Default Client Stakeholder Role Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectUniversalIdentifier:
    STANDARD_OBJECTS.clientStakeholderRole.universalIdentifier,
  universalIdentifier:
    STANDARD_PAGE_LAYOUT_UNIVERSAL_IDENTIFIERS.clientStakeholderRoleRecordPage
      .universalIdentifier,
  defaultTabUniversalIdentifier: null,
  tabs: CLIENT_STAKEHOLDER_ROLE_PAGE_TABS,
} as const satisfies StandardPageLayoutConfig;
