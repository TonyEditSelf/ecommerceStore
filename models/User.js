import { getSupabaseAdmin } from "@/lib/db";

// User model for Supabase - supports Mongoose-style queries
export const User = {
  async findOne(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("users").select(options.select || "*");

    if (filters.email) query = query.eq("email", filters.email.toLowerCase());
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

  async findById(id) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("id", (typeof id === "string" || typeof id === "number") ? id : 0)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async findByEmail(email) {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async findOneAndUpdate(filters = {}, updates = {}, options = {}) {
    const db = getSupabaseAdmin();
    
    // Handle upsert with $setOnInsert
    if (options.upsert && updates.$setOnInsert) {
      const existing = await this.findOne(filters);
      if (existing) {
        const updateData = Object.fromEntries(
          Object.entries(updates).filter(([key]) => key !== "$setOnInsert")
        );

        if (!Object.keys(updateData).length) {
          return existing;
        }

        let query = db.from("users").update(updateData);
        
        if (filters.email) query = query.eq("email", filters.email.toLowerCase());
        if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
          query = query.eq("id", filters._id);
        }
        
        const { data, error } = await query.select();
        if (error) throw error;
        return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
      } else {
        // Create new document with set fields
        const newDoc = { ...filters, ...updates.$setOnInsert };
        const { data, error } = await db.from("users").insert([newDoc]).select();
        if (error) throw error;
        return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
      }
    }

    // Normal update
    let query = db.from("users").update(updates);
    if (filters.email) query = query.eq("email", filters.email.toLowerCase());
    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }

    const { data, error } = await query.select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async create(data) {
    const db = getSupabaseAdmin();
    const { data: result, error } = await db
      .from("users")
      .insert([data])
      .select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async countDocuments(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("users").select("*", { count: "exact" });

    if (filters.role) query = query.eq("role", filters.role);

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },


};

export default User;
