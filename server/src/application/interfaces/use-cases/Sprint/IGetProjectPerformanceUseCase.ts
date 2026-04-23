export interface VelocityBar {
  sprint: string;
  planned: number;
  completed: number;
}

export interface MetricData {
  label: string;
  value: string;
  trend: string;
  up: boolean;
}

export interface IGetProjectPerformanceUseCaseResponse {
  velocityBars: VelocityBar[];
  metrics: MetricData[];
}

export interface IGetProjectPerformanceUseCase {
  execute(userId: string, projectId: string): Promise<IGetProjectPerformanceUseCaseResponse>;
}
