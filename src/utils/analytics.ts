import { redis } from "@/lib/redis";
import { getDate } from "@/utils";
import { parse } from "date-fns";

type AnalyticsArgs = {
  retention?: number;
};

type TrackOptions = {
  persist?: boolean;
};

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;

  constructor(opts?: AnalyticsArgs) {
    if (opts?.retention) this.retention = opts.retention;
  }

  async track(namespace: string, event: object = {}, opts?: TrackOptions) {
    // tracking logic for the analytics
    // database call to store the event
    let key = `analytics::${namespace}`;

    if (!opts?.persist) {
      // persist the event
      key += `::${getDate()}`;
    }

    await redis.hincrby(key, JSON.stringify(event), 1); // increment the event count and stringify the event into a JSON string to store it in Redis
    if (!opts?.persist) {
      await redis.expire(key, this.retention); // set the key to expire after set retention period
    }
  }
  async retrieveDays(namespace: string, nDays: number) {
    type AnalyticsPromise = ReturnType<typeof analytics.retrieve>;
    const promises: AnalyticsPromise[] = [];
    for (let i = 0; i < nDays; i++) {
      const formattedDate = getDate(i);
      const promise = analytics.retrieve(namespace, formattedDate);
      promises.push(promise);
    }
    const fetched = await Promise.all(promises);

    const data = fetched.sort((a, b) => {
      if (
        parse(a.date, "dd/MM/yyyy", new Date()) >
        parse(b.date, "dd/MM/yyyy", new Date())
      ) {
        return 1;
      } else {
        return -1;
      }
    });
    return data;
  }

  async retrieve(namespace: string, date: string) {
    // singular retrieve logic
    const res = await redis.hgetall<Record<string, string>>( // response
      `analytics::${namespace}::${date}` // retrieve the events for the given date
    );

    return {
      // return the response
      date,
      events: Object.entries(res ?? []).map(([key, value]) => ({
        // convert the response into an array of objects
        [key]: Number(value), // convert the value to a number
      })),
    };
  }
}

export const analytics = new Analytics();
