import React, { createContext, ReactElement, ReactNode, useState } from "react";

// Define the types for the user info and system config
type User = {
  id?: number;
  username?: string;
  email?: string;
};

type SystemConfig = {};

// Create a context for the user info and system config
export const AppContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  systemConfig: SystemConfig;
  setSystemConfig: React.Dispatch<React.SetStateAction<SystemConfig>>;
}>({
  user: {
    id: undefined,
    username: undefined,
    email: undefined,
  },
  setUser: () => {},
  systemConfig: {},
  setSystemConfig: () => {},
});

// Create a provider for the user info and system config
export const AppProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  // Set some default user info and system config
  const [user, setUser] = useState<User>({
    id: undefined,
    username: undefined,
    email: undefined,
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({});

  return (
    // Pass the user info and system config to the context provider
    <AppContext.Provider
      value={{ user, setUser, systemConfig, setSystemConfig }}
    >
      {children}
    </AppContext.Provider>
  );
};
