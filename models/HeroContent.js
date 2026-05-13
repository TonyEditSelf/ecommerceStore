import { getSupabaseAdmin } from "@/lib/db";

// HeroContent model for Supabase - supports Mongoose-style queries
export const HeroContent = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("hero_content").select(options.select || "*");

    if (filters.active) query = query.eq("active", filters.active);

    if (options.sort) {
      for (const [key, value] of Object.entries(options.sort)) {
        const column = key === "createdAt" ? "created_at" : (key === "sortOrder" ? "sort_order" : key);
        query = query.order(column, { ascending: value === 1 });
      }
    } else {
      query = query.order("sort_order", { ascending: true });
    }

    if (options.skip !== undefined || options.limit !== undefined) {
      const skip = options.skip || 0;
      if (options.limit !== undefined) {
        query = query.range(skip, skip + options.limit - 1);
      } else {
        query = query.range(skip, 999999);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(item => ({ ...item, _id: String(item.id) }));
  },

  async findOne(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("hero_content").select(options.select || "*");

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.id && (typeof filters.id === "string" || typeof filters.id === "number")) {
      query = query.eq("id", filters.id);
    }

    query = query.single();
    const { data, error } = await query;
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async findByIdAndUpdate(id, updates = {}) {
    const db = getSupabaseAdmin();
    const mappedUpdates = { ...updates };
    if (mappedUpdates.sortOrder !== undefined) {
      mappedUpdates.sort_order = mappedUpdates.sortOrder;
      delete mappedUpdates.sortOrder;
    }

    const { data, error } = await db
      .from("hero_content")
      .update(mappedUpdates)
      .eq("id", (typeof id === "string" || typeof id === "number") ? id : 0)
      .select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async findByIdAndDelete(id) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("hero_content")
      .delete()
      .eq("id", (typeof id === "string" || typeof id === "number") ? id : 0)
      .select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async create(data) {
    const db = getSupabaseAdmin();
    const mappedData = { ...data };
    if (mappedData.sortOrder !== undefined) {
      mappedData.sort_order = mappedData.sortOrder;
      delete mappedData.sortOrder;
    }

    const { data: result, error } = await db
      .from("hero_content")
      .insert([mappedData])
      .select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async countDocuments(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("hero_content").select("*", { count: "exact" });

    if (filters.active !== undefined) query = query.eq("active", filters.active);
    if (filters._id && filters._id.$ne) {
      // Handle $ne (not equal) operator
      query = query.neq("id", filters._id.$ne);
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },


};

export default HeroContent;

