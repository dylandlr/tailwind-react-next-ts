import { analytics } from "@/utils/analytics";
import AnalyticsDashboard from "@/app/components/AnalyticsDashboard";
import { getDate } from "@/utils";

const Page = async () => {
  // retrieve the pageview event from upstash API
  const TRACKING_DAYS = 7;
  const pageviews = await analytics.retrieveDays("pageview", 7);

  const totalPageviews = pageviews.reduce((acc, curr) => {
    // sum up all pageviews in the last 7 days
    return (
      acc + // accumulator is the sum of all pageviews
      curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!; // return the value of the pageview event
      }, 0)
    );
  }, 0);

  const avgVisitorsPerDay = (totalPageviews / TRACKING_DAYS).toFixed(1);

  const amtVisitorsToday = pageviews
    .filter((ev) => ev.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.events.reduce((acc, curr) => {
          return acc + Object.values(curr)[0]!;
        }, 0)
      );
    }, 0);

  const topCountriesMap = new Map<string, number>();

  for (let i = 0; i < pageviews.length; i++) {
    const day = pageviews[i]; // must edit ts config so noUncheckedIndexedAccess is true
    if (!day) continue;

    for (let j = 0; j < day.events.length; j++) {
      const event = day.events[j];
      if (!event) continue;
    }
  }

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6xl mx-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={avgVisitorsPerDay}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageviews={pageviews}
        />
      </div>
    </div>
  );
};
export default Page;
