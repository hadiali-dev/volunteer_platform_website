import type { ReactElement } from "react";

import { OpportunityDetailsClient } from "@/features/dashboard/components/OpportunityDetailsClient";

interface OpportunityDetailsPageProps {
  params: Promise<{
    opportunityId: string;
  }>;
}

export default async function OpportunityDetailsPage({
  params,
}: OpportunityDetailsPageProps): Promise<ReactElement> {
  const { opportunityId } = await params;

  return <OpportunityDetailsClient opportunityId={opportunityId} />;
}
