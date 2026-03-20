export interface Freelancer {
  id: string;
  name: string;
  email: string;
  hourlyRate: number;
}

export interface TimeEntry {
  id: string;
  worklogId: string;
  description: string;
  date: string; // ISO date string
  hours: number;
  rate: number; // hourly rate at the time of logging
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
}

export interface Worklog {
  id: string;
  freelancerId: string;
  taskId: string;
  taskTitle: string;
  date: string; // ISO date string of the worklog submission
  totalHours: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  entries: TimeEntry[];
}

// Mock Data
export const mockFreelancers: Freelancer[] = [
  { id: 'f1', name: 'Alice Smith', email: 'alice@example.com', hourlyRate: 50 },
  { id: 'f2', name: 'Bob Jones', email: 'bob@example.com', hourlyRate: 40 },
  { id: 'f3', name: 'Charlie Day', email: 'charlie@example.com', hourlyRate: 65 },
];

export const mockWorklogs: Worklog[] = [
  {
    id: 'w1',
    freelancerId: 'f1',
    taskId: 't1',
    taskTitle: 'Homepage Redesign',
    date: '2023-10-15',
    totalHours: 5,
    totalAmount: 250,
    status: 'pending',
    entries: [
      { id: 'e1', worklogId: 'w1', description: 'Initial wireframes', date: '2023-10-14', hours: 2, rate: 50, total: 100, status: 'pending' },
      { id: 'e2', worklogId: 'w1', description: 'Cleanup layout', date: '2023-10-15', hours: 3, rate: 50, total: 150, status: 'pending' },
    ]
  },
  {
    id: 'w2',
    freelancerId: 'f1',
    taskId: 't2',
    taskTitle: 'Mobile App API',
    date: '2023-10-16',
    totalHours: 4,
    totalAmount: 200,
    status: 'approved',
    entries: [
      { id: 'e3', worklogId: 'w2', description: 'API Endpoint setup', date: '2023-10-16', hours: 4, rate: 50, total: 200, status: 'approved' },
    ]
  },
  {
    id: 'w3',
    freelancerId: 'f2',
    taskId: 't3',
    taskTitle: 'Database Optimization',
    date: '2023-10-18',
    totalHours: 8,
    totalAmount: 320,
    status: 'pending',
    entries: [
      { id: 'e4', worklogId: 'w3', description: 'Index creation', date: '2023-10-18', hours: 5, rate: 40, total: 200, status: 'pending' },
      { id: 'e5', worklogId: 'w3', description: 'Query tuning', date: '2023-10-18', hours: 3, rate: 40, total: 120, status: 'pending' },
    ]
  },
  {
    id: 'w4',
    freelancerId: 'f3',
    taskId: 't1',
    taskTitle: 'Homepage Redesign',
    date: '2023-10-20',
    totalHours: 3,
    totalAmount: 195,
    status: 'paid',
    entries: [
      { id: 'e6', worklogId: 'w4', description: 'Color scheme adjustment', date: '2023-10-20', hours: 3, rate: 65, total: 195, status: 'paid' },
    ]
  },
  {
    id: 'w5',
    freelancerId: 'f2',
    taskId: 't4',
    taskTitle: 'User Auth Flow',
    date: '2023-10-22',
    totalHours: 6,
    totalAmount: 240,
    status: 'pending',
    entries: [
      { id: 'e7', worklogId: 'w5', description: 'JWT implementation', date: '2023-10-22', hours: 6, rate: 40, total: 240, status: 'pending' },
    ]
  }
];
