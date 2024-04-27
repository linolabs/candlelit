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

export interface TVenue {
  id: number;
  name: string;
  building: string;
  floor: string;
  events: TCalenderEventItem[];
}

export type TVenueList = TVenue[];

export interface TCalenderEvents {
  venue_id: number;
  events: TCalenderEventItem[];
}

export interface TCalenderEventItem {
  start_time: string;
  end_time: string;
}

export type TCalenderEventResponse = TCalenderEvents[];