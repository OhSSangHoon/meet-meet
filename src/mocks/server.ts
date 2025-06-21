import { setupServer } from "msw/node";
import { gatheringHandlers } from '@/mocks/handlers/gatherings';
import { authHandlers } from '@/mocks/handlers/auth';

export const server = setupServer(...gatheringHandlers, ...authHandlers);