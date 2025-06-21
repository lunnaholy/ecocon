import { api } from '@/api';
import { Job } from '@/api/jobs';
import { Task } from '@/api/tasks';
import { Page } from '@/components/Page.tsx';
import { Tabs } from '@/components/Tabs.tsx';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface JobWithTask extends Job {
  taskDetails?: Task;
}

export function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobWithTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingJob, setUploadingJob] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const jobsList = await api.jobs.list();
      
      // Fetch task details for each job
      const jobsWithTasks = await Promise.all(
        jobsList.map(async (job) => {
          try {
            const taskDetails = await api.tasks.get(job.task);
            return { ...job, taskDetails };
          } catch (error) {
            console.error(`Failed to fetch task details for job ${job.id}:`, error);
            return job;
          }
        })
      );
      
      setJobs(jobsWithTasks);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback(async (jobId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingJob(jobId);
    try {
      const result = await api.jobs.complete(jobId, file);
      if (result) {
        await loadJobs();
      }
    } catch (error) {
      console.error('Failed to upload proof:', error);
    } finally {
      setUploadingJob(null);
    }
  }, [loadJobs]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
        return 'text-green-500';
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
        return 'Completed, 100%';
      case 'pending':
        return 'Pending';
      case 'checking':
        return 'Checking';
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
          <h1 className='text-xl font-bold'>My Jobs</h1>
          <p className='text-sm text-gray-500'>Manage your active tasks and submit proof</p>
        </div>

        {jobs.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-8 text-center'>
            <div className='text-gray-400 mb-4'>
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-foreground-900 mb-2'>No jobs yet</h3>
            <p className='text-gray-500 mb-4'>Start by taking a task from the Tasks tab</p>
            <Button onClick={() => navigate('/')}>
              Browse Tasks
            </Button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {jobs.map((job) => (
              <div key={job.id} className='flex flex-col w-full rounded-xl shadow bg-background overflow-hidden'>
                {/* Task Thumbnail */}
                {job.taskDetails?.thumbnail && (
                  <img 
                    src={job.taskDetails.thumbnail} 
                    className='w-full h-48 object-cover' 
                    alt={job.taskDetails.title}
                  />
                )}
                
                <div className='p-4 gap-3 flex flex-col'>
                  {/* Task Title and Status */}
                  <div className='flex flex-row items-center justify-between'>
                    <span className='text-lg font-bold'>
                      {job.taskDetails?.title || 'Unknown Task'}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                  </div>
                  
                  {/* Task Points and User */}
                  <div className='flex flex-row items-center justify-between text-sm text-gray-500'>
                    <span>{job.taskDetails?.points || 0} XP</span>
                  </div>

                  {/* View Task Details Button */}
                  <Button 
                    className='w-full' 
                    mode="bezeled"
                    onClick={() => navigate(`/task/${job.task}`)}
                  >
                    View Task Details
                  </Button>

                  {/* File Upload Section */}
                  {job.status.toLowerCase() === 'pending' && (
                    <div className='flex flex-col gap-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Upload Proof File
                      </label>
                      <div className='flex flex-row gap-2'>
                        <input
                          type="file"
                          id={`file-${job.id}`}
                          className="hidden"
                          onChange={(e) => handleFileUpload(job.id, e)}
                          accept="image/*,.pdf,.doc,.docx"
                        />
                        <label
                          htmlFor={`file-${job.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <Button
                            onClick={() => document.getElementById(`file-${job.id}`)?.click()}
                            className='w-full'
                            disabled={uploadingJob === job.id}
                            mode="bezeled"
                          >
                            {uploadingJob === job.id ? (
                              <>
                                <Spinner size="s" className="mr-2" />
                                Uploading...
                              </>
                            ) : (
                              'Choose File'
                            )}
                          </Button>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Proof File Status */}
                  {job.proof_file && (
                    <div className='flex flex-row items-center gap-2 text-sm text-gray-500'>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Proof file uploaded</span>
                      <span>Waiting for approval (0/1)</span>
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
