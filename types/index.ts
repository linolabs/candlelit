export interface TSeiueAuthResposnse {
  token_type: 'bearer';
  expires_in: number;
  access_token: string;
  active_reflection_id: number;
};

export interface TVenueResponseItem {
  id: number;
  name: string;
}

export type TVenueResponse = TVenueResponseItem[];

export interface TCalenderEvents {
  venue_id: number;
  events: TCalenderEventItem[];
}

export interface TCalenderEventItem {
  start_time: string;
  end_time: string;
}

export type TCalenderEventResponse = TCalenderEvents[];

export interface TOrderTimeItem {
  start_at: string;
  end_at: string;
  venue_id: number;
}

export type TOrderTimesResponse = TOrderTimeItem[];

export interface TOcupiedTime {
  start_at: string;
  end_at: string;
}

export interface TVenue {
  id: number;
  name: string;
  building: string;
  floor: string;
  occupiedTimes: TOcupiedTime[];
}

export type TVenueList = TVenue[];

export interface TNewOrder {
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
