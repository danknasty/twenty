import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type SearchInterviewType } from 'src/modules/executive-search/common/enums/search-interview-type.enum';
import { type SearchInterviewStatus } from 'src/modules/executive-search/common/enums/search-interview-status.enum';
import { type SearchInterviewOutcome } from 'src/modules/executive-search/common/enums/search-interview-outcome.enum';

export class SearchInterviewWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  interviewType: SearchInterviewType;
  status: SearchInterviewStatus;
  scheduledDate: string | null;
  scheduledEndDate: string | null;
  duration: number | null;
  location: string | null;
  notes: string | null;
  outcome: SearchInterviewOutcome | null;
  internalNotes: string | null;
  interviewers: string | null;
  searchAssignmentId: string | null;
  searchCandidacyId: string | null;
}
