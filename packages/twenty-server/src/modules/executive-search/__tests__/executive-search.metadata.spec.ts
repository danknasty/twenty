import { STANDARD_OBJECTS } from 'twenty-shared/metadata';

const EXECUTIVE_SEARCH_OBJECTS = [
  'searchEngagementTerms',
  'searchAssignment',
  'assignmentTeamMember',
  'searchMilestone',
  'positionSpecification',
  'searchCriterion',
] as const;

describe('STANDARD_OBJECTS — executive search metadata registration', () => {
  describe.each(EXECUTIVE_SEARCH_OBJECTS)('%s', (objectKey) => {
    it('is registered in STANDARD_OBJECTS', () => {
      expect(STANDARD_OBJECTS).toHaveProperty(objectKey);
    });

    it('has a universalIdentifier', () => {
      const obj = STANDARD_OBJECTS[objectKey];
      expect(obj).toHaveProperty('universalIdentifier');
      expect(typeof obj.universalIdentifier).toBe('string');
      expect(obj.universalIdentifier).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('has fields', () => {
      const obj = STANDARD_OBJECTS[objectKey];
      expect(obj).toHaveProperty('fields');
      expect(obj.fields).toBeDefined();
      expect(typeof obj.fields).toBe('object');
      expect(Object.keys(obj.fields).length).toBeGreaterThan(0);
    });

    it('has indexes', () => {
      const obj = STANDARD_OBJECTS[objectKey];
      expect(obj).toHaveProperty('indexes');
      expect(obj.indexes).toBeDefined();
    });

    it('has views', () => {
      const obj = STANDARD_OBJECTS[objectKey];
      expect(obj).toHaveProperty('views');
      expect(obj.views).toBeDefined();
      expect(typeof obj.views).toBe('object');
      expect(Object.keys(obj.views).length).toBeGreaterThan(0);
    });
  });

  describe('inverse ONE_TO_MANY fields on existing objects', () => {
    it('company has searchEngagementTerms inverse field', () => {
      expect(
        STANDARD_OBJECTS.company.fields,
      ).toHaveProperty('searchEngagementTerms');
    });

    it('company has searchAssignments inverse field', () => {
      expect(
        STANDARD_OBJECTS.company.fields,
      ).toHaveProperty('searchAssignments');
    });

    it('opportunity has searchEngagementTerms inverse field', () => {
      expect(
        STANDARD_OBJECTS.opportunity.fields,
      ).toHaveProperty('searchEngagementTerms');
    });

    it('opportunity has searchAssignments inverse field', () => {
      expect(
        STANDARD_OBJECTS.opportunity.fields,
      ).toHaveProperty('searchAssignments');
    });

    it('workspaceMember has assignmentTeamMemberships inverse field', () => {
      expect(
        STANDARD_OBJECTS.workspaceMember.fields,
      ).toHaveProperty('assignmentTeamMemberships');
    });
  });
});
