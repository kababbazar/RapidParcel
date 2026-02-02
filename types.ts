
export enum SiteType {
  INSIDE = 'Inside Dhaka',
  SUB = 'Sub Area',
  OUTSIDE = 'Outside Dhaka'
}

export interface Merchant {
  id: string;
  name: string;
  pageName: string;
  pageLink?: string;
  phone: string;
  address: string;
  charges: {
    delivery: { [key in SiteType]: number };
    cod: { [key in SiteType]: number };
    weight: { [key in SiteType]: number };
  };
}

export interface Area {
  id: string;
  site: SiteType;
  district: string;
  areaName: string;
  postCode: string;
  homeDelivery: boolean;
}

export interface ParcelEntry {
  id: string;
  date: string;
  merchantId: string;
  invoiceNumber: string;
  merchantInvoice: string;
  customerName: string;
  phone: string;
  address: string;
  areaId: string;
  weight: number;
  amount: number;
  isAiDetected: boolean;
}

export interface AppState {
  merchants: Merchant[];
  areas: Area[];
  entries: ParcelEntry[];
}

export type View = 'dashboard' | 'data-entry' | 'merchants' | 'areas' | 'accounts';

export interface InvoicePrintConfig {
  parcelId: string;
  type: 'POS' | '8x5';
  posSize?: '57mm' | '80mm' | '110mm';
}
