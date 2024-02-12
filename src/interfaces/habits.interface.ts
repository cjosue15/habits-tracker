export interface Habit {
  id: string;
  title: string;
  description?: string;
  records: Record[];
}

export interface Record {
  id: string;
  createdAt: string;
  forHabit: string;
  forUser: string;
}
