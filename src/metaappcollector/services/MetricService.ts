import { MetricDashboardDTO } from '../DTOs/MetricDashboardDTO';
import { MetricSummaryDTO } from '../DTOs/MetricSummaryDTO';

class MetricService {
  API_URL = 'http://127.0.0.1:8000/api/';

  private getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('METAAPP_ACCESS_TOKEN');
        return token
            ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' };
    }

  async fetchMetrics(): Promise<MetricSummaryDTO[]> {
      try {
          const response = await fetch(`${this.API_URL}metrics/`, {
              headers: this.getAuthHeaders()
          });
          if (!response.ok) {
          throw new Error('Error al obtener métricas');
          }
          return await response.json(); // debe ser array de métricas
      } catch (error) {
          console.error('Error al obtener métricas:', error);
          return [];
      }
      }

  async fetchMetricDashboard(appId: string, metricId: string): Promise<MetricDashboardDTO | null> {
    try {
      const response = await fetch(`${this.API_URL}apps/${appId}/metrics/${metricId}/`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch metric dashboard');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching metric dashboard:', error);
      return null;
    }
  }

  async fetchMetricsById(metricId: string): Promise<MetricSummaryDTO[]> {
        try {
            const response = await fetch(`${this.API_URL}metrics/${metricId}/`, {
                headers: this.getAuthHeaders()
            });
            if (!response.ok) {
            throw new Error('Error al obtener métricas');
            }
            return await response.json(); // debe ser array de métricas
        } catch (error) {
            console.error('Error al obtener métricas:', error);
            return [];
        }
        }
}

export default MetricService;
