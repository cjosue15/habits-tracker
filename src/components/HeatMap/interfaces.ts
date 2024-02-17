export interface HeatMapDate {
  date: Date;
  value: number | null;
}

export interface HeatMapProps {
  startDate: Date;
  endDate: Date;
  dates: HeatMapDate[];
  classForValue: (value: HeatMapDate) => string;
}

export interface CellData extends HeatMapDate {
  cssClass: string;
}

export interface CellProps {
  dayIndex: number;
  weekIndex: number;
  data: CellData;
}
