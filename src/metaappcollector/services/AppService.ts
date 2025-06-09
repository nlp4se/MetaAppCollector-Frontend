import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import { AppCreateDTO } from '../DTOs/AppCreateDTO';
import { METAAPP_API_URL } from '../../config';
import { authFetch } from './api/authFetch';

class AppService {

    async fetchApps(): Promise<AppSummaryDTO[]> {
        try {
            console.log('Fetching apps from:', `${METAAPP_API_URL}apps/`);
            const response = await authFetch(`${METAAPP_API_URL}apps/`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.map((app: any) => ({
            id: app.id,
            name: app.name,
            iconUrl: app.icon_url || 'https://via.placeholder.com/150',
            }));
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return [];
        }
    }

    async fetchAppById(appId: string): Promise<AppDetailDTO | null> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}apps/${appId}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const app = await response.json();
            return {
            id: app.id,
            code: app.code,
            name: app.name,
            description: app.description,
            developer: app.developer,
            releaseDate: app.release_date,
            pegi: app.pegi_rating,
            sizeMB: app.sizeMB,
            availableOnAndroid: app.available_on_android,
            availableOnIos: app.available_on_ios,
            iconUrl: app.icon_url || 'https://via.placeholder.com/150',
            appStoreId: app.appstore_id,
            playStoreId: app.playstore_id,
            minIosVersion: app.min_ios_version,
            };
        } catch (error) {
            console.error('There was a problem with the authFetch operation:', error);
            return null;
        }
    }

    async createApp(appData: AppCreateDTO): Promise<{ id: string } | { errors: string[] } | null> {
      try {
        const response = await authFetch(`${METAAPP_API_URL}apps/`, {
        method: 'POST',
        body: JSON.stringify({
            code: appData.code,
            name: appData.name,
            description: appData.description,
            appstore_id: appData.appstoreId,
            playstore_id: appData.playstoreId,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        return { errors: data.errors || ['Error desconocido al crear la app.'] };
        }

        return { id: data.id };
    } catch (error) {
        console.error('Error al hacer authFetch:', error);
        return null;
    }
    }

    async updateApp(id: string, data: Partial<AppDetailDTO>): Promise<any> {
        try {
        const response = await authFetch(`${METAAPP_API_URL}apps/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Error del servidor:", errorData);
            return { errors: errorData };
        }

        return await response.json();
        } catch (error) {
        return null;
        }
    }

    async deleteApp(appId: string): Promise<boolean> {
        try {
            const response = await authFetch(`${METAAPP_API_URL}apps/${appId}/`, {
            method: 'DELETE',
            });

            return response.ok;
        } catch (error) {
            console.error('Error deleting app:', error);
            return false;
        }
        }
}

export default AppService;