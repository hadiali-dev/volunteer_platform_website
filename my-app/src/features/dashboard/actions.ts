"use server";

import { actionClient } from "@/lib/safe-action";

import { markNotificationAsRead } from "@/features/dashboard/api";
import { MarkNotificationReadInputSchema } from "@/features/dashboard/schemas";

export const markNotificationAsReadAction = actionClient
  .inputSchema(MarkNotificationReadInputSchema)
  .action(async ({ parsedInput }) => {
    return markNotificationAsRead(parsedInput.id);
  });
