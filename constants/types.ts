// aicre/constants/types.ts
export interface Tenant {
    id: string;
    propertyName: string;
    type: string;
    address: string;
    noi: number;
    value: number;
    leverage: number;
    yieldRate: number;
    dscr: number;
    opportunity: string;
    image: string;
    latitude: number;
    longitude: number;
  }
  
  export interface Property {
    id: string;
    propertyName: string;
    city: string;
    type: string;
    address: string;
    noi: number;
    noiYTD: number;
    cashYTD: number;
    netCashFlowThisMonth: number;
    vacancy: number;
    value: number;
    leverage: number;
    yieldRate: number;
    dscr: number;
    opportunity: string;
    image: string;
    latitude: number;
    longitude: number;
    tenants?: Tenant[];
  }
  