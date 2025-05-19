"use client";
import { useState } from "react";
import withAuth from "@/components/withAuth";
import useAuthStore from "@/hooks/auth/useAuthStore";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "@/hooks/api/useAxiosAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const fetchUserData = async (axiosProtected: any) => {
  const response = await axiosProtected.get("/home");
  return response.data;
};

const Dashboard = () => {
  const { isAuthenticated, user, setUserLoggedOut } = useAuthStore();
  console.log("user", user);
  const router = useRouter();
  const axiosProtected = useAxiosAuth();
  const [open, setOpen] = useState(false);

  const { data, isError, error } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchUserData(axiosProtected),
  });

  const handleLogout = async () => {
    try {
      const refreshToken = getCookie("refresh");
      let logoutMessage = "Logged out successfully";

      if (refreshToken) {
        const response = await axiosProtected.post("/auth/log-out/", {
          refresh: refreshToken,
        });
        logoutMessage = response.data.message || logoutMessage;
      } else {
        console.warn("Refresh token not found. Skipping logout API call.");
      }
      toast.success(logoutMessage);
      setUserLoggedOut()
      deleteCookie("access");
      deleteCookie("refresh");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  if (isError) {
    const errData = (error as any)?.response?.data;
    if ((error as any)?.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
      router.push("/");
      return null;
    }
    toast.error(errData?.message ?? errData?.error ?? errData?.detail ?? "Something went wrong");
    return (
      <div className="p-6 text-red-600">
        Error fetching user data: {errData?.message ?? errData?.error ?? errData?.detail ?? "Something went wrong"}
      </div>
    );
  }
  console.log("isAuthenticated", isAuthenticated);
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">
          Hey! {data?.user?.full_name || "User"} Welcome to your Dashboard
        </h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300"
              onClick={() => setOpen(true)}
            >
              Logout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to log out?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
