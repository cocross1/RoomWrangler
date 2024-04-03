"use client";

import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";

interface WelcomeTitleProps {
  currentUser?: SafeUser | null;
}

const WelcomeTitle: React.FC<WelcomeTitleProps> = ({ currentUser }) => {

  return (
    <div>
      {currentUser && (
        <div
          className="text-lg"
        >
          Welcome, {currentUser.name}!
        </div>
      )}
    </div>
  );
};

export default WelcomeTitle;
