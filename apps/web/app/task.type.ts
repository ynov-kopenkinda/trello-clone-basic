export interface Task {
  id: number;
  title: string;
  description: string | null;
  state: string;
  priority: number;
}
