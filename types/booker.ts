export interface TTimeRangeItem {
  startAt: string;
  endAt: string;
}

export interface TVenue {
  id: number;
  name: string;
  building: 'A' | 'B' | 'C' | 'D';
  floor: string;
  openTimeRanges: {
    ranges: TTimeRangeItem[];
    weekDays: number[];
  }[];
  occupiedTimes: TTimeRangeItem[];
  preallocatedTimes?: TTimeRangeItem[];
}

export type TVenueList = TVenue[];
export interface TSortOptions {
  firstSortBy: 'floor' | 'building';
  buildingOrder: string[];
}
export interface TOrder {
  id: number;
  capacity: number;
  description: string;
  timeRanges: TTimeRangeItem[];
  venueId: number;
  isCandlelit: boolean; // is created using this tool
}

export interface TNewOrder {
  venue: {
    id: number;
    name: string;
  };
  capacity: number;
  description: string;
  dateRanges: {
    startAt: string;
    endAt: string;
  };
  /**
   *  In our case, we only have one time range in each order.
   *  Still, seiue requires an **array** of time ranges in request body.
   */
  timeRanges: TTimeRangeItem;
}

export interface TNewOrderInput {
  startTime: string;
  endTime: string;
  capacity: number;
  description: string;
}

export type TSendOrderResultItem = {
  success: true;
  message: string;
  order: TNewOrder;
  seiueOrder: TOrder;
} | {
  success: false;
  message: string;
  order: TNewOrder;
};

export type TSendOrderResult = TSendOrderResultItem[];

export interface TSendOrderResultHistoryItem {
  result: TSendOrderResult;
  createdAt: string;
}

export type TSendOrderResultHistory = TSendOrderResultHistoryItem[];

export interface TImageExportPropsItem {
  startTime: string;
  endTime: string;
  venueName: string;
  description: string;
  capacity: number;
}

export interface TImageExportProps {
  createdAt: string;
  orders: TImageExportPropsItem[];
};
