# Architecture Overview

## System Design

HMK-React follows a modern React architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│          User Interface (React)         │
├─────────────────────────────────────────┤
│  Dashboard  │ Products │ Orders │ etc  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         Application State (Zustand)     │
├─────────────────────────────────────────┤
│  Auth Store  │  Store Store  │ UI Store│
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│           Data Layer (JSON)             │
├─────────────────────────────────────────┤
│ Products │ Orders │ Stores │ Users      │
└─────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # App shell (Header, Sidebar, Layout)
│   │   ├── Header.tsx  # Top bar with store selector, theme toggle
│   │   ├── Sidebar.tsx # Navigation menu
│   │   └── Layout.tsx  # Main layout wrapper
│   └── ui/             # Base components
│       ├── Button.tsx  # Customizable button
│       ├── Card.tsx    # Card container components
│       └── ToastContainer.tsx # Notification system
│
├── pages/              # Route components
│   ├── Dashboard.tsx   # Home page with stats
│   ├── ProductCatalog.tsx  # Product grid/list
│   ├── ProductDetail.tsx   # Single product view
│   ├── OrderList.tsx       # Order management
│   ├── OrderDetail.tsx     # Single order view
│   ├── CreateOrder.tsx     # Order creation form
│   ├── Inventory.tsx       # Multi-store inventory
│   ├── Profile.tsx         # User profile
│   └── Login.tsx          # Authentication
│
├── data/               # Mock data (JSON)
│   ├── products.json   # Product catalog (25 items)
│   ├── orders.json     # Order records (20 items)
│   ├── stores.json     # Store locations (5 items)
│   └── users.json      # User accounts (6 items)
│
├── store/              # Zustand state management
│   ├── authStore.ts    # User authentication
│   ├── storeStore.ts   # Current store selection
│   └── uiStore.ts      # UI state (theme, modals, toasts)
│
├── types/              # TypeScript definitions
│   └── index.ts        # All type interfaces
│
├── utils/              # Utility functions
│   └── cn.ts           # Class name utility
│
├── App.tsx             # Main app component
└── main.tsx            # React entry point
```

## State Management

### Zustand Stores

#### Auth Store (`authStore.ts`)
```typescript
{
  user: User | null,           // Current logged-in user
  isAuthenticated: boolean,    // Auth status
  login: (username, password) => Promise<boolean>,
  logout: () => void
}
```

#### Store Store (`storeStore.ts`)
```typescript
{
  currentStore: Store | null,  // Active store location
  stores: Store[],             // All available stores
  setCurrentStore: (storeNumber: string) => void,
  initializeStores: () => void
}
```

#### UI Store (`uiStore.ts`)
```typescript
{
  theme: 'light' | 'dark',     // Current theme
  sidebarOpen: boolean,        // Sidebar state
  activeModal: string | null,  // Current modal ID
  toasts: Toast[],             // Active notifications
  toggleTheme: () => void,
  toggleSidebar: () => void,
  openModal: (id: string) => void,
  closeModal: () => void,
  addToast: (toast: Omit<Toast, 'id'>) => void,
  removeToast: (id: string) => void
}
```

## Data Flow

### 1. Product Browsing
```
User → Product Catalog Page
  ↓
useMemo filters products.json
  ↓
Renders ProductCard components
  ↓
Click → Navigate to Product Detail
  ↓
Load product by ID
  ↓
Display sizes, inventory, related products
```

### 2. Order Creation
```
User → Create Order Page
  ↓
Fill form (customer, item, size, stores)
  ↓
Submit → Validate
  ↓
Create order object
  ↓
Add to orders.json (simulated)
  ↓
Show success toast
  ↓
Navigate to Order List
```

### 3. Authentication
```
User → Login Page
  ↓
Enter credentials
  ↓
authStore.login(username, password)
  ↓
Lookup in users.json
  ↓
If valid: Set user, isAuthenticated = true
  ↓
Redirect to Dashboard
```

## Routing

### Public Routes
- `/login` - Authentication page

### Protected Routes (require login)
- `/` - Dashboard
- `/products` - Product catalog
- `/products/:id` - Product detail
- `/orders` - Order list
- `/orders/new` - Create order
- `/orders/:id` - Order detail
- `/inventory` - Inventory management
- `/profile` - User profile

All routes use React Router 6 with `<Navigate>` for auth checks.

## Component Patterns

### Reusable Components
```typescript
// Button with variants
<Button variant="primary">Click Me</Button>
<Button variant="outline" size="sm">Small</Button>

// Card layout
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Body</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Page Structure
```typescript
function PageName() {
  // 1. State hooks
  const [filter, setFilter] = useState('');
  
  // 2. Store hooks
  const { user } = useAuthStore();
  
  // 3. Computed values
  const filtered = useMemo(() => {
    // filtering logic
  }, [dependencies]);
  
  // 4. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 5. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Styling Strategy

### Tailwind CSS Utility-First

```typescript
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Dark mode
<div className="bg-white dark:bg-gray-800">

// Interactive states
<button className="hover:bg-blue-700 active:scale-95">
```

### Custom Utilities

```typescript
// cn() utility for conditional classes
import { cn } from '@/utils/cn';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>
```

## TypeScript Types

### Core Interfaces

```typescript
// Product
interface Product {
  itemNumber: string;      // Primary key
  title: string;
  price: number;
  sizes: ProductSize[];
  inventory: StoreInventory[];
}

// Order
interface Order {
  orderNumber: string;     // Primary key
  customerName: string;
  itemNumber: string;      // Foreign key to Product
  orderStatus: OrderStatus; // Enum (1, 2, 3)
  storeFromId: string;     // Foreign key to Store
  storeToId: string;       // Foreign key to Store
}

// Store
interface Store {
  storeNumber: string;     // Primary key
  name: string;
  address: string;
}

// User
interface User {
  id: string;              // Primary key
  username: string;
  role: 'admin' | 'manager' | 'employee';
  storeNumber: string;     // Foreign key to Store
}
```

## Performance Optimizations

### 1. Memoization
```typescript
// useMemo for expensive computations
const filtered = useMemo(() => {
  return items.filter(/* logic */);
}, [items, filters]);

// useCallback for stable functions
const handleClick = useCallback(() => {
  /* logic */
}, [dependencies]);
```

### 2. Code Splitting (Ready)
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 3. Image Optimization
- Using Unsplash CDN
- Responsive images with srcset (ready to implement)
- Lazy loading with `loading="lazy"`

### 4. Bundle Size
- Tree-shaking with Vite
- Dynamic imports for routes
- Minimal dependencies

## Error Handling

### 1. Loading States
```typescript
{isLoading && <Spinner />}
{error && <ErrorMessage />}
{data && <Content />}
```

### 2. Toast Notifications
```typescript
const { addToast } = useUIStore();

addToast({
  type: 'success',
  message: 'Order created!',
  duration: 3000
});
```

### 3. 404 Handling
```typescript
// Catch-all route
<Route path="*" element={<Navigate to="/" />} />
```

## Testing Strategy (Ready to Implement)

### Unit Tests
```typescript
// Test components
describe('Button', () => {
  it('renders with correct variant', () => {
    // test logic
  });
});
```

### Integration Tests
```typescript
// Test user flows
describe('Order Creation', () => {
  it('creates order successfully', () => {
    // test logic
  });
});
```

### E2E Tests (Cypress/Playwright)
```typescript
// Test complete workflows
describe('Login to Order Creation', () => {
  // test logic
});
```

## Deployment Architecture

### Vercel (Recommended)
```
User → Vercel Edge Network
  ↓
CloudFront CDN
  ↓
React SPA (static files)
  ↓
Client-side routing
  ↓
Mock data (JSON)
```

### Future: With Real API
```
User → Vercel/CloudFront
  ↓
React SPA
  ↓
API Gateway (AWS/Vercel Functions)
  ↓
Backend (Node.js, Python, etc.)
  ↓
Database (PostgreSQL, MongoDB)
```

## Security Considerations

### Current (Demo)
- Client-side only
- Mock authentication
- No sensitive data

### Production Ready
- [ ] JWT authentication
- [ ] HTTPS only
- [ ] Environment variables
- [ ] API key protection
- [ ] Input validation
- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] Rate limiting

## Extensibility

### Adding New Pages
1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Add navigation link to `Sidebar.tsx`
4. Update TypeScript types if needed

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create mock data in `src/data/`
3. Create components in `src/components/`
4. Add store if needed in `src/store/`
5. Wire up in pages

### API Integration
1. Create services in `src/services/`
2. Replace JSON imports with API calls
3. Add loading/error states
4. Handle authentication tokens
5. Add retry logic

## Best Practices

### 1. Component Design
- Single responsibility
- Props over state when possible
- Composition over inheritance
- Descriptive prop names

### 2. State Management
- Local state first (useState)
- Lift state only when needed
- Global state for truly global data
- Derived state with useMemo

### 3. TypeScript
- Strict mode enabled
- No `any` types
- Interface over type (for objects)
- Explicit return types for functions

### 4. Styling
- Utility classes first
- Extract repeated patterns
- Use design tokens (colors, spacing)
- Mobile-first responsive

### 5. Performance
- Memoize expensive computations
- Lazy load routes/components
- Optimize images
- Monitor bundle size

---

This architecture is designed for:
- **Maintainability** - Clear structure, easy to navigate
- **Scalability** - Ready to add features and API
- **Performance** - Optimized rendering and loading
- **Developer Experience** - TypeScript, hot reload, clear patterns
