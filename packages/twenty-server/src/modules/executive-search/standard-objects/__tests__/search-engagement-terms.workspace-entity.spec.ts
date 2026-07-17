import { SearchEngagementTermsWorkspaceEntity } from '../search-engagement-terms.workspace-entity';
import { SearchEngagementTermsStatus } from '../../common/enums/search-engagement-terms-status.enum';

describe('SearchEngagementTermsWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new SearchEngagementTermsWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.name = 'Test Engagement Terms';
    entity.status = SearchEngagementTermsStatus.DRAFT;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.name).toBe('Test Engagement Terms');
    expect(entity.status).toBe(SearchEngagementTermsStatus.DRAFT);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new SearchEngagementTermsWorkspaceEntity();
    entity.clientCompanyId = 'company-1';
    entity.opportunityId = 'opp-1';
    entity.approvedById = 'user-1';

    expect(entity.clientCompanyId).toBe('company-1');
    expect(entity.opportunityId).toBe('opp-1');
    expect(entity.approvedById).toBe('user-1');
    expect(entity).toHaveProperty('clientCompany');
    expect(entity).toHaveProperty('opportunity');
    expect(entity).toHaveProperty('approvedBy');
    expect(entity).toHaveProperty('searchAssignments');
    expect(entity).toHaveProperty('taskTargets');
    expect(entity).toHaveProperty('noteTargets');
    expect(entity).toHaveProperty('attachments');
    expect(entity).toHaveProperty('timelineActivities');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new SearchEngagementTermsWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
    expect(entity).toHaveProperty('searchVector');
  });
});
