"use client";

import { useState } from "react";
import type { Donor } from "@/components/donor/DonorCard";
import AvailableDonors from "@/components/home/AvailableDonors";
import ChooseBloodGroup from "@/components/home/ChooseBloodGroup";

export default function HomeDonorSection({ donors }: { donors: Donor[] }) {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);

  return (
    <>
      <ChooseBloodGroup
        selected={selectedBloodGroup}
        onSelectionChange={setSelectedBloodGroup}
      />
      <AvailableDonors donors={donors} selectedBloodGroup={selectedBloodGroup} />
    </>
  );
}
