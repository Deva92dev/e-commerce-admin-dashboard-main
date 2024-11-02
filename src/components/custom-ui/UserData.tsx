"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const UserData = () => {
  const { user } = useUser();

  const userId = user?.id || undefined;
  const userName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";
  const userProfileImage = user?.imageUrl || undefined;

  useEffect(() => {
    // Store the user data in localStorage or send it to an API endpoint to save in cookies
    if (userId) {
      fetch("/api/setUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, userProfileImage }),
      });
    }
  }, [userId, userName, userProfileImage]);

  return null; // No UI rendering needed
};

export default UserData;
