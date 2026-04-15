export type VendorProduct = {
  vendorId: string;
  vendorProductId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  category?: string;
  commissionRate?: number;
};

