import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  typeof supabaseUrl === 'string' &&
  supabaseUrl.startsWith('http')
);

// ── Local In-Memory / LocalStorage Mock Client ──────────────────────────────
// Used when Supabase credentials are not provided or for offline development.
const ORDERS_STORAGE_KEY = 'goalwear_supabase_orders';
const SESSION_STORAGE_KEY = 'goalwear_admin_session';
const PROFILES_STORAGE_KEY = 'goalwear_user_profiles';
const USERS_STORAGE_KEY = 'goalwear_registered_users';

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUserRecord = (userRecord) => {
  try {
    const users = getStoredUsers();
    const existingIdx = users.findIndex(u => u.email.toLowerCase() === userRecord.email.toLowerCase());
    if (existingIdx >= 0) {
      users[existingIdx] = userRecord;
    } else {
      users.push(userRecord);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('[GoalWear] Failed saving user to local store:', e);
  }
};

const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveProfile = (id, profile) => {
  try {
    const profiles = getStoredProfiles();
    profiles[id] = { ...profiles[id], ...profile, id };
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('[GoalWear] Failed saving profile:', e);
  }
};

const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[GoalWear] Failed to read mock orders from storage', e);
  }

  // Seed default demo orders (including GW-58492 mentioned in Track Order)
  const defaultOrders = [
    {
      id: 'GW-58492',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      customer_name: 'Tanvir Ahmed',
      phone: '01712345678',
      address: 'House 42, Road 7, Dhanmondi, Dhaka',
      bkash_number: '01712345678',
      bkash_txn_id: '9K28FX01',
      items: [
        {
          product: {
            id: 'arg-home-2024',
            name: 'Argentina 2024 Home Jersey',
            price: 3850,
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop'
          },
          size: 'L',
          quantity: 1
        }
      ],
      subtotal: 3850,
      delivery_charge: 150,
      total: 4000,
      status: 'bKash Verified'
    },
    {
      id: 'GW-10492',
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      customer_name: 'Rafiqul Islam',
      phone: '01898765432',
      address: 'Block C, Bashundhara R/A, Dhaka',
      bkash_number: '01898765432',
      bkash_txn_id: '8M19ZZ44',
      items: [
        {
          product: {
            id: 'rma-home-2024',
            name: 'Real Madrid 24/25 Home Jersey',
            price: 4200,
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'
          },
          size: 'M',
          quantity: 1
        }
      ],
      subtotal: 4200,
      delivery_charge: 150,
      total: 4350,
      status: 'Shipped'
    }
  ];

  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(defaultOrders));
  } catch {
    // Ignore storage errors
  }
  return defaultOrders;
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('[GoalWear] Failed to save orders to localStorage', e);
  }
};

const authListeners = new Set();

const triggerAuthChange = (event, session) => {
  authListeners.forEach((listener) => {
    try {
      listener(event, session);
    } catch (err) {
      console.error(err);
    }
  });
};

const mockSupabase = {
  auth: {
    async getSession() {
      try {
        const raw = localStorage.getItem(SESSION_STORAGE_KEY);
        const session = raw ? JSON.parse(raw) : null;
        return { data: { session }, error: null };
      } catch {
        return { data: { session: null }, error: null };
      }
    },
    onAuthStateChange(callback) {
      authListeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback);
            }
          }
        }
      };
    },
    async signInWithPassword({ email, password }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const users = getStoredUsers();
      const registered = users.find(u => u.email.toLowerCase() === cleanEmail);

      // Verify password if registered, or default demo credentials
      if (registered) {
        if (registered.password && registered.password !== password) {
          return { data: { session: null, user: null }, error: new Error('Invalid email or password') };
        }
        const session = {
          user: registered,
          access_token: 'mock_token_' + Date.now()
        };
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } catch {
          // ignore
        }
        triggerAuthChange('SIGNED_IN', session);
        return { data: { session, user: registered }, error: null };
      }

      // Default admin authentication or generic test credentials
      if (password === 'admin' || password === 'admin123' || password === 'goalwear' || password.length >= 4) {
        const isAdmin = cleanEmail.includes('admin') || cleanEmail === 'siyamisaba@gmail.com' || cleanEmail === 'ryantasinff@gmail.com';
        const user = {
          id: isAdmin ? (cleanEmail === 'siyamisaba@gmail.com' ? 'u_admin_siyamisaba' : 'admin_mock_123') : 'cust_' + Math.floor(Math.random() * 100000),
          email: email || (isAdmin ? 'siyamisaba@gmail.com' : 'customer@goalwear.com'),
          role: isAdmin ? 'admin' : 'customer',
          user_metadata: {
            full_name: cleanEmail === 'siyamisaba@gmail.com' ? 'Siyami Saba (Store Owner)' : (isAdmin ? 'Store Administrator' : 'Football Enthusiast')
          }
        };
        const session = {
          user,
          access_token: 'mock_token_' + Date.now()
        };
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } catch {
          // ignore
        }
        triggerAuthChange('SIGNED_IN', session);
        return { data: { session, user }, error: null };
      }
      return { data: { session: null, user: null }, error: new Error('Invalid email or password') };
    },
    async signUp({ email, password, options }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const users = getStoredUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { data: { session: null, user: null }, error: new Error('An account with this email already exists.') };
      }

      const userId = 'cust_' + Math.floor(10000 + Math.random() * 90000);
      const user = {
        id: userId,
        email: cleanEmail,
        password,
        role: 'customer',
        user_metadata: options?.data || {}
      };

      saveUserRecord(user);
      saveProfile(userId, {
        id: userId,
        full_name: options?.data?.full_name || cleanEmail.split('@')[0],
        phone: options?.data?.phone || '',
        role: 'customer'
      });

      const session = {
        user,
        access_token: 'mock_token_' + Date.now()
      };
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } catch {
        // ignore
      }
      triggerAuthChange('SIGNED_IN', session);
      return { data: { session, user }, error: null };
    },
    async signOut() {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // ignore
      }
      triggerAuthChange('SIGNED_OUT', null);
      return { error: null };
    }
  },
  async rpc(funcName, params) {
    if (funcName === 'place_order_atomic') {
      const orderNumber = `GW-${Math.floor(10000 + Math.random() * 90000)}`;
      const orders = getStoredOrders();
      const subtotal = (params.p_items || []).reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryCharge = 120;
      const newOrder = {
        id: orderNumber,
        order_number: orderNumber,
        customer_id: params.p_customer_id || null,
        customer_name: params.p_shipping_name,
        shipping_name: params.p_shipping_name,
        phone: params.p_shipping_phone,
        shipping_phone: params.p_shipping_phone,
        address: params.p_shipping_address,
        shipping_address: params.p_shipping_address,
        city: params.p_shipping_city,
        bkash_number: params.p_bkash_number,
        bkash_txn_id: params.p_bkash_txn_id,
        items: params.p_items || [],
        subtotal,
        delivery_charge: deliveryCharge,
        total: subtotal + deliveryCharge,
        status: 'Pending verification',
        payment_status: 'PENDING_VERIFICATION',
        created_at: new Date().toISOString()
      };
      saveOrders([newOrder, ...orders]);
      return { data: { order_number: orderNumber, subtotal, delivery_charge: deliveryCharge, total: subtotal + deliveryCharge }, error: null };
    }
    return { data: null, error: null };
  },
  from(table) {
    if (table === 'profiles') {
      return {
        select(_fields) {
          return {
            eq(field, val) {
              return {
                async single() {
                  const profiles = getStoredProfiles();
                  const found = field === 'id' ? profiles[val] : Object.values(profiles).find(p => p[field] === val);
                  return { data: found || null, error: null };
                }
              };
            }
          };
        },
        async insert(profileData) {
          saveProfile(profileData.id, profileData);
          return { data: [profileData], error: null };
        },
        update(updateValues) {
          return {
            eq(field, val) {
              return {
                select() {
                  return {
                    async single() {
                      const profiles = getStoredProfiles();
                      const existing = profiles[val] || {};
                      const updated = { ...existing, ...updateValues };
                      saveProfile(val, updated);
                      return { data: updated, error: null };
                    }
                  };
                }
              };
            }
          };
        }
      };
    }

    if (table === 'orders') {
      return {
        select(_fields) {
          const runFilter = (filteredOrders) => ({
            eq(field, val) {
              const matching = filteredOrders.filter(o => o[field] === val);
              return {
                ...runFilter(matching),
                async order(sortField, { ascending } = { ascending: false }) {
                  const sorted = [...matching].sort((a, b) => {
                    const da = new Date(a.created_at || a.date || 0).getTime();
                    const db = new Date(b.created_at || b.date || 0).getTime();
                    return ascending ? da - db : db - da;
                  });
                  return { data: sorted, error: null };
                }
              };
            },
            async order(field, { ascending } = { ascending: false }) {
              const sorted = [...filteredOrders].sort((a, b) => {
                const da = new Date(a.created_at || a.date || 0).getTime();
                const db = new Date(b.created_at || b.date || 0).getTime();
                return ascending ? da - db : db - da;
              });
              return { data: sorted, error: null };
            }
          });

          return runFilter(getStoredOrders());
        },
        async insert(newRow) {
          const orders = getStoredOrders();
          const rowWithTimestamp = {
            ...newRow,
            created_at: newRow.created_at || new Date().toISOString()
          };
          const updated = [rowWithTimestamp, ...orders];
          saveOrders(updated);
          return { data: [rowWithTimestamp], error: null };
        },
        update(updateValues) {
          return {
            async eq(field, value) {
              const orders = getStoredOrders();
              const updated = orders.map((order) => {
                if (order[field] === value) {
                  return { ...order, ...updateValues };
                }
                return order;
              });
              saveOrders(updated);
              return { data: updated, error: null };
            }
          };
        },
        delete() {
          return {
            async eq(field, value) {
              const orders = getStoredOrders();
              const updated = orders.filter((order) => order[field] !== value);
              saveOrders(updated);
              return { data: updated, error: null };
            }
          };
        }
      };
    }

    return {
      select() {
        return {
          order: async () => ({ data: [], error: null })
        };
      },
      insert: async () => ({ data: [], error: null }),
      update: () => ({ eq: async () => ({ data: [], error: null }) })
    };
  }
};

let client = mockSupabase;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[GoalWear] Could not initialize real Supabase client, using local store:', err);
    client = mockSupabase;
  }
}

export const supabase = client;
