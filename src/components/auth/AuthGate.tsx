import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Login } from "./Login";
import { Information } from "./Information";

interface AuthGateProps {
  onClose: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onClose }) => {
  const { user, status } = useAuth();

  if (status === "authenticated" && user) {
    return <Information onClose={onClose} />;
  }

  return <Login onClose={onClose} />;
};