import { AssignmentTeamMemberWorkspaceEntity } from '../assignment-team-member.workspace-entity';
import { AssignmentTeamMemberRole } from '../../common/enums/assignment-team-member-role.enum';

describe('AssignmentTeamMemberWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new AssignmentTeamMemberWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.role = AssignmentTeamMemberRole.PARTNER;
    entity.isLead = true;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.role).toBe(AssignmentTeamMemberRole.PARTNER);
    expect(entity.isLead).toBe(true);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new AssignmentTeamMemberWorkspaceEntity();
    entity.assignmentId = 'assignment-1';
    entity.workspaceMemberId = 'wm-1';

    expect(entity.assignmentId).toBe('assignment-1');
    expect(entity.workspaceMemberId).toBe('wm-1');
    expect(entity).toHaveProperty('assignment');
    expect(entity).toHaveProperty('workspaceMember');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new AssignmentTeamMemberWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
  });
});
