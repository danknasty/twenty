export const STANDARD_DILIGENCE_CHECK_PAGE_LAYOUT_CONFIG = {
  id: 'diligenceCheckRecordPage',
  objectName: 'diligenceCheck' as const,
  layout: { id: 'diligenceCheckRecordPage', tabs: [{ id: 'default', layout: [{ id: 'general', groups: [{ id: 'general', fieldDefinitions: ['name','diligenceType','status','findings','recommendation','conductedAt','searchCandidacy'] },{ id: 'system', fieldDefinitions: ['createdAt','createdBy'] }] }] }] },
};
