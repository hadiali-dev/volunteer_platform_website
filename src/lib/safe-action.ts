import { createSafeActionClient } from "next-safe-action";

import { AppError } from "@/types";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof AppError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "حدث خطأ غير متوقع أثناء تنفيذ العملية.";
  },
});
