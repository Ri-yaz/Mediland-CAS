import { getVitalSignData } from "@/utils/services/medical";
import BloodPressureChart from "./blood-pressure-chart";
import { HeartRateChart } from "./heart-rate-chart";

export default async function ChartContainer({ id }: { id: string }) {
  if (!id) return <div>No data found</div>;

  const { data, average, heartRateData, averageHeartRate } =
    await getVitalSignData(id);

  return (
    <>
      <BloodPressureChart data={data} average={average} />
      <HeartRateChart data={heartRateData} average={averageHeartRate} />
    </>
  );
}
