import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { SearchAssignmentStatus } from 'src/modules/executive-search/common/enums/search-assignment-status.enum';

registerEnumType(SearchAssignmentStatus, {
  name: 'SearchAssignmentStatus',
  description: 'Search assignment status',
});

@ObjectType('ConvertOpportunityToAssignment')
export class ConvertOpportunityToAssignmentDTO {
  @Field(() => String)
  assignmentId: string;

  @Field(() => SearchAssignmentStatus)
  status: SearchAssignmentStatus;
}
