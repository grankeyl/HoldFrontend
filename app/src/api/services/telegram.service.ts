import api from '@/api/clients/axios'
import Cookies from "js-cookie";
import type { TelegramCheckUserChannelPayload } from '../types/api.types';

export const checkUserChannel = async (payload: TelegramCheckUserChannelPayload) => {
  try {
    const tokenAuth = Cookies.get("token");
    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/telegram/check/user/channel',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Telegram check user channel failed");
  }
}