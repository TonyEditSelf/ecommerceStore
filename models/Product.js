import { getSupabaseAdmin } from "@/lib/db";

// Product model for Supabase - supports Mongoose-style queries
export const Product = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("products").select(options.select || "*");

    // Handle simple equality filters
    if (filters._id?.$in && Array.isArray(filters._id.$in)) {
      query = query.in("id", filters._id.$in);
    } else if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.slug) query = query.eq("slug", filters.slug);
    if (filters["flags.featured"]) query = query.eq("flags->featured", true);
    if (filters["flags.bestSelling"]) query = query.eq("flags->bestSelling", true);
    if (filters["flags.latest"]) query = query.eq("flags->latest", true);
    if (filters["flags.fastSelling"]) query = query.eq("flags->fastSelling", true);

    if (options.sort) {
      for (const [key, value] of Object.entries(options.sort)) {
        const column = key === "createdAt" ? "created_at" : key;
        query = query.order(column, { ascending: value === 1 });
      }
    }

    // Handle $or queries (search with regex patterns)
    if (filters.$or) {
      const { data: allData, error: allError } = await query;
      if (allError) throw allError;

      let filtered = allData.filter((item) => {
        return filters.$or.some((condition) => {
          for (const [field, regex] of Object.entries(condition)) {
            if (regex instanceof RegExp) {
              const value = String(item[field] || "");
              if (regex.test(value)) return true;
            }
          }
          return false;
        });
      });
      
      if (options.skip !== undefined) {
        filtered = filtered.slice(options.skip);
      }
      if (options.limit !== undefined) {
        filtered = filtered.slice(0, options.limit);
      }
      return filtered.map(item => ({ ...item, _id: String(item.id) }));
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
    let query = db.from("products").select(options.select || "*");

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.slug) query = query.eq("slug", filters.slug);

    query = query.single();
    const { data, error } = await query;
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async findOneAndUpdate(filters = {}, updates = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("products").update(updates);

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.slug) query = query.eq("slug", filters.slug);

    const { data, error } = await query.select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async findOneAndDelete(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("products").delete();

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.slug) query = query.eq("slug", filters.slug);

    const { data, error } = await query.select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async create(data) {
    const db = getSupabaseAdmin();
    const { data: result, error } = await db
      .from("products")
      .insert([data])
      .select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async countDocuments(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("products").select("*", { count: "exact" });

    if (filters.category) query = query.eq("category", filters.category);
    if (filters["flags.featured"]) query = query.eq("flags->featured", true);
    if (filters["flags.bestSelling"]) query = query.eq("flags->bestSelling", true);
    if (filters["flags.latest"]) query = query.eq("flags->latest", true);
    if (filters["flags.fastSelling"]) query = query.eq("flags->fastSelling", true);

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },
};

export default Product;
