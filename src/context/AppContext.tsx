import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext<{
  userId: string;
  setUserId: (userId: string) => void;
} | void>(undefined);

const generateUserId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, _setUserId] = useState("");
  const setUserId = useCallback((newUserId: string) => {
    _setUserId(newUserId || generateUserId());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("badger-demo-user-id");
      if (stored) {
        setUserId(stored);
      } else {
        const newId = generateUserId();
        setUserId(newId);
      }
    }
  }, [setUserId]);

  useEffect(() => {
    const h = setTimeout(() => {
      if (userId) {
        localStorage.setItem("badger-demo-user-id", userId);
      }
    }, 1000);

    return () => clearTimeout(h);
  }, [userId]);

  return (
    <AppContext.Provider value={{ userId, setUserId }}>
      {userId ? children : <div>Loading...</div>}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
