# Preevol ERP CRM - Complete Technical Documentation

> MERN Stack ERP/CRM System Documentation (React + Node.js + MongoDB)

---

## 1. DATABASE CONNECTION ARCHITECTURE

### **Core Connection Setup**
**File:** `backend/src/server.js`

| Component | Details |
|-----------|---------|
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Connection String** | `MONGODB_URI` from environment variables |
| **Connection Object** | `mongoose.connect(uri, options)` |

### **Connection Flow**
```
Environment Variable (MONGODB_URI)
    ↓
backend/src/server.js
    ↓
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    ↓
Global mongoose connection instance
    ↓
All Models via mongoose.Schema/model
```

### **Connection Configuration**
```javascript
// backend/src/server.js
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
```

---

## 2. GLOBAL STATE VARIABLES (Redux Store)

### **Redux Store Architecture**
**File:** `frontend/src/apps/PreevolOs.jsx`

| Store Slice | Purpose | Key State |
|-------------|---------|-----------|
| `auth` | Authentication | `currentAdmin`, `isAuthenticated`, `token` |
| `crud` | CRUD Operations | `list`, `create`, `update`, `delete`, `read` |
| `erp` | ERP Data | `currentCompany`, `settings`, `financialYear` |
| `settings` | App Settings | `moneyFormat`, `dateFormat`, `appSettings` |
| `advancedCrud` | Advanced CRUD | `search`, `filter`, `pagination` |

### **State Structure**
```javascript
// Redux State Tree
{
  auth: {
    currentAdmin: { _id, name, surname, email, photo, role, ... },
    isAuthenticated: boolean,
    token: string,
    isLoading: boolean,
    error: string
  },
  crud: {
    list: { result: [], pagination: {...}, isLoading, isSuccess },
    create: { result, isLoading, isSuccess },
    update: { result, isLoading, isSuccess },
    delete: { result, isLoading, isSuccess },
    read: { result, isLoading, isSuccess }
  },
  erp: {
    currentCompany: { _id, name, gstin, ... },
    settings: {...},
    moneyFormatSettings: {...}
  },
  settings: {
    appSettings: {...},
    isLoading: boolean
  }
}
```

### **Key Global Variables from Local Storage**
**File:** `frontend/src/redux/storePersist.js`

| Variable | Storage Key | Purpose |
|----------|-------------|---------|
| `companyContext` | `'companyContext'` | Current selected company |
| `authToken` | `'authToken'` | JWT authentication token |
| `settings` | `'settings'` | App settings persistence |

---

## 3. BACKEND MODULES & CONTROLLERS

### **A. App Controllers Loader**
**File:** `backend/src/controllers/appControllers/index.js`

| Function | Purpose | Data Flow |
|----------|---------|-----------|
| `appControllers()` | Dynamically loads all controllers | Scans directories → Loads custom → Creates CRUD fallbacks |
| `createCRUDController(modelName)` | Generic CRUD factory | Model → Controller with create/read/update/delete/search/list/summary |

**Dynamic Loading Pattern:**
```
Scan: src/controllers/appControllers/*/
    ↓
Load custom controllers (e.g., invoiceController/)
    ↓
For remaining models in routesList:
    Create generic CRUD controller
    ↓
Export all controllers as object
```

### **B. CRUD Controller Factory**
**File:** `backend/src/controllers/middlewaresControllers/createCRUDController/`

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| `create` | POST | `/:entity/create` | Create new record |
| `read` | GET | `/:entity/read/:id` | Read single record |
| `update` | PATCH | `/:entity/update/:id` | Update record |
| `delete` | DELETE | `/:entity/delete/:id` | Soft delete record |
| `search` | GET | `/:entity/search` | Search records |
| `list` | GET | `/:entity/list` | Paginated list |
| `listAll` | GET | `/:entity/listAll` | All records |
| `filter` | GET | `/:entity/filter` | Filtered list |
| `summary` | GET | `/:entity/summary` | Dashboard stats |

### **C. Lookup Resolver**
**File:** `backend/src/controllers/helpers/lookupResolver.js`

| Function | Purpose | Data Flow |
|----------|---------|-----------|
| `resolveLookups()` | Resolves foreign key references | Entity + ID → Populated Document |
| `getName()` | Gets display name from entity | Entity + ID → Name String |

**Supported Lookup Entities:**
- `Client` / `Customer`
- `Company`
- `Product`
- `Category` / `SubCategory`
- `Vendor`
- `Bank`
- `Invoice`, `Quote`, `Payment`

---

## 4. FRONTEND MODULES

### **A. Page Structure**
**Location:** `frontend/src/pages/`

| Category | Pages | Pattern |
|----------|-------|---------|
| **Master Data** | `Company/`, `Customer/`, `Vendor/`, `Bank/`, `Product/`, `Category/`, `SubCategory/`, `MOC/`, `ModelMaster/`, `PlungerDia/`, `TypeMaster/`, `Goods/`, `GoodsInventory/`, `POProduct/`, `ProposalHistory/` | CRUDModule + DynamicForm |
| **Transactions** | `Invoice/`, `TransactionDocument/` (Quote, PO, WO, ServiceInvoice) | Custom forms with line items |
| **Settings** | `Settings/`, `FinancialSettings/`, `Taxes/`, `PaymentMode/` | Settings forms |
| **Auth** | `Login.jsx`, `Logout.jsx`, `ForgetPassword.jsx`, `ResetPassword.jsx` | Auth forms |

### **B. Redux Slices**
**Location:** `frontend/src/redux/`

| Slice | File | Purpose | Key Actions |
|-------|------|---------|-------------|
| `auth` | `auth/` | Authentication | `login`, `logout`, `resetPassword` |
| `crud` | `crud/` | Basic CRUD | `list`, `create`, `update`, `delete`, `read` |
| `erp` | `erp/` | ERP Data | `listCompany`, `updateCompany`, `setMoneyFormat` |
| `settings` | `settings/` | App Settings | `listSettings`, `updateSettings` |
| `advancedCrud` | `adavancedCrud/` | Advanced CRUD | `search`, `filter` |

### **C. Request Module**
**File:** `frontend/src/request/request.js`

| Function | Parameters | Purpose |
|----------|------------|---------|
| `request.create()` | `{ entity, jsonData }` | POST /api/:entity/create |
| `request.read()` | `{ entity, id }` | GET /api/:entity/read/:id |
| `request.update()` | `{ entity, id, jsonData }` | PATCH /api/:entity/update/:id |
| `request.delete()` | `{ entity, id }` | DELETE /api/:entity/delete/:id |
| `request.list()` | `{ entity, options }` | GET /api/:entity/list |
| `request.search()` | `{ entity, value }` | GET /api/:entity/search |
| `request.filter()` | `{ entity, filters }` | GET /api/:entity/filter |
| `request.summary()` | `{ entity }` | GET /api/:entity/summary |

### **D. Hooks**
**Location:** `frontend/src/hooks/`

| Hook | Purpose |
|------|---------|
| `useFetch` | Data fetching with loading/error states |
| `useCrud` | CRUD operations helper |
| `useOnFetch` | On-mount data fetching |
| `useDebounce` | Debounced values |
| `useMoney` | Money formatting |
| `useDate` | Date formatting |

---

## 5. DATA FLOW DIAGRAMS

### **A. Application Startup Flow**
```
Program Entry (main.jsx)
    ↓
RootApp.jsx
    ↓
Redux Store Initialization (store.js)
    ├── auth: Check localStorage for token
    ├── erp: Check localStorage for companyContext
    └── settings: Load persisted settings
    ↓
PreevolOs.jsx (Main App Component)
    ↓
AppRouter.jsx
    ├── Public Routes (Login, ForgotPassword)
    └── Private Routes (Dashboard, all pages)
    ↓
Login Check (auth.isAuthenticated)
    ↓
Dashboard Module (DashboardModule/index.jsx)
```

### **B. Authentication Flow**
```
User enters credentials (Login.jsx)
    ↓
dispatch(auth.login({ email, password }))
    ↓
authAction.js: login()
    ↓
POST /api/login { email, password }
    ↓
Backend: authController/login()
    ├── Verify password
    ├── Generate JWT token
    └── Return { admin, token }
    ↓
Redux: auth/currentAdmin = admin
Redux: auth/isAuthenticated = true
LocalStorage: authToken = token
    ↓
Navigate to Dashboard
```

### **C. CRUD List Flow**
```
Page Load (e.g., Customer/index.jsx)
    ↓
CrudModule with config
    ↓
useEffect: dispatch(crud.list({ entity: 'client' }))
    ↓
request.list({ entity: 'client' })
    ↓
GET /api/client/list?page=1&items=10
    ↓
Backend: clientController.list()
    ├── Apply company filter (multi-tenancy)
    ├── Apply pagination
    └── Return { result, pagination }
    ↓
Redux: crud.list.result = data
    ↓
DataTable displays records
```

### **D. Create Record Flow**
```
User clicks "Add New" (CrudModule)
    ↓
Open Create Modal with DynamicForm
    ↓
User fills form → Submit
    ↓
Form validation (yup schema)
    ↓
dispatch(crud.create({ entity: 'client', jsonData: formData }))
    ↓
POST /api/client/create
    ↓
Backend: clientController.create()
    ├── Validate data
    ├── Set company context
    └── Save to MongoDB
    ↓
Redux: Update list
    ↓
Close modal, show success message
    ↓
Refresh list
```

### **E. Lookup Binding Flow**
```
Form with lookup field (e.g., Client lookup)
    ↓
DynamicForm renders Select/Search component
    ↓
useEffect: Fetch lookup options
    ↓
request.listAll({ entity: 'client' })
    ↓
GET /api/client/listAll
    ↓
Options loaded: [{ value: _id, label: name }]
    ↓
User selects option
    ↓
Form value = ObjectId (value)
    ↓
On save: ID stored in database
```

### **F. Company Context Switch Flow**
```
User selects company from Header dropdown
    ↓
HeaderContainer.jsx: handleCompanyChange(companyId)
    ↓
POST /api/company-context { companyId }
    ↓
Backend: Update session context
LocalStorage: storePersist.set('companyContext', { currentCompany: companyId })
    ↓
window.location.reload()
    ↓
All data refetches with new company filter
```

---

## 6. API ROUTES & ENDPOINTS

### **Base URL Structure**
```
Base: http://localhost:8888/api

Core Routes: /api/admin/*, /api/setting/*, /api/company-context/*
App Routes: /api/:entity/* (dynamic)
Public: /api/public/*, /api/auth/*
```

### **Standard CRUD Endpoints**
For every entity (company, client, vendor, product, invoice, etc.):

| Method | Endpoint | Action |
|--------|----------|--------|
| POST | `/:entity/create` | Create record |
| GET | `/:entity/read/:id` | Read single |
| PATCH | `/:entity/update/:id` | Update record |
| DELETE | `/:entity/delete/:id` | Delete record |
| GET | `/:entity/list` | List (paginated) |
| GET | `/:entity/listAll` | List all |
| GET | `/:entity/search?q=term` | Search |
| GET | `/:entity/filter` | Filter |
| GET | `/:entity/summary` | Summary stats |

### **Auth Endpoints**
**File:** `backend/src/routes/auth.js`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/login` | Admin login |
| POST | `/api/logout` | Logout |
| POST | `/api/forgetpassword` | Request reset |
| POST | `/api/resetpassword` | Reset password |

### **Core Endpoints**
**File:** `backend/src/routes/coreRoutes/`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET/POST | `/api/admin/*` | Admin management |
| GET/POST | `/api/setting/*` | Settings management |
| POST | `/api/company-context` | Update current company |
| GET | `/api/company-context` | Get current company |

---

## 7. DATABASE MODELS & RELATIONSHIPS

### **Core Models**

#### **Admin** (User Management)
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  surname: String,
  role: String,
  photo: String,
  enabled: Boolean,
  created: Date,
  updated: Date
}
```

#### **Company** (Multi-tenancy Root)
```javascript
{
  _id: ObjectId,
  name: String (unique),
  address: String,
  state: String,
  stateCode: String,
  gstin: String,
  panNo: String,
  financialYear: String,
  email1, email2: String,
  phone1, phone2: String,
  website: String,
  prefix: {              // Invoice numbering prefixes
    invoice: String,
    serviceInvoice: String,
    quotation: String,
    purchaseOrder: String,
    workOrder: String
  },
  counters: {            // Auto-increment counters
    invoice: Number,
    serviceInvoice: Number,
    ...
  },
  created: Date,
  updated: Date
}
```

#### **Client** (Customers)
```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  name: String,
  contactPerson: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  stateCode: String,
  email: String,
  gstStatus: String,
  gstin: String,
  panNo: String,
  pin: String,
  createdBy: ObjectId (ref: Admin),
  created: Date,
  updated: Date
}
```

#### **Vendor** (Suppliers)
```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  name: String,
  contactPerson: String,
  contactNo1, contactNo2: String,
  address: String,
  city: String,
  state: String,
  stateCode: String,
  email: String,
  website: String,
  gstStatus: String,
  gstin: String,
  panNo: String,
  vatNo, cstNo, eccNo, iecCode: String,
  createdBy: ObjectId (ref: Admin),
  created: Date,
  updated: Date
}
```

#### **Product**
```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  name: String,
  description: String,
  category: ObjectId (ref: Category),
  subCategory: ObjectId (ref: SubCategory),
  hsnSac: String,
  price: Number,
  unit: String,
  created: Date,
  updated: Date
}
```

#### **Invoice** (Transaction Document)
```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  client: ObjectId (ref: Client),
  number: Number,
  year: Number,
  date: Date,
  expiredDate: Date,
  items: [{
    product: ObjectId (ref: Product),
    itemName: String,
    description: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subTotal: Number,
  taxRate: Number,
  taxTotal: Number,
  discount: Number,
  total: Number,
  currency: String,
  paymentStatus: String (enum: ['unpaid', 'paid', 'partially']),
  status: String (enum: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold']),
  payment: [ObjectId (ref: Payment)],
  notes: String,
  createdBy: ObjectId (ref: Admin),
  created: Date,
  updated: Date
}
```

### **Model Relationships**

```
Company (1)
    ├── has many (n) → Client
    ├── has many (n) → Vendor
    ├── has many (n) → Product
    ├── has many (n) → Category
    ├── has many (n) → SubCategory
    ├── has many (n) → Invoice
    ├── has many (n) → Quote
    ├── has many (n) → PurchaseOrder
    ├── has many (n) → WorkOrder
    ├── has many (n) → ServiceInvoice
    ├── has many (n) → ProformaInvoice
    ├── has many (n) → Payment
    ├── has many (n) → Bank
    └── has many (n) → FinancialSettings

Client (1)
    └── has many (n) → Invoice
    └── has many (n) → Quote

Invoice (1)
    ├── has many (n) → items[] (embedded)
    ├── has many (n) → Payment[] (ref)
    └── belongs to (1) → Client
    └── belongs to (1) → Company

Payment (1)
    └── belongs to (n) → Invoice
```

---

## 8. FUNCTION CALL DEPENDENCY MAP

### **Backend Dependency Map**

```
server.js (Entry Point)
    ├── mongoose.connect() → MongoDB
    ├── app.use('/api', routes)
    │
    ├── coreRoutes/ (Auth, Settings, Company Context)
    │   ├── authRoutes.js
    │   ├── coreApi.js (Company Context)
    │   └── settingsRoutes.js
    │
    └── appRoutes/
        └── appApi.js
            ├── appControllers/index.js
            │   ├── Custom Controllers (invoiceController/, etc.)
            │   └── createCRUDController() (Generic)
            │
            └── Routes Auto-Generated from routesList
                ├── /api/company/*
                ├── /api/client/*
                ├── /api/vendor/*
                ├── /api/product/*
                ├── /api/invoice/*
                ├── /api/quote/*
                ├── /api/payment/*
                └── ... (all models)
```

### **Frontend Dependency Map**

```
main.jsx (Entry)
    ↓
RootApp.jsx
    ├── Redux Provider (store.js)
    │   ├── auth slice
    │   ├── crud slice
    │   ├── erp slice
    │   └── settings slice
    │
    └── Router (AppRouter.jsx)
        ├── Public Routes
        │   ├── /login → Login.jsx
        │   ├── /forgetpassword → ForgetPassword.jsx
        │   └── /resetpassword → ResetPassword.jsx
        │
        └── Private Routes (PreevolOs.jsx)
            ├── Layout (ErpApp.jsx)
            │   ├── Header (HeaderContainer.jsx)
            │   ├── Navigation (NavigationContainer.jsx)
            │   └── Content
            │
            ├── /dashboard → DashboardModule/index.jsx
            ├── /customer → Customer/index.jsx
            ├── /vendor → Vendor/index.jsx
            ├── /company → Company/index.jsx
            ├── /product → Product/index.jsx
            ├── /invoice → Invoice/index.jsx
            ├── /invoice/create → InvoiceCreate.jsx
            └── ... (all pages)

Page Structure (e.g., Customer/index.jsx)
    ↓
CrudModule (core/)
    ├── DataTable (components/)
    │   └── request.list() → API
    │
    ├── Create Modal
    │   └── DynamicForm
    │       └── request.create() → API
    │
    └── Update/Delete
        └── request.update/delete() → API
```

### **Request Module Flow**

```
Page Component
    ↓
request.js function
    ↓
axios instance
    ├── Base URL: http://localhost:8888/api
    ├── Headers: Authorization: Bearer {token}
    └── Request interceptor (adds token)
    ↓
Backend API
    ↓
Response
    ↓
Redux Action (updates state)
    ↓
Component Re-renders with new data
```

### **Redux Data Flow**

```
Component dispatches action
    ↓
Action Creator (authActions.js, crudActions.js, etc.)
    ↓
API Call (request.js)
    ↓
Backend Response
    ↓
Dispatch with payload
    ↓
Reducer updates state
    ↓
Selector reads new state
    ↓
Component receives new props
```

---

## 9. KEY DIRECTORIES & FILES

### **Backend Structure**
```
backend/
├── src/
│   ├── server.js              # Entry point, DB connection
│   ├── app.js                 # Express app setup
│   ├── routes/
│   │   ├── coreRoutes/        # Auth, settings, company context
│   │   └── appRoutes/
│   │       └── appApi.js      # Auto-generated entity routes
│   ├── controllers/
│   │   ├── appControllers/
│   │   │   ├── index.js       # Dynamic controller loader
│   │   │   └── */             # Entity controllers (invoice/, etc.)
│   │   └── middlewaresControllers/
│   │       └── createCRUDController/  # Generic CRUD factory
│   ├── models/
│   │   ├── coreModels/        # Admin, Setting
│   │   ├── appModels/         # All business entities
│   │   └── utils/             # routesList generator
│   └── middlewares/
│       └── middleware.js      # Auth, company context
```

### **Frontend Structure**
```
frontend/
├── src/
│   ├── main.jsx               # Entry point
│   ├── RootApp.jsx            # Root component
│   ├── apps/
│   │   ├── PreevolOs.jsx       # Main app wrapper
│   │   ├── ErpApp.jsx         # ERP layout
│   │   ├── Header/
│   │   │   └── HeaderContainer.jsx  # Company selector, user menu
│   │   └── Navigation/
│   │       └── NavigationContainer.jsx  # Sidebar menu
│   ├── router/
│   │   ├── AppRouter.jsx      # Route definitions
│   │   └── routes.jsx         # Route config
│   ├── redux/
│   │   ├── store.js           # Redux store setup
│   │   ├── rootReducer.js     # Combined reducers
│   │   ├── auth/              # Auth slice
│   │   ├── crud/              # CRUD slice
│   │   ├── erp/               # ERP slice
│   │   └── storePersist.js    # LocalStorage persistence
│   ├── request/
│   │   └── request.js         # API request functions
│   ├── pages/
│   │   ├── DashboardModule/   # Dashboard
│   │   ├── Customer/          # Customer CRUD
│   │   ├── Vendor/            # Vendor CRUD
│   │   ├── Invoice/           # Invoice management
│   │   └── ...                # Other pages
│   ├── modules/
│   │   └── CrudModule/        # Generic CRUD component
│   ├── components/
│   │   └── DataTable/         # Table component
│   └── forms/
│       └── DynamicForm/       # Form generator
```

---

## 10. MULTI-TENANCY ARCHITECTURE

### **Company Context System**

Every request is scoped to the current company:

```
User Login
    ↓
Get user's default company (currentCompany)
    ↓
Store in: Redux (erp.currentCompany) + LocalStorage
    ↓
Each API request includes company filter:
    - Header: X-Company-ID (or session)
    - Query: ?company=xxx
    ↓
Backend applies filter:
    find({ company: ObjectId(currentCompany) })
    ↓
User only sees their company's data
```

### **Company Switching**

```
HeaderContainer.jsx
    ├── Select component with all companies
    ├── onChange: handleCompanyChange(companyId)
    ├── POST /api/company-context { companyId }
    └── Reload page → New data loaded
```

---

*Documentation generated for Preevol ERP CRM - MERN Stack Version*
*Last Updated: April 2026*
