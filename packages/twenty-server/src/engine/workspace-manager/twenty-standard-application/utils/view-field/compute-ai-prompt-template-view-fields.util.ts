import { type FlatViewField } from 'src/engine/metadata-modules/flat-view-field/types/flat-view-field.type';
import {
  createStandardViewFieldFlatMetadata,
  type CreateStandardViewFieldArgs,
} from 'src/engine/workspace-manager/twenty-standard-application/utils/view-field/create-standard-view-field-flat-metadata.util';

export const computeAiPromptTemplateViewFields = (
  args: Omit<CreateStandardViewFieldArgs<'aiPromptTemplate'>, 'context'>,
): Record<string, FlatViewField> => {
  return {
    allAiPromptTemplatesName: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'name',
        fieldName: 'name',
        position: 0,
        isVisible: true,
        size: 180,
      },
    }),
    allAiPromptTemplatesCategory:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'aiPromptTemplate',
        context: {
          viewName: 'allAiPromptTemplates',
          viewFieldName: 'category',
          fieldName: 'category',
          position: 1,
          isVisible: true,
          size: 150,
        },
      }),
    allAiPromptTemplatesResponseFormat:
      createStandardViewFieldFlatMetadata({
        ...args,
        objectName: 'aiPromptTemplate',
        context: {
          viewName: 'allAiPromptTemplates',
          viewFieldName: 'responseFormat',
          fieldName: 'responseFormat',
          position: 2,
          isVisible: true,
          size: 150,
        },
      }),
    allAiPromptTemplatesModelId: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'modelId',
        fieldName: 'modelId',
        position: 3,
        isVisible: true,
        size: 150,
      },
    }),
    allAiPromptTemplatesVersion: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'version',
        fieldName: 'version',
        position: 4,
        isVisible: true,
        size: 120,
      },
    }),
    allAiPromptTemplatesIsActive: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'isActive',
        fieldName: 'isActive',
        position: 5,
        isVisible: true,
        size: 120,
      },
    }),
    allAiPromptTemplatesIsApproved: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'isApproved',
        fieldName: 'isApproved',
        position: 6,
        isVisible: true,
        size: 120,
      },
    }),
    allAiPromptTemplatesCreatedAt: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'createdAt',
        fieldName: 'createdAt',
        position: 7,
        isVisible: true,
        size: 150,
      },
    }),
    allAiPromptTemplatesCreatedBy: createStandardViewFieldFlatMetadata({
      ...args,
      objectName: 'aiPromptTemplate',
      context: {
        viewName: 'allAiPromptTemplates',
        viewFieldName: 'createdBy',
        fieldName: 'createdBy',
        position: 8,
        isVisible: true,
        size: 150,
      },
    }),
  };
};
