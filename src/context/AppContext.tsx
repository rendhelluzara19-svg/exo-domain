import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, AppEvent, PaymentRequest, CartItem, ChatMessage, LedgerEntry, Notification, Report, AppConfig, Role, PlanType, UserStatus, PaymentRequestStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
  users: User[];
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  events: AppEvent[];
  paymentRequests: PaymentRequest[];
  cart: CartItem[];
  messages: ChatMessage[];
  ledgers: LedgerEntry[];
  reports: Report[];
  notifications: Notification[];
  appConfig: AppConfig;
}

interface AppContextType extends AppState {
  setCurrentUser: (user: User | null) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  registerUser: (user: Omit<User, 'id' | 'balance' | 'status' | 'plan'>) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  createOrder: (buyerId: string, sellerId: string, items: { productId: string, quantity: number, price: number }[], totalAmount: number) => string;
  updateOrder: (orderId: string, data: Partial<Order>) => void;
  
  createPaymentRequest: (userId: string, amount: number, receiptUrl: string, type: 'TOPUP' | 'SUBSCRIPTION' | 'EXO_PASS', planTarget?: PlanType) => void;
  updatePaymentRequest: (requestId: string, status: PaymentRequestStatus) => void;
  
  addEvent: (event: Omit<AppEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, data: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  updateAppConfig: (data: Partial<AppConfig>) => void;
  
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  addLedgerEntry: (entry: Omit<LedgerEntry, 'id' | 'date'>) => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  isLiteMode: boolean;
  performanceMode: 'LITE' | 'FULL';
  setPerformanceMode: (mode: 'LITE' | 'FULL') => void;
  deviceType: 'mobile' | 'desktop';
}

const buildStaff = (prefix: string, count: number, role: Role): User[] => {
  const users: User[] = [];
  for (let i = 1; i <= count; i++) {
    const rolePrefix = role.split('_')[0].charAt(0) + role.split('_')[0].slice(1).toLowerCase();
    users.push({
      id: `${prefix}${i}`,
      email: `${prefix}${i}@exodomain.ph`,
      password: `${rolePrefix}Staff${i}@123`,
      role,
      name: `${rolePrefix} Staff ${i}`,
      balance: 0,
      status: 'APPROVED',
      plan: 'NONE',
      isBetaAuthorized: true
    });
  }
  return users;
};

const defaultUsers: User[] = [
  { id: 'admin', email: 'rendheladmin@feeders.ph', password: 'pogiako19@123', role: 'ADMIN', name: 'Master Admin', balance: 0, status: 'APPROVED', plan: 'NONE', isBetaAuthorized: true },
  ...buildStaff('verify', 10, 'VERIFICATION_STAFF'),
  ...buildStaff('finance', 3, 'FINANCE_STAFF'),
  ...buildStaff('support', 3, 'SUPPORT_STAFF'),
  { id: 'organizer1', email: 'organizer1@exodomain.ph', password: 'EventStaff1@123', role: 'EVENT_ORGANIZER', name: 'Event Organizer 1', balance: 0, status: 'APPROVED', plan: 'NONE', isBetaAuthorized: true },
  { id: 'organizer2', email: 'organizer2@exodomain.ph', password: 'EventStaff2@123', role: 'EVENT_ORGANIZER', name: 'Event Organizer 2', balance: 0, status: 'APPROVED', plan: 'NONE', isBetaAuthorized: true },
  { id: 'buyer1', email: 'buyer1@exodomain.ph', password: 'BuyerStaff1@123', role: 'BUYER', name: 'Test Buyer 1', balance: 0, status: 'APPROVED', plan: 'NONE', spentAmount: 0, isBetaAuthorized: true },
  { id: 'buyer2', email: 'buyer2@exodomain.ph', password: 'BuyerStaff2@123', role: 'BUYER', name: 'Test Buyer 2', balance: 0, status: 'APPROVED', plan: 'NONE', spentAmount: 0, isBetaAuthorized: true },
  { id: 'buyer3', email: 'buyer3@exodomain.ph', password: 'BuyerStaff3@123', role: 'BUYER', name: 'Test Buyer 3', balance: 0, status: 'APPROVED', plan: 'NONE', spentAmount: 0, isBetaAuthorized: true },
  { id: 'seller1', email: 'seller1@exodomain.ph', password: 'SellerStaff1@123', role: 'SELLER', name: 'Test Seller Starter', balance: 0, status: 'APPROVED', plan: 'STARTER', isBetaAuthorized: true },
  { id: 'seller2', email: 'seller2@exodomain.ph', password: 'SellerStaff2@123', role: 'SELLER', name: 'Test Seller Pro', balance: 0, status: 'APPROVED', plan: 'PRO', isBetaAuthorized: true },
  { id: 'seller3', email: 'seller3@exodomain.ph', password: 'SellerStaff3@123', role: 'SELLER', name: 'Test Seller Elite', balance: 0, status: 'APPROVED', plan: 'ELITE', isBetaAuthorized: true },
];

const defaultEvents: AppEvent[] = [
  {
    id: 'cyberpunk-banner',
    title: 'BOOST YOUR SHOP, DOMINATE THE HABITAT! 🚀🕷️🦎',
    description: "Get Featured on Exo Domain's Homepage Carousel and Be the Top Seller This Week!",
    location: 'Global',
    mediaUrls: ['https://images.unsplash.com/photo-1596727299052-1672322c3664?q=80&w=1200&auto=format&fit=crop'],
    isDefaultBanner: true,
    createdAt: new Date().toISOString()
  }
];

const defaultAppConfig: AppConfig = {
  gcashNumber: '09957822037',
  gcashName: 'R*****l L.',
  gotymeNumber: '019706278863',
  gotymeName: 'R*****l L.',
  dtiVerified: false
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const loadState = <T,>(key: string, defaultVal: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  const [users, setUsers] = useState<User[]>(() => {
    let parsedUsers: User[] = [];
    let modified = false;

    try {
      const saved = localStorage.getItem('fdx_users');
      if (saved) {
        parsedUsers = JSON.parse(saved) as User[];
      } else {
        parsedUsers = [...defaultUsers];
        modified = true;
      }
    } catch (e) {
      console.warn("[Database] Failed to parse fdx_users, forcing clean re-initialization of staff accounts", e);
      parsedUsers = [...defaultUsers];
      modified = true;
    }

    // Secondary deep try-catch protection to guarantee staff verify1-10 accounts are fully synchronized/re-initialized
    try {
      // Force/Hard Seed sync for all default users (especially staff accounts verify1-verify10)
      defaultUsers.forEach(du => {
        const idx = parsedUsers.findIndex(u => u.email.toLowerCase() === du.email.toLowerCase());
        if (idx === -1) {
          console.log(`[Database Sync] Seeding missing account: ${du.email} (${du.role})`);
          parsedUsers.push(du);
          modified = true;
        } else {
          // Enforce exact credentials matching for hard seed accounts to ensure staff can always log in
          if (parsedUsers[idx].password !== du.password || parsedUsers[idx].role !== du.role || parsedUsers[idx].status !== du.status) {
            console.log(`[Database Sync] Resetting credentials for seeded account: ${du.email}`);
            parsedUsers[idx] = { 
              ...parsedUsers[idx], 
              password: du.password, 
              role: du.role, 
              status: du.status 
            };
            modified = true;
          }
        }
      });
    } catch (e) {
      console.warn("[Database Sync] Deep sync failed, hard-resetting to default seed.", e);
      parsedUsers = [...defaultUsers];
      modified = true;
    }

    if (modified) {
      try {
        localStorage.setItem('fdx_users', JSON.stringify(parsedUsers));
      } catch (err) {
        console.error("Storage write failed", err);
      }
    }

    // Print out available staff accounts with credentials in the console for development reference
    console.log("[Database Sync] Verified staff accounts initialized:");
    parsedUsers.filter(u => u.role === 'VERIFICATION_STAFF').forEach(u => {
      console.log(`  Staff - Email: ${u.email} | Password: ${u.password}`);
    });

    return parsedUsers;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadState('fdx_currentUser', null));
  const [products, setProducts] = useState<Product[]>(() => loadState('fdx_products', []));
  const [orders, setOrders] = useState<Order[]>(() => loadState('fdx_orders', []));
  const [events, setEvents] = useState<AppEvent[]>(() => loadState('fdx_events', defaultEvents));
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => loadState('fdx_payments', []));
  const [cart, setCart] = useState<CartItem[]>(() => loadState('fdx_cart', []));
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadState('fdx_messages', []));
  const [ledgers, setLedgers] = useState<LedgerEntry[]>(() => loadState('fdx_ledgers', []));
  const [reports, setReports] = useState<Report[]>(() => loadState('fdx_reports', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('fdx_notifications', []));
  const [appConfig, setAppConfig] = useState<AppConfig>(() => loadState('fdx_appconfig', defaultAppConfig));

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('fdx_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('fdx_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('fdx_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('fdx_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('fdx_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('fdx_payments', JSON.stringify(paymentRequests)); }, [paymentRequests]);
  useEffect(() => { localStorage.setItem('fdx_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('fdx_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('fdx_ledgers', JSON.stringify(ledgers)); }, [ledgers]);
  useEffect(() => { localStorage.setItem('fdx_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('fdx_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('fdx_appconfig', JSON.stringify(appConfig)); }, [appConfig]);

  // Keep currentUser synced with users array
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentUser)) {
        setCurrentUser(updated);
      }
    }
  }, [users, currentUser]);

  const updateUser = (userId: string, data: Partial<User>) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
  
  const registerUser = (data: Omit<User, 'id' | 'balance' | 'status' | 'plan'>) => {
    const newUser: User = {
      ...data,
      id: uuidv4(),
      balance: 0,
      status: 'PENDING',
      plan: 'NONE',
      spentAmount: 0
    };
    setUsers(prev => [...prev, newUser]);
  };

  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>) => setProducts(prev => [...prev, { ...data, id: uuidv4(), createdAt: new Date().toISOString() }]);
  const updateProduct = (id: string, data: Partial<Product>) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  
  const addToCart = (productId: string, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      return [...prev, { productId, quantity }];
    });
  };
  const removeFromCart = (productId: string) => setCart(prev => prev.filter(i => i.productId !== productId));
  const clearCart = () => setCart([]);

  const createOrder = (buyerId: string, sellerId: string, items: { productId: string, quantity: number, price: number }[], totalAmount: number) => {
    const orderId = uuidv4();
    const newOrder: Order = {
      id: orderId,
      buyerId,
      sellerId,
      items,
      totalAmount,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
    items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) updateProduct(prod.id, { stock: prod.stock - item.quantity });
    });
    return orderId;
  };
  const updateOrder = (orderId: string, data: Partial<Order>) => setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data, updatedAt: new Date().toISOString() } : o));

  const createPaymentRequest = (
    userId: string, 
    amount: number, 
    receiptUrl: string, 
    type: 'TOPUP' | 'SUBSCRIPTION' | 'EXO_PASS', 
    planTarget?: PlanType,
    transactionNumber?: string,
    accountNumber?: string
  ) => {
    setPaymentRequests(prev => [...prev, {
      id: uuidv4(),
      userId,
      amount,
      receiptUrl,
      transactionNumber,
      accountNumber,
      type,
      planTarget,
      status: 'PENDING_VERIFIER',
      createdAt: new Date().toISOString()
    }]);
  };
  
  const updatePaymentRequest = (requestId: string, status: PaymentRequestStatus) => {
    setPaymentRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
  };

  const addEvent = (data: Omit<AppEvent, 'id' | 'createdAt'>) => setEvents(prev => [...prev, { ...data, id: uuidv4(), createdAt: new Date().toISOString() }]);
  const updateEvent = (id: string, data: Partial<AppEvent>) => setEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  const deleteEvent = (id: string) => setEvents(prev => prev.filter(e => e.id !== id));
  const updateAppConfig = (data: Partial<AppConfig>) => setAppConfig(prev => ({ ...prev, ...data }));
  
  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => setMessages(prev => [...prev, { ...msg, id: uuidv4(), timestamp: new Date().toISOString() }]);
  const addLedgerEntry = (entry: Omit<LedgerEntry, 'id' | 'date'>) => setLedgers(prev => [...prev, { ...entry, id: uuidv4(), date: new Date().toISOString() }]);
  const addReport = (report: Omit<Report, 'id' | 'createdAt'>) => setReports(prev => [...prev, { ...report, id: uuidv4(), createdAt: new Date().toISOString() }]);
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => setNotifications(prev => [...prev, { ...notification, id: uuidv4(), read: false, createdAt: new Date().toISOString() }]);
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  // Performance / Lite Mode Managers
  const [performanceMode, setPerformanceModeState] = useState<'LITE' | 'FULL'>(() => {
    const saved = localStorage.getItem('fdx_performanceMode');
    if (saved === 'LITE' || saved === 'FULL') return saved;
    return 'FULL';
  });

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const deviceType = windowWidth < 768 ? 'mobile' : 'desktop';

  useEffect(() => {
    if (currentUser) {
      const isStaff = ['ADMIN', 'VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);
      if (!isStaff) {
        if (deviceType === 'mobile') {
          const saved = localStorage.getItem('fdx_performanceMode');
          if (!saved) {
            setPerformanceModeState('LITE');
          }
        }
      }
    }
  }, [currentUser, deviceType]);

  const setPerformanceMode = (mode: 'LITE' | 'FULL') => {
    setPerformanceModeState(mode);
    localStorage.setItem('fdx_performanceMode', mode);
  };

  const isLiteMode = React.useMemo(() => {
    if (!currentUser) return false;
    
    const isStaff = ['ADMIN', 'VERIFICATION_STAFF', 'FINANCE_STAFF', 'SUPPORT_STAFF', 'EVENT_ORGANIZER'].includes(currentUser.role);
    
    if (isStaff) {
      if (deviceType === 'desktop') {
        return false; // Hard-coded bypass on PC
      }
      return false; // Staff is always Full Mode
    }
    
    return performanceMode === 'LITE';
  }, [currentUser, deviceType, performanceMode]);

  return (
    <AppContext.Provider value={{
      users, currentUser, products, orders, events, paymentRequests, cart, messages, ledgers, reports, notifications, appConfig,
      setCurrentUser, updateUser, registerUser,
      addProduct, updateProduct,
      addToCart, removeFromCart, clearCart,
      createOrder, updateOrder,
      createPaymentRequest, updatePaymentRequest,
      addEvent, updateEvent, deleteEvent, updateAppConfig,
      addMessage, addLedgerEntry, addReport, addNotification, markNotificationRead,
      isLiteMode, performanceMode, setPerformanceMode, deviceType
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
