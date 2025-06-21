import crud from "../crud";

export interface Job {
  id: string;
  task: string;
  user: string;
  status: string;
  proof_file: string;
}

export default function(baseUrl: string) {
  baseUrl = `${baseUrl}/jobs`;
  return {
    list: async () => {
      return await crud.get(`${baseUrl}/`, undefined, true) as Job[];
    },
    get: async (id: string) => {
      return await crud.get(`${baseUrl}/${id}/`, undefined, true) as Job;
    },
    complete: async (id: string, proof_file: File) => {
      const formData = new FormData();
      formData.append('file', proof_file);
      return await crud.post(`${baseUrl}/${id}/`, formData, true, "auto") as { success: boolean };
    }
  }
}