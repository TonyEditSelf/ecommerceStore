import { getSupabaseAdmin } from "@/lib/db";

export const Lead = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("leads").select(options.select || "*, customer:customers(*)");

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.customer_id) query = query.eq("customer_id", filters.customer_id);

    if (options.sort) {
      for (const [key, value] of Object.entries(options.sort)) {
        query = query.order(key, { ascending: value === 1 });
      }
    } else {
      query = query.order("last_activity", { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(l => ({ ...l, _id: String(l.id) }));
  },

  async upsert(customerId, updates) {
    const db = getSupabaseAdmin();
    // Check if lead exists
    const { data: existing } = await db.from("leads").select("id").eq("customer_id", customerId).single();

    if (existing) {
      const { data: result, error } = await db.from("leads")
        .update({ ...updates, last_activity: new Date().toISOString() })
        .eq("id", existing.id)
        .select();
      if (error) throw error;
      return result[0];
    } else {
      const { data: result, error } = await db.from("leads")
        .insert([{ customer_id: customerId, ...updates, last_activity: new Date().toISOString() }])
        .select();
      if (error) throw error;
      return result[0];
    }
  }
};

export default Lead;
