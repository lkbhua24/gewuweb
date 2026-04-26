export interface PhoneSpecs {
  display: {
    size: string;
    resolution: string;
    type: string;
    refreshRate: string;
    ppi: number;
  };
  performance: {
    chipset: string;
    cpu: string;
    gpu: string;
    ram: string[];
    storage: string[];
  };
  camera: {
    rear: CameraSpec[];
    front: CameraSpec;
    video: string;
  };
  battery: {
    capacity: string;
    charging: string;
    wirelessCharging: boolean;
  };
  connectivity: {
    fiveG: boolean;
    wifi: string;
    bluetooth: string;
    nfc: boolean;
  };
  dimensions: {
    height: string;
    width: string;
    thickness: string;
    weight: string;
  };
  os: string;
  extras: string[];
}

export interface CameraSpec {
  mp: string;
  aperture: string;
  features?: string[];
}

export interface PhoneWithSpecs {
  id: string;
  brand: string;
  model: string;
  imageUrl: string | null;
  releaseDate: string | null;
  priceCny: number | null;
  category: string | null;
  specs: PhoneSpecs | null;
}

export interface PhoneCompareItem {
  id: string;
  brand: string;
  model: string;
  imageUrl: string | null;
  priceCny: number | null;
  specs: PhoneSpecs | null;
}
