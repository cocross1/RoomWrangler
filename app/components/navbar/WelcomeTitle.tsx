"use client";

import { SafeUser } from "@/app/types";

interface WelcomeTitleProps {
  currentUser?: SafeUser | null;
}

const WelcomeTitle: React.FC<WelcomeTitleProps> = ({ currentUser }) => {

  return (
    <div className="text-center">
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
