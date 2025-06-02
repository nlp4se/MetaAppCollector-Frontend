import { METAAPP_API_URL } from '../../config';
import { authFetch } from './api/authFetch';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';

class PollingService {

    async fetchMetricPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/metrics/apps/${appId}/`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'metrics',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }
    
    async fetchReviewPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/reviews/apps/${appId}/`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'reviews',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async activateMetricPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/metrics/apps/${appId}/activate/`, {method: 'POST'});

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'metrics',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async activateReviewPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/reviews/apps/${appId}/activate/`, {method: 'POST'});

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'reviews',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async deactivateMetricPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/metrics/apps/${appId}/deactivate/`, {method: 'POST'});

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'metrics',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async deactivateReviewPolling(appId: string): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}polling/reviews/apps/${appId}/deactivate/`, {method: 'POST'});

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
            type: 'reviews',
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run,
            nextRun: data.next_run,
            startAt: data.start_at,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }
}

export default PollingService;