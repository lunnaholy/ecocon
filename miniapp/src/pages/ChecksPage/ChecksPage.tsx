import { api } from '@/api';
import { Check } from '@/api/checks';
import { Task } from '@/api/tasks';
import { Page } from '@/components/Page.tsx';
import { Tabs } from '@/components/Tabs.tsx';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CheckWithTask extends Check {
  taskDetails?: Task;
}

export function ChecksPage() {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<CheckWithTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingCheck, setRatingCheck] = useState<string | null>(null);
  const [ratingForm, setRatingForm] = useState({
    status: 'done',
    percentage: 100,
    description: ''
  });

  useEffect(() => {
    loadChecks();
  }, []);

  const loadChecks = useCallback(async () => {
    try {
      const checksList = [(await api.checks.list())];
      console.log(checksList);
      
      const checksWithTasks = await Promise.all(
        checksList.map(async (check) => {
          try {
            const taskDetails = await api.tasks.get(check.task);
            return { ...check, taskDetails };
          } catch (error) {
            // console.error(`Failed to fetch task details for check ${check.id}:`, error);
            return check;
          }
        })
      );
      
      setChecks(checksWithTasks);
    } catch (error) {
      // console.error('Failed to load checks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRating = useCallback(async (checkId: string) => {
    setRatingCheck(checkId);
    try {
      const result = await api.checks.rate(
        checkId, 
        ratingForm.status, 
        ratingForm.percentage, 
        ratingForm.description
      );
      if (result) {
        // Reload checks to update the status
        navigate("/");
        setRatingForm({ status: 'done', percentage: 100, description: '' });
      }
    } catch (error) {
      console.error('Failed to rate check:', error);
    } finally {
      setRatingCheck(null);
    }
  }, [ratingForm, loadChecks]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      case 'checking':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'done';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      case 'checking':
        return 'Under Review';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Page back={false}>
        <div className='flex flex-col items-center justify-center h-screen'>
          <Spinner size="l" />
        </div>
        <Tabs />
      </Page>
    );
  }

  return (
    <Page back={false}>
      <div className="flex flex-col gap-4 p-4">
        <div className='flex flex-col w-full p-4 rounded-xl shadow bg-background gap-2'>
          <h1 className='text-xl font-bold'>Review Checks</h1>
          <p className='text-sm text-gray-500'>Review and rate submitted proof files</p>
        </div>

        {checks.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-8 text-center'>
            <div className='text-gray-400 mb-4'>
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-foreground-900 mb-2'>No checks to review</h3>
            <p className='text-gray-500 mb-4'>All submitted proofs have been reviewed</p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {checks.map((check) => (
              <div key={check.id} className='flex flex-col w-full rounded-xl shadow bg-background overflow-hidden'>
                {/* Task Thumbnail */}
                {check.taskDetails?.thumbnail && (
                  <img 
                    src={check.taskDetails.thumbnail} 
                    className='w-full h-48 object-cover' 
                    alt={check.taskDetails.title}
                  />
                )}
                
                <div className='p-4 gap-3 flex flex-col'>
                  {/* Task Title and Status */}
                  <div className='flex flex-row items-center justify-between'>
                    <span className='text-lg font-bold'>
                      {check.taskDetails?.title || 'Unknown Task'}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                      {getStatusText(check.status)}
                    </span>
                  </div>
                  
                  {/* Task Points and User */}
                  <div className='flex flex-row items-center justify-between text-sm text-gray-500'>
                    <span>{check.taskDetails?.points || 0} XP</span>
                    <span>User: {check.user}</span>
                  </div>

                  {/* View Task Details Button */}
                  <Button 
                    className='w-full' 
                    mode="bezeled"
                    onClick={() => navigate(`/task/${check.task}`)}
                  >
                    View Task Details
                  </Button>

                  {/* Proof File Status */}
                  {check.proof_file && (
                    <div className='flex flex-row items-center gap-2 text-sm text-gray-500'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Proof file submitted</span>
                    </div>
                  )}

                  {/* Rating Form */}
                  {check.status.toLowerCase() === 'checking' && (
                    <div className='flex flex-col gap-3 p-4 bg-background-500 rounded-lg'>
                      <h4 className='font-medium text-foreground-900'>Rate Submission</h4>
                      
                      {/* Status Selection */}
                      <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-foreground-700'>Status</label>
                        <select
                          value={ratingForm.status}
                          onChange={(e) => setRatingForm(prev => ({ ...prev, status: e.target.value }))}
                          className='p-2 border border-gray-300 rounded-md text-sm'
                        >
                          <option value="done">Done</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Percentage */}
                      <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-foreground-700'>Percentage</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ratingForm.percentage}
                          onChange={(e) => setRatingForm(prev => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                          className='p-2 border border-gray-300 rounded-md text-sm'
                        />
                      </div>

                      {/* Description */}
                      <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-foreground-700'>Description</label>
                        <textarea
                          value={ratingForm.description}
                          onChange={(e) => setRatingForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Add feedback or comments..."
                          className='p-2 border border-gray-300 rounded-md text-sm h-20 resize-none'
                        />
                      </div>

                      {/* Submit Rating Button */}
                      <Button
                        className='w-full'
                        disabled={ratingCheck === check.id}
                        onClick={() => handleRating(check.id)}
                      >
                        {ratingCheck === check.id ? (
                          <>
                            <Spinner size="s" className="mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Rating'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Tabs />
    </Page>
  );
} 