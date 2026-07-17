import { SearchMilestoneWorkspaceEntity } from '../search-milestone.workspace-entity';
import { SearchMilestoneStatus } from '../../common/enums/search-milestone-status.enum';

describe('SearchMilestoneWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new SearchMilestoneWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.name = 'Initial Screening';
    entity.status = SearchMilestoneStatus.PENDING;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.name).toBe('Initial Screening');
    expect(entity.status).toBe(SearchMilestoneStatus.PENDING);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new SearchMilestoneWorkspaceEntity();
    entity.assignmentId = 'assignment-1';

    expect(entity.assignmentId).toBe('assignment-1');
    expect(entity).toHaveProperty('assignment');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new SearchMilestoneWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
  });
});
