import { TrackEventParams } from "../../services/WorkspaceEventTrackingService";

export interface IWorkspaceEventTrackingService {
  trackEvent(params: TrackEventParams): Promise<void>;
}
