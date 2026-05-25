import { useState, useEffect } from "react";
import { apiService, Metric } from "../services/api";
import { DEFAULT_TENANT_ID } from "../config/brand";

export const useExecutiveData = (companyId: string = DEFAULT_TENANT_ID) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [finance, rh, commercial, operations] = await Promise.all([
          apiService.getDashboard("finance", companyId),
          apiService.getDashboard("rh", companyId),
          apiService.getDashboard("commercial", companyId),
          apiService.getDashboard("operations", companyId)
        ]);

        // Process data for the executive view
        setData({
          finance,
          rh,
          commercial,
          operations
        });
      } catch (err: any) {
        console.error("Error loading executive data:", err);
        setError(err.message || "Falha ao carregar visão executiva.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return { data, loading, error };
};
