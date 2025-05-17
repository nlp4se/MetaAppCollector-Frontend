import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import { AppCreateDTO } from '../DTOs/AppCreateDTO';

class AppService {
    API_URL = 'http://127.0.0.1:8000/api/'; 

    async fetchApps(): Promise<AppSummaryDTO[]> {
        try {
            const response = await fetch(`${this.API_URL}apps`);
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
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    async fetchAppById(appId: string): Promise<AppDetailDTO | null> {
        try {
            const response = await fetch(`${this.API_URL}apps/${appId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const app = await response.json();
            return {
            id: app.id,
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
            };
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return null;
        }
    }

    async createApp(appData: AppCreateDTO): Promise<{ id: string } | { errors: string[] } | null> {
      try {
        const response = await fetch(`${this.API_URL}apps/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        console.error('Error al hacer fetch:', error);
        return null;
    }
    }

    async updateApp(appId: string, appData: AppDetailDTO): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}apps/${appId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async deleteApp(appId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_URL}apps/${appId}/`, {
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