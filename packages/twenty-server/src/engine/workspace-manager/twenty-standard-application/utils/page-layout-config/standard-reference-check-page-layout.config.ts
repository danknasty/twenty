export const STANDARD_REFERENCE_CHECK_PAGE_LAYOUT_CONFIG = {
  id: 'referenceCheckRecordPage',
  objectName: 'referenceCheck' as const,
  layout: { id: 'referenceCheckRecordPage', tabs: [{ id: 'default', layout: [{ id: 'general', groups: [{ id: 'general', fieldDefinitions: ['name','status','referenceName','referenceTitle','referenceOrganization','referenceContact','relationshipType','findings','verifiedAt','searchCandidacy'] },{ id: 'system', fieldDefinitions: ['createdAt','createdBy'] }] }] }] },
};
