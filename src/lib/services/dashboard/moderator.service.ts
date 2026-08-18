import Report from "@/models/Report";
import { connectDB } from "@/lib/mongodb";

export async function getModeratorStats() {
  await connectDB();

  const [
    pending,
    investigating,
    resolved,
    rejected,
  ] = await Promise.all([
    Report.countDocuments({
      status: "pending",
    }),

    Report.countDocuments({
      status: "investigating",
    }),

    Report.countDocuments({
      status: "resolved",
    }),

    Report.countDocuments({
      status: "rejected",
    }),
  ]);

  return {
    pending,
    investigating,
    resolved,
    rejected,
    active: pending + investigating,
    total: pending + investigating + resolved + rejected,
  };
}