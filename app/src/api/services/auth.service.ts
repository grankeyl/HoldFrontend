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
    console.error(e);
    throw new Error("Authentication failed");
  }
}