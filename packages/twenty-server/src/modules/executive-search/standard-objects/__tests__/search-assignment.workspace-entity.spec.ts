import { SearchAssignmentWorkspaceEntity } from '../search-assignment.workspace-entity';
import { SearchAssignmentStatus } from '../../common/enums/search-assignment-status.enum';

describe('SearchAssignmentWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new SearchAssignmentWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.name = 'Test Assignment';
    entity.status = SearchAssignmentStatus.BD_HANDOFF;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.name).toBe('Test Assignment');
    expect(entity.status).toBe(SearchAssignmentStatus.BD_HANDOFF);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new SearchAssignmentWorkspaceEntity();
    entity.clientCompanyId = 'company-1';
    entity.opportunityId = 'opp-1';
    entity.engagementTermsId = 'terms-1';
    entity.positionSpecificationId = 'spec-1';

    expect(entity.clientCompanyId).toBe('company-1');
    expect(entity.opportunityId).toBe('opp-1');
    expect(entity.engagementTermsId).toBe('terms-1');
    expect(entity.positionSpecificationId).toBe('spec-1');
    expect(entity).toHaveProperty('clientCompany');
    expect(entity).toHaveProperty('opportunity');
    expect(entity).toHaveProperty('engagementTerms');
    expect(entity).toHaveProperty('positionSpecification');
    expect(entity).toHaveProperty('teamMembers');
    expect(entity).toHaveProperty('milestones');
    expect(entity).toHaveProperty('taskTargets');
    expect(entity).toHaveProperty('noteTargets');
    expect(entity).toHaveProperty('attachments');
    expect(entity).toHaveProperty('timelineActivities');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new SearchAssignmentWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
    expect(entity).toHaveProperty('searchVector');
  });
});
