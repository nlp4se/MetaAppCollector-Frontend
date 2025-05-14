export interface AppDetailDTO {
  id: string;
  name: string;
  description: string;
  developer: string;
  releaseDate: string;
  pegi: string;
  contentDescriptors: string[];
  sizeMB: number;
  availableOnAndroid: boolean;
  availableOnIos: boolean;
}
