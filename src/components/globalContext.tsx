import React, { createContext, useState, Dispatch, SetStateAction, ReactNode } from "react";

interface GlobalContextType {
  shouldSearch: boolean;
  setShouldSearch: Dispatch<SetStateAction<boolean>>;
  authenticated: boolean;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
}

export const GlobalContext = createContext<GlobalContextType>({
  shouldSearch: false,
  setShouldSearch: () => {}, // Default is a no-op
  authenticated: false,
  setAuthenticated: () => {}, // Default is a no-op
});

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [shouldSearch, setShouldSearch] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        shouldSearch,
        setShouldSearch,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
