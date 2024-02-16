export interface Habit {
  id: string;
  title: string;
  description?: string;
  records: Record[];
  createdAt: string;
  daysOff: string;
}

export interface Record {
  id: string;
  createdAt: string;
  forHabit: string;
  forUser: string;
}
