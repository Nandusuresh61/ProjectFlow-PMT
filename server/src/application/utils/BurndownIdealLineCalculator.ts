export interface BurndownDataPoint {
  date: Date;
  remainingHours: number;
}

export class BurndownIdealLineCalculator {
  static calculate(
    startDate: Date,
    endDate: Date,
    totalEstimatedHours: number
  ): BurndownDataPoint[] {
    const idealLine: BurndownDataPoint[] = [];
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const reductionPerDay = totalEstimatedHours / totalDays;

    for (let i = 0; i <= totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const remainingHours = Math.max(0, totalEstimatedHours - (reductionPerDay * i));
      
      idealLine.push({
        date: currentDate,
        remainingHours: Math.round(remainingHours * 100) / 100
      });
    }

    return idealLine;
  }
}
