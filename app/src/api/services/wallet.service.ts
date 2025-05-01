import api from '@/api/clients/axios'
import Cookies from "js-cookie";

import type { WalletConnectPayload } from '../types/api.types';

export const connect = async (payload: WalletConnectPayload) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/wallet/connect',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Wallet connect failed");
  }
}

export const disconnect = async () => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/wallet/disconnect',
      { },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Wallet disconnect failed");
  }
}