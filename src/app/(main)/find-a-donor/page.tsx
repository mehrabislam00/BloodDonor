import FindDonorClient from "./FindDonorClient";

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

  return (
    <FindDonorClient
      key={`${initialBloodGroup}:${initialArea}`}
      initialBloodGroup={initialBloodGroup}
      initialArea={initialArea}
    />
  );
}
