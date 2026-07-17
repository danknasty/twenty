import { SearchCriterionWorkspaceEntity } from '../search-criterion.workspace-entity';
import { SearchCriterionCategory } from '../../common/enums/search-criterion-category.enum';

describe('SearchCriterionWorkspaceEntity', () => {
  it('should be constructible with required fields', () => {
    const entity = new SearchCriterionWorkspaceEntity();
    entity.id = 'test-id';
    entity.createdAt = '2026-01-01T00:00:00Z';
    entity.updatedAt = '2026-01-01T00:00:00Z';
    entity.deletedAt = null;
    entity.name = '10+ years experience';
    entity.category = SearchCriterionCategory.EXPERIENCE;
    entity.isRequired = true;

    expect(entity).toBeDefined();
    expect(entity.id).toBe('test-id');
    expect(entity.name).toBe('10+ years experience');
    expect(entity.category).toBe(SearchCriterionCategory.EXPERIENCE);
    expect(entity.isRequired).toBe(true);
  });

  it('should have relation fields with matching Id counterparts', () => {
    const entity = new SearchCriterionWorkspaceEntity();
    entity.specificationId = 'spec-1';

    expect(entity.specificationId).toBe('spec-1');
    expect(entity).toHaveProperty('specification');
  });

  it('should have all required system fields from BaseWorkspaceEntity', () => {
    const entity = new SearchCriterionWorkspaceEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
    expect(entity).toHaveProperty('deletedAt');
    expect(entity).toHaveProperty('createdBy');
    expect(entity).toHaveProperty('updatedBy');
  });
});
