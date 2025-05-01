import api from '@/api/clients/axios'
import Cookies from "js-cookie";

export const get = async () => {
  try {
    const tokenAuth = Cookies.get("token");

    if (!tokenAuth) {
      throw new Error("Token not found");
    }

    const response = await api.get(
      '/places/get',
      { headers: { Authorization: `Bearer ${tokenAuth}`, 'ngrok-skip-browser-warning': '69420' } }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData.message;
    }
  } catch (e: any) {
    throw new Error("Places get failed");
  }
}