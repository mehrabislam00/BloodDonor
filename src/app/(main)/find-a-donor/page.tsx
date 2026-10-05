import FindDonorClient from "./FindDonorClient";
import { getPublicDonorCards } from "@/lib/public-donors";

type FindDonorSearchParams = {
  bloodGroup?: string | string[];
  area?: string | string[];
};

function getSingleSearchParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export default async function FindDonorPage({
  searchParams,
}: {
  searchParams: Promise<FindDonorSearchParams>;
}) {
  const params = await searchParams;
  const initialBloodGroup = getSingleSearchParam(params.bloodGroup);
  const initialArea = getSingleSearchParam(params.area);

  // Pre-load initial donors server-side so the page never renders incomplete or empty
  const initialDonors = await getPublicDonorCards({
    bloodGroup: initialBloodGroup,
    area: initialArea,
    activity: "all",
    availability: "",
  });

  return (
    <FindDonorClient
      key={`${initialBloodGroup}:${initialArea}`}
      initialBloodGroup={initialBloodGroup}
      initialArea={initialArea}
      initialDonors={initialDonors}
    />
  );
}
