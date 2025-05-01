import api from '@/api/clients/axios'
import Cookies from "js-cookie";

import type { LeadersGetPayload } from '../types/api.types';

export const get = async (payload: LeadersGetPayload) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/leaders/get',
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