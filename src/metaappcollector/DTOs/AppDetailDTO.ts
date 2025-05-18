export interface AppDetailDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  appStoreId: string;
  playStoreId: string;
  developer: string;
  availableOnIos: boolean;
  availableOnAndroid: boolean;
  pegi: string;
  releaseDate: string;
  minIosVersion: string;
  iconUrl: string;
  sizeMB: number;
}
