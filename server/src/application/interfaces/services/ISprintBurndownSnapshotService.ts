export interface ISprintBurndownSnapshotService {
  captureSnapshot(sprintId: string): Promise<void>;
}
