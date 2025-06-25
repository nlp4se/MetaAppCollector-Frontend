import { METAAPP_API_URL } from '../../config';
import { authFetch } from './api/authFetch';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';

class PollingService {

    async fetchPolling(appId: string, poll_type: "metrics" | "reviews"): Promise<PollingStatusDTO | null> {
        try {
            console.log(`Fetching polling status for appId: ${appId}, poll_type: ${poll_type}`);
            const response = await authFetch(`${METAAPP_API_URL}apps/${appId}/polling/?poll_type=${poll_type}`);
            console.log(response.status)
            if (!response.ok) {
                console.warn(`Polling fetch failed: ${response.status}`);
                return null;
            }
            const data = await response.json();
            return {
            type: poll_type,
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task.last_run_at ? new Date(data.periodic_task.last_run_at) : null,
            nextRun: data.next_run ? new Date(data.next_run) : null,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async activatePolling(appId: string, poll_type: "metrics" | "reviews", intervalHours?: number): Promise<PollingStatusDTO | null> {
        try {
            const query = intervalHours ? `&interval_hours=${intervalHours}` : '';
            const response = await authFetch(
                `${METAAPP_API_URL}apps/${appId}/polling/?poll_type=${poll_type}${query}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                console.warn(`Polling fetch failed: ${response.status}`);
                return null;
            }

            const data = await response.json();
            return {
                type: poll_type,
                enabled: data.is_active,
                intervalHours: data.interval_hours,
                lastRun: data.periodic_task.last_run_at ? new Date(data.periodic_task.last_run) : null,
                nextRun: data.next_run ? new Date(data.next_run) : null,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async deactivatePolling(appId: string, poll_type: "metrics" | "reviews"): Promise<PollingStatusDTO | null> {
        try {
            const response = await authFetch(
            `${METAAPP_API_URL}apps/${appId}/polling/?poll_type=${poll_type}`,
            { method: 'DELETE' }
            );

            if (!response.ok) {
            console.warn(`Polling deactivation failed: ${response.status}`);
            return null;
            }

            const data = await response.json();
            return {
            type: poll_type,
            enabled: data.is_active,
            intervalHours: data.interval_hours,
            lastRun: data.periodic_task?.last_run_at ? new Date(data.periodic_task.last_run_at) : null,
            nextRun: data.next_run ? new Date(data.next_run) : null,
            };
        } catch (error) {
            console.error("There was a problem with the authFetch operation:", error);
            return null;
        }
        }

    async manualReviewPolling(appId: string, dateFrom: string, dateTo: string): Promise<boolean> {
        try {
            const url = `${METAAPP_API_URL}apps/${appId}/polling/reviews/manual/?date_from=${dateFrom}&date_to=${dateTo}`;
            console.log(`Manual review polling URL: ${url}`);
            const response = await authFetch(url, { method: 'POST' });

            if (!response.ok) {
                throw new Error(`Manual review polling failed: ${response.statusText}`);
            }

            return true;
        } catch (error) {
            console.error('Error during manual review polling:', error);
            return false;
        }
    }

}

export default PollingService;