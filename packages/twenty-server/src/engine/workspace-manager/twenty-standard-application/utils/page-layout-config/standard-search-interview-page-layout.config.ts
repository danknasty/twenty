export const STANDARD_SEARCH_INTERVIEW_PAGE_LAYOUT_CONFIG = {
  id: 'searchInterviewRecordPage',
  objectName: 'searchInterview' as const,
  layout: { id: 'searchInterviewRecordPage', tabs: [{ id: 'default', layout: [{ id: 'general', groups: [{ id: 'general', fieldDefinitions: ['name','interviewType','status','scheduledDate','scheduledEndDate','duration','location','notes','outcome','internalNotes','interviewers','searchAssignment','searchCandidacy','clientFeedbacks'] },{ id: 'system', fieldDefinitions: ['createdAt','createdBy'] }] }] }] },
};
