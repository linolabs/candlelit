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

export interface TOrder {
  id: number;
  capacity: number;
  description: string;
  timeRanges: TTimeRangeItem[];
  venueId: number;
  isCandlelit: boolean; // is created using this tool
}

export interface TNewOrder {
  venueId: number;
  capacity: number;
  description: string;
  dateRanges: {
    startAt: string;
    endAt: string;
  };
  timeRanges: {
    startAt: string;
    endAt: string;
  }[];
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
  order: TOrder;
} | {
  success: false;
  message: string;
  order: TNewOrder;
};

export type TSendOrderResult = TSendOrderResultItem[];
