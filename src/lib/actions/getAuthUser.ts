"use server";

import { currentUser } from "@clerk/nextjs/server";

export const getUserDetails = async () => {
  const user = await currentUser();

  if (!user) {
    return { userId: undefined, userName: "", userProfileImage: "" };
  }

  const userId = user?.id;
  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const userProfileImage = user?.imageUrl;

  return { userId, userName, userProfileImage };
};
