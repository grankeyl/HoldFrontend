import api from '@/api/clients/axios'
import Cookies from "js-cookie";

import type {
  UserRewardPayload
} from '../types/api.types';


export const get = async () => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/user/get',
      { },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("User get failed");
  }
}

export const reward = async (payload: UserRewardPayload) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/user/reward',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("User get failed");
  }
}

export const setTop = async () => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/user/show_top',
      { },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      const responseMessage = responseData.message;
      return {
        type: responseData.type,
        data: responseMessage
      };
    }
  } catch (e: any) {
    throw new Error("User get failed");
  }
}