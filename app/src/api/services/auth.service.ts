import api from '@/api/clients/axios'
import Cookies from "js-cookie";

import type { AuthPayload } from '@/api/types/api.types'

export const login = async (payload: AuthPayload) => {
  try {
    console.log(payload);
    
    const response = await api.post(
      '/user/auth',
      { ...payload }
    );

    if (response.status === 200) {
      const responseData = response.data;
      const responseMessage = responseData.message;
      
      Cookies.set("token", responseMessage.token, { path: "/" });

      return responseMessage;
    }
  } catch (e: any) {
    if (e.response && e.response.status === 401) {
      if (e.response.data?.message?.type === "user_blocked") {
        return { status: "banned", message: e.response.data.message };
      } else {
        return { status: "error" };
      }
    }
  }
}