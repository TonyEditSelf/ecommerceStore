import { getSupabaseAdmin } from "@/lib/db";

export const Event = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("events").select(options.select || "*");

    if (filters.customer_id) query = query.eq("customer_id", filters.customer_id);
    if (filters.event_type) query = query.eq("event_type", filters.event_type);

    query = query.order("created_at", { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(e => ({ ...e, _id: String(e.id) }));
  },

  async create(data) {
    const db = getSupabaseAdmin();
    const { data: result, error } = await db.from("events").insert([data]).select();
    if (error) throw error;
    return result[0];
  }
};

export default Event;
