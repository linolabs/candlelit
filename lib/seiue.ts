import { FetchError, ofetch } from 'ofetch';
import { ZeroWidth } from '~/utils/zerowidth';
import type { TCalenderEventResponse, TNewOrder, TOcupiedTime, TOrderTimesResponse, TSeiueAuthResposnse, TVenueList, TVenueResponse } from '~/types';
import { getMondayOfWeek, getSundayTwoWeeksLater } from '~/utils/shared';
import { SEIUE_API_URL, SEIUE_CHALK_URL, SEIUE_PASSPORT_URL } from '~/constants';

export function cookiesParser(cookies: string[]) {
  const parsedCookies: Record<string, string> = {};
  for (const cookie of cookies) {
    const [content, ..._options] = cookie.split(';');
    const [name, value] = content.split('=');
    parsedCookies[name] = value;
  }
  return parsedCookies;
}

export interface TCredentials { schoolId: string; password: string };
export interface TDirectCredentials { accessToken: string; activeReflectionId: number }

export class Seiue {
  private accessToken: string;
  private activeReflectionId: number;
  private fetcher: typeof ofetch;

  constructor(accessToken: string, activeReflectionId: number) {
    this.accessToken = accessToken;
    this.activeReflectionId = activeReflectionId;
    this.fetcher = ofetch.create({
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
        'authorization': `Bearer ${this.accessToken}`,
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'x-reflection-id': this.activeReflectionId.toString(),
        'x-role': 'student',
        'x-school-id': '282',
      },
    });
  }

  static async init(credentials: TCredentials): Promise<Seiue | null>;
  static async init(credentials: TDirectCredentials, direct: true): Promise<Seiue | null>;
  static async init(credentials: TCredentials | TDirectCredentials, direct?: true): Promise<Seiue | null> {
    if (direct) {
      const { accessToken, activeReflectionId } = credentials as TDirectCredentials;
      return new Seiue(accessToken, activeReflectionId);
    }
    try {
      const { schoolId, password } = credentials as TCredentials;
      const loginRes = await ofetch.raw(`${SEIUE_PASSPORT_URL}/login?school_id=282`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'origin': SEIUE_PASSPORT_URL,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
          'Referer': `${SEIUE_PASSPORT_URL}/login?school_id=282`,
        },
        redirect: 'manual',
        body: new URLSearchParams({ email: schoolId, password, school_id: '282', submit: '提交' }),
      });
      const cookies = cookiesParser(loginRes.headers.getSetCookie());
      const authorizeRes = await ofetch<TSeiueAuthResposnse>(`${SEIUE_PASSPORT_URL}/authorize`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'origin': SEIUE_CHALK_URL,
          'referer': SEIUE_CHALK_URL,
          'cookie': Object.entries(cookies).map(([name, value]) => `${name}=${value}`).join('; '),
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
        },
        body: new URLSearchParams({ client_id: 'GpxvnjhVKt56qTmnPWH1sA', response_type: 'token' }),
      });
      return new Seiue(authorizeRes.access_token, authorizeRes.active_reflection_id);
    } catch {
      return null;
    }
  }

  user() {
    return { accessToken: this.accessToken, activeReflectionId: this.activeReflectionId };
  }

  async getCalendarEvents(venueIds: string): Promise<TCalenderEventResponse> {
    return await this.fetcher<TCalenderEventResponse>(`${SEIUE_API_URL}/scms/venue/venues/calendar-events`, {
      headers: {
        Referer: SEIUE_CHALK_URL,
      },
      params: {
        end_time: getSundayTwoWeeksLater(),
        start_time: getMondayOfWeek(),
        venue_id_in: venueIds,
      },
      method: 'GET',
    });
  }

  async getOrderTimes(venueIds: string): Promise<TOrderTimesResponse> {
    return await this.fetcher(`${SEIUE_API_URL}/scms/venue/order-times`, {
      headers: {
        Referer: SEIUE_CHALK_URL,
      },
      params: {
        end_at_elt: getSundayTwoWeeksLater(),
        start_at_egt: getMondayOfWeek(),
        status: 'initiated',
        venue_id_in: venueIds,
      },
      method: 'GET',
    });
  }

  async getVenueList(): Promise<TVenueList> {
    const venueRes = await this.fetcher<TVenueResponse>(`${SEIUE_API_URL}/scms/venue/order-venues`, {
      headers: {
        Referer: SEIUE_CHALK_URL,
      },
      method: 'GET',
      params: {
        expand: 'places,place_ids',
        need_select_follower: true,
        only_empty_time: false,
        page: 1,
        per_page: 100,
        sort: '-vf_id,-id',
        type_id_in: 32008,
      },
    });
    const venues = venueRes.map(({ id, name }) => {
      const [building, floor] = name.match(/([A-Z])(\d)/)?.slice(1) ?? [];
      return { id, name, building: building as string, floor: floor as string, occupiedTimes: [] as TOcupiedTime[] };
    });
    const venueIds = venues.map(({ id }) => id).join(',');
    const calendarEvents = await this.getCalendarEvents(venueIds);
    const orderTimes = await this.getOrderTimes(venueIds);
    for (const { venue_id, events } of calendarEvents) {
      const venue = venues.find(({ id }) => id === venue_id)!;
      venue.occupiedTimes.push(...events.map(({ start_time, end_time }) => ({ start_at: start_time, end_at: end_time })));
    }
    for (const { venue_id, start_at, end_at } of orderTimes) {
      const venue = venues.find(({ id }) => id === venue_id)!;
      venue.occupiedTimes.push({ start_at, end_at });
    }
    return venues;
  }

  async createOrder(venueId: number, order: TNewOrder) {
    const zeroWidth = new ZeroWidth();
    try {
      const res = await this.fetcher(`${SEIUE_API_URL}/scms/venue/order-venues/${venueId}/orders`, {
        headers: {
          Referer: SEIUE_CHALK_URL,
        },
        method: 'POST',
        body: {
          type: 'single_day',
          time_ranges: order.timeRanges.map(({ startAt, endAt }) => ({ start_at: startAt, end_at: endAt })),
          capacity: order.capacity,
          // hide @candlelit in order description which serves as a marker
          description: zeroWidth.zeroEncode(order.description, '@candlelit'),
          date_ranges: {
            start_at: order.dateRanges.startAt,
            end_at: order.dateRanges.endAt,
          },
        },
      });
      return { success: true as const, message: '预约成功', orderId: res.id as number };
    } catch (e: unknown) {
      if (e instanceof FetchError && e.status === 422)
        return { success: false as const, message: '时间冲突' };
      return { success: false as const, message: '未知错误' };
    }
  }

  async getOrderDetail(orderId: number) {
    return await this.fetcher(`${SEIUE_API_URL}/scms/venue/orders/${orderId}`, {
      headers: {
        expand: 'order_times,venue',
        Referer: SEIUE_CHALK_URL,
      },
      method: 'GET',
    });
  }

  async getMyOrders() {
    return await this.fetcher(`${SEIUE_API_URL}/scms/venue/my-orders`, {
      headers: {
        Referer: SEIUE_CHALK_URL,
      },
      params: {
        expand: 'order_times,venue',
        page: 1,
        per_page: 100,
      },
      method: 'GET',
    });
  }

  async cancelOrder(orderId: number) {
    try {
      await this.fetcher(`${SEIUE_API_URL}/scms/venue/candel-orders/${orderId}`, {
        headers: {
          Referer: SEIUE_CHALK_URL,
        },
        method: 'PUT',
      });
      return { success: true as const, message: '取消成功' };
    } catch {
      return { success: false as const, message: '取消失败' };
    }
  }
}
