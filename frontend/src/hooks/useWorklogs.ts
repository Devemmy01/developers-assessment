import { useState, useCallback } from 'react';
import { mockWorklogs, mockFreelancers, type Worklog } from '../mocks/data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface WorklogWithDetails extends Worklog {
  freelancerName: string;
  project: string; // alias for taskTitle
  hours: number;   // alias for totalHours
  amount: number;  // alias for totalAmount
  description: string; // derived
}

export function useWorklogs() {
  const [data, setData] = useState<WorklogWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorklogs = useCallback(async () => {
    setIsLoading(true);
    try {
      await delay(800); 
      const enriched = mockWorklogs.map(w => {
        const freelancer = mockFreelancers.find(f => f.id === w.freelancerId);
        return {
          ...w,
          freelancerName: freelancer ? freelancer.name : 'Unknown',
          project: w.taskTitle,
          hours: w.totalHours,
          amount: w.totalAmount,
          description: w.entries[0]?.description || w.taskTitle // fallback
        };
      });
      setData(enriched);
    } catch (err) {
      setError('Failed to fetch worklogs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWorklogStatus = useCallback(async (ids: string[], status: Worklog['status']) => {
    setIsLoading(true);
    try {
      await delay(500);
      ids.forEach(id => {
        const index = mockWorklogs.findIndex(w => w.id === id);
        if (index !== -1) {
          mockWorklogs[index] = { ...mockWorklogs[index], status };
          if (status === 'paid' || status === 'approved') {
             mockWorklogs[index].entries = mockWorklogs[index].entries.map(e => ({...e, status: status as any}));
          }
        }
      });
      // Re-fetch to update local state
      const enriched = mockWorklogs.map(w => {
        const freelancer = mockFreelancers.find(f => f.id === w.freelancerId);
        return {
           ...w,
           freelancerName: freelancer ? freelancer.name : 'Unknown',
           project: w.taskTitle,
           hours: w.totalHours,
           amount: w.totalAmount,
           description: w.entries[0]?.description || w.taskTitle
        };
      });
      setData(enriched);
      return true;
    } catch (err) {
      setError('Failed to update status');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetchWorklogs, updateWorklogStatus };
}
