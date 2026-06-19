import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { Layout } from '../components/Layout';
import { BalanceDashboard } from '../components/BalanceDashboard';

const rootRoute = createRootRoute({ component: () => <Layout><Outlet /></Layout> });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: BalanceDashboard });
const routeTree = rootRoute.addChildren([indexRoute]);
export const router = createRouter({ routeTree });
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
