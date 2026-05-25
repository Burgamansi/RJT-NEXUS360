import app from "../src/app.js";
import { initDb } from "../src/config/db.js";

async function run() {
  await initDb();
  console.log("Database initialized.");

  const { apiController } = await import("../src/controllers/api.controller.js");

  const reqMockDashboard = {
    method: "GET",
    url: "/api/dashboard/finance",
    params: {
      domain: "finance"
    },
    query: {
      companyId: "uniao_bag"
    },
    body: {}
  } as any;

  const resMock = {
    status(code: number) {
      console.log(`Response Status: ${code}`);
      return this;
    },
    json(data: any) {
      console.log("Response JSON:", JSON.stringify(data, null, 2));
      return this;
    }
  } as any;

  console.log("\n--- Testing GET /api/dashboard/finance ---");
  try {
    await apiController.getDashboard(reqMockDashboard, resMock);
  } catch (e: any) {
    console.error("Dashboard handler crashed:", e);
  }
}

run().catch(console.error);
