import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';

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
}

export default AppService;