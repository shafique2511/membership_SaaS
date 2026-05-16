import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { safeFetch } from '@/lib/api';

interface ModuleAccess {
  id: string;
  name: string;
  enabled: boolean;
  locked: boolean;
}

interface BusinessContextType {
  currentBusiness: any | null;
  setCurrentBusiness: (business: any) => void;
  modules: ModuleAccess[];
  isLoading: boolean;
  checkAccess: (moduleId: string) => boolean;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { businessId } = useParams<{ businessId: string }>();
  const [currentBusiness, setCurrentBusiness] = useState<any | null>(null);
  const [modules, setModules] = useState<ModuleAccess[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (businessId) {
        fetchBusinessById(businessId);
      } else {
        fetchUserBusinesses();
      }
    }
  }, [user, businessId]);

  useEffect(() => {
    if (currentBusiness) {
      fetchBusinessModules();
    }
  }, [currentBusiness]);

  const fetchBusinessById = async (id: string) => {
    setIsLoading(true);
    try {
      const data = await safeFetch(`/api/businesses/${id}`);
      setCurrentBusiness(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBusinesses = async () => {
    setIsLoading(true);
    try {
      const data = await safeFetch('/api/businesses/my-businesses');
      if (data && data.length > 0) {
        setCurrentBusiness(data[0].business);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBusinessModules = async () => {
    if (!currentBusiness) return;
    try {
      // In a real app, this would be a single optimized endpoint
      const data = await safeFetch(`/api/businesses/${currentBusiness.id}/modules`, {
        headers: { 'x-business-id': currentBusiness.id }
      });
      setModules(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkAccess = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    return mod ? !mod.locked : false;
  };

  return (
    <BusinessContext.Provider value={{ currentBusiness, setCurrentBusiness, modules, isLoading, checkAccess }}>
      {children}
    </BusinessContext.Provider>
  );
}

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within BusinessProvider');
  return context;
};
