import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosProtected = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
