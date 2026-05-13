import { getSupabaseAdmin } from "@/lib/db";

// Order model for Supabase - supports Mongoose-style queries
export const Order = {
  async find(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    
    // Handle Supabase join for populate
    let selectString = options.select || "*";
    if (options.populate && options.populate.includes("userId")) {
      selectString += ", userId:users!user_id(name, email)";
    }
    
    let query = db.from("orders").select(selectString);

    if (filters.userId && (typeof filters.userId === "string" || typeof filters.userId === "number")) {
      query = query.eq("user_id", filters.userId);
    }
    if (filters.paymentStatus) query = query.eq("payment_status", filters.paymentStatus);

    if (options.sort) {
      for (const [key, value] of Object.entries(options.sort)) {
        const column = key === "createdAt" ? "created_at" : key;
        query = query.order(column, { ascending: value === 1 });
      }
    } else {
      query = query.order("created_at", { ascending: false });
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
    if (error) {
      // If the alias join fails, fallback to manual join
      if (error.code === 'PGRST200') {
        let fallbackQuery = db.from("orders").select("*");
        if (filters.userId && (typeof filters.userId === "string" || typeof filters.userId === "number")) {
          fallbackQuery = fallbackQuery.eq("user_id", filters.userId);
        }
        if (filters.paymentStatus) fallbackQuery = fallbackQuery.eq("payment_status", filters.paymentStatus);
        
        if (options.sort) {
          for (const [key, value] of Object.entries(options.sort)) {
            const column = key === "createdAt" ? "created_at" : key;
            fallbackQuery = fallbackQuery.order(column, { ascending: value === 1 });
          }
        } else {
          fallbackQuery = fallbackQuery.order("created_at", { ascending: false });
        }
        
        if (options.skip !== undefined || options.limit !== undefined) {
          const skip = options.skip || 0;
          if (options.limit !== undefined) {
            fallbackQuery = fallbackQuery.range(skip, skip + options.limit - 1);
          } else {
            fallbackQuery = fallbackQuery.range(skip, 999999);
          }
        }
        
        const { data: fbData, error: fbError } = await fallbackQuery;
        if (fbError) throw fbError;
        
        if (options.populate && options.populate.includes("userId") && fbData.length > 0) {
          const userIds = [...new Set(fbData.map(o => o.user_id))];
          const { data: users } = await db.from("users").select("id, name, email").in("id", userIds);
          const userMap = new Map((users || []).map(u => [u.id, { name: u.name, email: u.email }]));
          return fbData.map(order => ({
            ...order,
            _id: String(order.id),
            userId: userMap.get(order.user_id) || order.user_id
          }));
        }
        return (fbData || []).map(order => ({ ...order, _id: String(order.id) }));
      }
      throw error;
    }
    return (data || []).map(order => ({ ...order, _id: String(order.id) }));
  },

  async findOne(filters = {}, options = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("orders").select(options.select || "*");

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.id && (typeof filters.id === "string" || typeof filters.id === "number")) {
      query = query.eq("id", filters.id);
    }
    if (filters.razorpayOrderId) query = query.eq("razorpay_order_id", filters.razorpayOrderId);

    query = query.single();
    const { data, error } = await query;
    if (error && error.code !== "PGRST116") throw error;
    return data ? { ...data, _id: String(data.id) } : null;
  },

  async findOneAndUpdate(filters = {}, updates = {}) {
    const db = getSupabaseAdmin();

    // Map camelCase updates to snake_case
    const mappedUpdates = { ...updates };
    if (mappedUpdates.paymentStatus !== undefined) {
      mappedUpdates.payment_status = mappedUpdates.paymentStatus;
      delete mappedUpdates.paymentStatus;
    }
    if (mappedUpdates.razorpayOrderId !== undefined) {
      mappedUpdates.razorpay_order_id = mappedUpdates.razorpayOrderId;
      delete mappedUpdates.razorpayOrderId;
    }

    let query = db.from("orders").update(mappedUpdates);

    if (filters._id && (typeof filters._id === "string" || typeof filters._id === "number")) {
      query = query.eq("id", filters._id);
    }
    if (filters.id && (typeof filters.id === "string" || typeof filters.id === "number")) {
      query = query.eq("id", filters.id);
    }
    if (filters.razorpayOrderId) query = query.eq("razorpay_order_id", filters.razorpayOrderId);

    const { data, error } = await query.select();
    if (error) throw error;
    return data[0] ? { ...data[0], _id: String(data[0].id) } : null;
  },

  async create(data) {
    const db = getSupabaseAdmin();
    
    // Map camelCase to snake_case
    const insertData = { ...data };
    if (insertData.userId && (typeof insertData.userId === "string" || typeof insertData.userId === "number")) {
      insertData.user_id = insertData.userId;
      delete insertData.userId;
    }
    if (insertData.paymentStatus) {
      insertData.payment_status = insertData.paymentStatus;
      delete insertData.paymentStatus;
    }
    if (insertData.razorpayOrderId) {
      insertData.razorpay_order_id = insertData.razorpayOrderId;
      delete insertData.razorpayOrderId;
    }

    const { data: result, error } = await db
      .from("orders")
      .insert([insertData])
      .select();
    if (error) throw error;
    return result[0] ? { ...result[0], _id: String(result[0].id) } : null;
  },

  async countDocuments(filters = {}) {
    const db = getSupabaseAdmin();
    let query = db.from("orders").select("*", { count: "exact" });

    if (filters.paymentStatus) query = query.eq("payment_status", filters.paymentStatus);

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },


};

export default Order;

