import type { Seiue } from './seiue';
import type { TVenue, TVenueList } from '~/types';

export interface TSortOptions {
  firstSortBy: 'floor' | 'building';
  buildingOrder: { [key: string]: number };
}

export class Booker {
  private seiue: Seiue;
  private venues: TVenueList;

  constructor(seiue: Seiue, venues: TVenueList) {
    this.seiue = seiue;
    this.venues = venues;
  }

  static async init(seiue: Seiue): Promise<Booker> {
    const venues = await seiue.getVenueList();
    return new Booker(seiue, venues);
  }

  isTimeRangeValid(startTime: Date, endTime: Date, venue: TVenue): boolean {
    const startHour = startTime.getHours() + startTime.getMinutes() / 60;
    const endHour = endTime.getHours() + endTime.getMinutes() / 60;

    for (const openTimeRange of venue.openTimeRanges) {
      if (openTimeRange.weekDays.includes(startTime.getDay())) {
        for (const range of openTimeRange.ranges) {
          const [openStartHour, openStartMinute] = range.startAt.split(':').map(Number);
          const [openEndHour, openEndMinute] = range.endAt.split(':').map(Number);
          const startAtHour = openStartHour + openStartMinute / 60;
          const endAtHour = openEndHour + openEndMinute / 60;
          if (startAtHour <= startHour && endAtHour >= endHour)
            return true;
        }
      }
    }

    return false;
  }

  async isVenueAvailable(venueId: number, startTime: string, endTime: string): Promise<boolean> {
    const venue = this.venues.find(({ id }) => id === venueId);
    if (!venue)
      return false;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!this.isTimeRangeValid(start, end, venue))
      return false;

    if (venue.occupiedTimes.some((occupied) => {
      const occupiedStart = new Date(occupied.startAt);
      const occupiedEnd = new Date(occupied.endAt);

      // Check if timeRange does not overlap with occupied time range
      return (start >= occupiedStart && start < occupiedEnd)
        || (end > occupiedStart && end <= occupiedEnd);
    }))
      return false;

    return true;
  }

  async findAvailableVenues(startTime: string, endTime: string): Promise<TVenueList> {
    const venues = await Promise.all(this.venues.map(async (venue) => {
      return (await this.isVenueAvailable(venue.id, startTime, endTime)) ? venue : {} as TVenue;
    }));
    if (venues.length === 0)
      throw new Error('No venue available');
    return this.sortVenues(venues.filter(venue => venue.id !== undefined));
  }

  sortVenues(
    venues: TVenueList = this.venues,
    options: TSortOptions = { firstSortBy: 'floor', buildingOrder: { B: 0, C: 1, A: 2, D: 3 } },
  ) {
    const { firstSortBy, buildingOrder } = options;

    return venues.toSorted((a, b) => {
      if (firstSortBy === 'floor') {
        // First, sort by floor (lower is better)
        if (a.floor < b.floor)
          return -1;
        if (a.floor > b.floor)
          return 1;

        // Then, sort by building
        return buildingOrder[a.building] - buildingOrder[b.building];
      } else {
        // First, sort by building
        const buildingCompare = buildingOrder[a.building] - buildingOrder[b.building];
        if (buildingCompare !== 0)
          return buildingCompare;

        // Then, sort by floor (lower is better)
        if (a.floor < b.floor)
          return -1;
        if (a.floor > b.floor)
          return 1;
      }

      // If all else fails, return 0 (stable sort)
      return 0;
    });
  }

  async bookVenue(startTime: string, endTime: string, capacity: number, description: string): Promise<void> {
    const availableVenues = await this.findAvailableVenues(startTime, endTime);

    const venueId = availableVenues[0].id;
    await this.seiue.createOrder(venueId, {
      capacity,
      description,
      dateRanges: {
        startAt: startTime,
        endAt: endTime,
      },
      timeRanges: [{
        startAt: startTime,
        endAt: endTime,
      }],
    });
  }
}
