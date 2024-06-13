export interface TSeiueAuthResponse {
  token_type: 'bearer';
  expires_in: number;
  access_token: string;
  active_reflection_id: number;
};

export interface TSeiueVenueResponseItem {
  id: number;
  name: string;
  open_time_ranges: {
    ranges: TSeiueTimeRangeItem[];
    week_days: number[];
  }[];
}

export type TSeiueVenueResponse = TSeiueVenueResponseItem[];

export interface TSeiueCalenderEvents {
  venue_id: number;
  events: TSeiueCalenderEventItem[];
}

export interface TSeiueCalenderEventItem {
  start_time: string;
  end_time: string;
}

export type TSeiueCalenderEventResponse = TSeiueCalenderEvents[];

export interface TSeiueOrderTimesResponseItem {
  start_at: string;
  end_at: string;
  venue_id: number;
}

export type TSeiueOrderTimesResponse = TSeiueOrderTimesResponseItem[];

export interface TSeiueTimeRangeItem {
  start_at: string;
  end_at: string;
}

export interface TSeiueOrderDetailResponse {
  capacity: number;
  description: string;
  time_ranges: TSeiueTimeRangeItem[];
  venue_id: number;
  id: number;
}

export type TSeiueMyOrdersResponse = TSeiueOrderDetailResponse[];
