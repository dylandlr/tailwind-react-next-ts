"use client";
import { analytics } from "@/utils/analytics";
import { Card, BarChart } from "@tremor/react";

interface AnalyticsDashboardProps {
  // interface for the AnalyticsDashboard component
  avgVisitorsPerDay: string; // average visitors per day is set to a string
  amtVisitorsToday: number; // amount of visitors today is declared as a number
  timeseriesPageviews: Awaited<ReturnType<typeof analytics.retrieveDays>>; // timeseriesPageviews is set to the return type of the analytics.retrieveDays function
}

const AnalyticsDashboard = ({
  // AnalyticsDashboard component with props, props are destructured from the interface above to be used in the component
  avgVisitorsPerDay,
  amtVisitorsToday,
  timeseriesPageviews,
}: AnalyticsDashboardProps) => {
  // component function with props passed in as an argument
  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="w-full mx-auto max-w-xs">
          <p className="text-tremor-default text-dark-tremor-content">
            Avg. visitors/day
          </p>
          <p className="text-3xl text-dark-tremor-content-strong font-semibold">
            {avgVisitorsPerDay}
          </p>
        </Card>
        <Card className="w-full mx-auto max-w-xs">
          <p className="text-tremor-default text-dark-tremor-content">
            Visits Today
          </p>
          <p className="text-3xl text-dark-tremor-content-strong font-semibold">
            {amtVisitorsToday}
          </p>
        </Card>
      </div>
      <Card>
        {timeseriesPageviews ? ( // if timeseriesPageviews is not null, render the BarChart component
          <BarChart
            allowDecimals={false}
            showAnimation
            data={timeseriesPageviews.map((day) => ({
              name: day.date,
              Visitors: day.events.reduce((acc, curr) => {
                return acc + Object.values(curr)[0]!;
              }, 0),
            }))}
            categories={["Visitors"]}
            index="name"
          />
        ) : null}
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
