import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchWords } from "@/lib/db/queries";
import Words from "./Words";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["words"],
    queryFn: fetchWords,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Words />
    </HydrationBoundary>
  );
}
