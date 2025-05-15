export interface AppDetailDTO {
  id: string;
  name: string;
  description: string;
  developer: string;
  releaseDate: string;
  pegi: string;
  sizeMB: number;
  availableOnAndroid: boolean;
  availableOnIos: boolean;
  iconUrl: string;
  appStoreId: string;
  playStoreId: string;
}
