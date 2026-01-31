"use client"
import { createContext, useState } from "react";

export const UserDetailContext = createContext<any>(null);

export const UserDetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetail, setUserDetail] = useState<any>(null);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};