import { isDashboardData, readDashboardData, sendJson, writeDashboardData } from './_shared';
export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') return sendJson(res, 200, await readDashboardData());
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!isDashboardData(body)) return sendJson(res, 400, { success: false, message: 'Invalid dashboard data payload' });
      await writeDashboardData(body);
      return sendJson(res, 200, { success: true });
    }
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
  } catch (error) {
    return sendJson(res, 500, { success: false, message: error instanceof Error ? error.message : 'Dashboard API failed' });
  }
}
