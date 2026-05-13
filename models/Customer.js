import { getSupabaseAdmin } from "@/lib/db";

export const Customer = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("customers").select(options.select || "*");

    if (filters.email) query = query.ilike("email", `%${filters.email}%`);
    if (filters.name) query = query.ilike("name", `%${filters.name}%`);

    if (options.sort) {
      for (const [key, value] of Object.entries(options.sort)) {
        query = query.order(key, { ascending: value === 1 });
      }
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (options.limit) {
      const skip = options.skip || 0;
      query = query.range(skip, skip + options.limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(c => ({ ...c, _id: String(c.id) }));
  },

  async findOne(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("customers").select("*");

    if (filters.id) query = query.eq("id", filters.id);
    if (filters.email) query = query.eq("email", filters.email);

    const { data, error } = await query.single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async create(data) {
    const db = getSupabaseAdmin();
    const { data: result, error } = await db.from("customers").insert([data]).select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async update(id, updates) {
    const db = getSupabaseAdmin();
    const { data: result, error } = await db.from("customers").update(updates).eq("id", id).select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async countDocuments(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("customers").select("*", { count: "exact", head: true });
    if (filters.email) query = query.ilike("email", `%${filters.email}%`);
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};

export default Customer;
