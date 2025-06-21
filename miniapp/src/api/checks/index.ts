import crud from "../crud";

export interface Check {
  id: string;
  task: string;
  user: string;
  status: string;
  proof_file: string;
}

export default function(baseUrl: string) {
  baseUrl = `${baseUrl}/checks`;
  return {
    list: async () => {
      return await crud.get(`${baseUrl}/`, undefined, true) as Check;
    },
    rate: async (id: string, status: string, percentage: number, description: string) => {
      return await crud.post(`${baseUrl}/${id}/`, { status, percentage, description }, true) as { success: boolean };
    }
  }
}