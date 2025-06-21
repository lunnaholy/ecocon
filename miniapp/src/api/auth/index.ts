import crud from "../crud";

export interface UserResponse {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  lastname: string;
  xp: number;
}

export default function(baseUrl: string) {
  baseUrl = `${baseUrl}/auth`;
  return {
    login: async (initData: string) => {
      return await crud.post(`${baseUrl}/auth/`, { auth_data: initData }, false) as { token: string };
    },
    me: async () => {
      return await crud.get(`${baseUrl}/me/`, undefined, true) as UserResponse;
    }
  }
}