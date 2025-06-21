import crud from "../crud";

export interface Task {
  id: string;
  title: string;
  points: number;
  created: string;
  thumbnail: string;
  description: string;
}

export default function(baseUrl: string) {
  baseUrl = `${baseUrl}/tasks`;
  return {
    list: async () => {
      return await crud.get(`${baseUrl}/`, undefined, true) as Task[];
    },
    get: async (id: string) => {
      return await crud.get(`${baseUrl}/${id}/`, undefined, true) as Task;
    },
    take: async (taskId: string) => {
      return await crud.post(`${baseUrl}/${taskId}`, {}, true) as { success: boolean };
    }
  }
}