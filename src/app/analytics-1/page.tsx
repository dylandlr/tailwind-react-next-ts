import { analytics } from "@/utils/analytics";

const Page = async () => {
  // retrieve the pageview event from upstash API
  const pageview = await analytics.retrieve("pageview", "11/02/2024");
  return <pre className="dark:text-white">{JSON.stringify(pageview)} </pre>;
};

export default Page;
