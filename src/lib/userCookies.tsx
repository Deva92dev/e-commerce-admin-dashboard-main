import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export const getUserDataFromCookies = async () => {
  const cookie = await cookies();
  const userData = cookie.get("userData");

  if (!userData || !userData.value) {
    const user = await currentUser();

    if (user) {
      const userId = user?.id;
      const userName = user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "";
      const userProfileImage = user?.imageUrl;

      try {
        const response = await fetch("http://localhost:3000/api/setUserData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName, userProfileImage }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error saving user data:", error);
      }

      return {
        userId,
        userName,
        userProfileImage,
      };
    }
  } else {
    return JSON.parse(userData.value);
  }
  return null;
};
