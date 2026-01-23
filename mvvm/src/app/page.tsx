import { HomeView } from "@/views/home/HomeView";
import { getHomeViewModel } from "@/view-models/home/getHomeViewModel";

export default async function HomePage() {
  const vm = await getHomeViewModel();
  return <HomeView {...vm} />;
}
