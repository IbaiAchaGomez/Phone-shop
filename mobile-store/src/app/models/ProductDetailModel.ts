export interface ProductDetailModel {
  id: string;
  imgUrl: string;

  brand: string;
  model: string;
  price?: number;

  cpu?: string;
  ram?: string;
  os?: string;

  displayResolution?: string;

  battery?: string;

  primaryCamera?: string[];

  dimentions?: string;
  weight?: string;
  
  options: {
    colors?: ProductOption[];
    storages?: ProductOption[];
  };
}

export interface ProductOption {
  code?: number;
  name?: string;
}