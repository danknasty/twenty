import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeAnalyticsDashboardViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'analyticsDashboard'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allAnalyticsDashboardsName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 180,
      },
    }),
    allAnalyticsDashboardsIsDefault: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        viewFieldName: 'isDefault',
        fieldName: 'isDefault',
        position: 1,
        isVisible: true,
        size: 120,
      },
    }),
    allAnalyticsDashboardsPosition: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        viewFieldName: 'position',
        fieldName: 'position',
        position: 2,
        isVisible: true,
        size: 120,
      },
    }),
    allAnalyticsDashboardsCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allAnalyticsDashboardsCreatedBy: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'analyticsDashboard',
      context: {
        viewName: 'allAnalyticsDashboards',
        viewFieldName: 'createdBy',
        fieldName: 'createdBy',
        position: 4,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
