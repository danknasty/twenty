import { PositionSpecificationWorkspaceEntity } from '../position-specification.workspace-entity';
import { PositionSpecificationStatus } from '../../common/enums/position-specification-status.enum';

describe('PositionSpecificationWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new PositionSpecificationWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.name = 'Staff Software Engineer';
    entity.status = PositionSpecificationStatus.DRAFT;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.name).toBe('Staff Software Engineer');
    expect(entity.status).toBe(PositionSpecificationStatus.DRAFT);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new PositionSpecificationWorkspaceEntity();
    entity.approvedById = 'user-1';
    entity.assignmentId = 'assignment-1';

    expect(entity.approvedById).toBe('user-1');
    expect(entity.assignmentId).toBe('assignment-1');
    expect(entity).toHaveProperty('approvedBy');
    expect(entity).toHaveProperty('assignment');
    expect(entity).toHaveProperty('criteria');
    expect(entity).toHaveProperty('taskTargets');
    expect(entity).toHaveProperty('noteTargets');
    expect(entity).toHaveProperty('attachments');
    expect(entity).toHaveProperty('timelineActivities');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new PositionSpecificationWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
    expect(entity).toHaveProperty('searchVector');
  });
});
