import api from '@/api/clients/axios'
import Cookies from "js-cookie";

import type { 
  FriendsGet, 
  FriendsCollect, 
  FriendsUpgrade, 
  FriendsUpgradeGet
} from '../types/api.types';


export const get = async (payload: FriendsGet) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/friends/get',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Friends get failed");
  }
}

export const collect = async (payload: FriendsCollect) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/friends/collect',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Friends collect tokens failed");
  }
}

export const upgrade = async (payload: FriendsUpgrade) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/friends/upgrade',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      const responseMessage = responseData.message;
      return responseMessage;
    }
  } catch (e: any) {
    console.log(e);
    throw new Error("Upgrade friend failed");
  }
}

export const upgradeGet = async (payload: FriendsUpgradeGet) => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.post(
      '/friends/upgrade/get',
      { ...payload },
      { headers: { Authorization: `Bearer ${tokenAuth}` } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    console.log(e);
    throw new Error("Upgrade friend failed");
  }
}