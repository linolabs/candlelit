import type { PublicRuntimeConfig } from 'nuxt/schema';
import { ofetch } from 'ofetch';
import type { TCalenderEventResponse, TSeiueAuthResposnse, TVenueList, TVenueResponse } from '~/types';
import { getMondayOfWeek, getSundayTwoWeeksLater } from '~/utils/shared';

export function cookiesParser(cookies: string[]) {
  const parsedCookies: Record<string, string> = {};
  for (const cookie of cookies) {
    const [content, ..._options] = cookie.split(';');
    const [name, value] = content.split('=');
    parsedCookies[name] = value;
  }
  return parsedCookies;
}

export class Seiue {
  private accessToken: string;
  private activeReflectionId: number;
  env: PublicRuntimeConfig;

  constructor(accessToken: string, activeReflectionId: number) {
    this.accessToken = accessToken;
    this.activeReflectionId = activeReflectionId;
    this.env = useRuntimeConfig().public;
  }

  static async init(schoolId: string, password: string): Promise<Seiue | null> {
    try {
      const env = useRuntimeConfig().public;
      const loginRes = await ofetch.raw(`${env.SEIUE_PASSPORT_URL}/login?school_id=282`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'origin': env.SEIUE_PASSPORT_URL,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
          'Referer': `${env.SEIUE_PASSPORT_URL}/login?school_id=282`,
        },
        redirect: 'manual',
        body: new URLSearchParams({ email: schoolId, password, school_id: '282', submit: '提交' }),
      });
      const cookies = cookiesParser(loginRes.headers.getSetCookie());
      const authorizeRes = await ofetch<TSeiueAuthResposnse>(`${env.SEIUE_PASSPORT_URL}/authorize`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'accept': 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
          'origin': env.SEIUE_CHALK_URL,
          'referer': env.SEIUE_CHALK_URL,
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

  async transformVenueList(venueRes: TVenueResponse) {
    const venueWithInfo = venueRes.map(({ id, name }) => {
      const [building, floor] = name.match(/([A-Z])(\d)/)?.slice(1) ?? [];
      return { id, name, building: building as string, floor: floor as string };
    });
    const calendarEvents = await ofetch<TCalenderEventResponse>(`${this.env.SEIUE_API_URL}/scms/venue/venues/calendar-events`, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'authorization': `Bearer ${this.accessToken}`,
        'x-reflection-id': this.activeReflectionId.toString(),
        'x-role': 'student',
        'x-school-id': '282',
        'Referer': this.env.SEIUE_CHALK_URL,
      },
      params: {
        end_time: getSundayTwoWeeksLater(),
        start_time: getMondayOfWeek(),
        venue_id_in: venueRes.map(({ id }) => id).join(','),
      },
      method: 'GET',
    });
    const venues = calendarEvents.map(({ venue_id, events }) => {
      const venue = venueWithInfo.find(({ id }) => id === venue_id)!;
      // clear unnecessary properties
      events = events.map(({ start_time, end_time }) => ({ start_time, end_time }));
      return { ...venue, events };
    });
    return venues;
  }

  async getVenueList(): Promise<TVenueList> {
    const res = await ofetch<TVenueResponse>(`${this.env.SEIUE_API_URL}/scms/venue/order-venues`, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
        'x-reflection-id': this.activeReflectionId.toString(),
        'x-role': 'student',
        'authorization': `Bearer ${this.accessToken}`,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
        'x-school-id': '282',
        'Referer': this.env.SEIUE_CHALK_URL,
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
    return this.transformVenueList(res);
  }
}
