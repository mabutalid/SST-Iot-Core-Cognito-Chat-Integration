import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../services/routes/trpc";

export const trpc = createTRPCReact<AppRouter>();
