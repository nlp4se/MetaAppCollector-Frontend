import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import AppService from '../services/AppService';

type AppsContextType = {
  apps: AppSummaryDTO[];
  refreshApps: () => Promise<void>;
  removeAppFromList: (id: string) => void;
};

const AppsContext = createContext<AppsContextType | undefined>(undefined);

interface AppsProviderProps {
  children: ReactNode;
}

export const AppsProvider: React.FC<AppsProviderProps> = ({ children }) => {
  const [apps, setApps] = useState<AppSummaryDTO[]>([]);
  const appService = new AppService();

  const refreshApps = async () => {
    const fetchedApps = await appService.fetchApps();
    setApps(fetchedApps);
  };

  const removeAppFromList = (id: string) => {
    setApps((prev) => prev.filter(app => String(app.id) !== String(id)));
  };

  useEffect(() => {
    console.log("🔁 AppsProvider muntat → refreshApps()");
    refreshApps();
  }, []);

  return (
    <AppsContext.Provider value={{ apps, refreshApps, removeAppFromList }}>
      {children}
    </AppsContext.Provider>
  );
};

export const useApps = (): AppsContextType => {
  const context = useContext(AppsContext);
  if (!context) {
    throw new Error('useApps must be used within an AppsProvider');
  }
  return context;
};
