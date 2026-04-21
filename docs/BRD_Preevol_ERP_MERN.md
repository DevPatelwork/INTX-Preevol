# Business Requirements Document (BRD)
## Project: Preevol Technics ERP (MERN Stack)

## 1. Document Control
- **Document Type**: Business Requirements Document
- **Product**: Preevol Technics ERP
- **Platform**: Electron Desktop + React Frontend + Express Backend + MongoDB
- **Prepared Date**: April 2026
- **Version**: 1.0

## 2. Executive Summary
Preevol Technics ERP is a desktop ERP application built on the MERN stack (MongoDB, Express, React, Node.js) wrapped in Electron. The system manages master data, sales/service billing, proforma billing, quotation management, purchase/work order processing, inventory tracking, reporting, proposal generation, and statutory e-invoice/e-way workflows.

This BRD maps business requirements to implemented modules and functions for the JavaScript/TypeScript stack.

## 3. Business Objectives
1. **Standardize commercial document generation** across invoice, proforma, quotation, purchase order, and work order
2. **Improve data consistency** using shared masters (party, vendor, product, bank, goods, category)
3. **Enforce GST-oriented tax computation** and output variants (local/interstate, IGST, SEZ/export variants)
4. **Support statutory digital compliance** via E-Invoice and E-Way API flows
5. **Enable operational controls** through validation and multi-tenancy
6. **Provide decision support** through report extraction and stock-level monitoring

## 4. Scope

### 4.1 In Scope
- User login and session context management
- Company context selection and multi-company data partitioning
- Master data lifecycle (create/read/update/delete)
- Transaction document lifecycle (create, open, edit, delete, print, email)
- Inventory movement posting (IN, OUT, RETURN)
- Sales and service report generation with export
- Proposal generation and proposal history management
- E-Invoice/E-Way payload generation and API integration
- Database backup functionality

### 4.2 Out of Scope
- Web portal/API-first architecture (desktop-only via Electron)
- Real-time dashboard service
- Workflow approvals/escalation engine
- Mobile application

## 5. Architecture Overview

### 5.1 Technology Stack
| Layer | Technology |
|-------|------------|
| Desktop Shell | Electron |
| Frontend | React 18 + Vite |
| State Management | Redux Toolkit |
| UI Library | Ant Design |
| Backend API | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |

### 5.2 Key Directories
```
/backend/src/
  ├── models/appModels/      # Mongoose schemas
  ├── controllers/           # API controllers
  ├── routes/               # Express routes
  └── middlewares/          # Auth, company context

/frontend/src/
  ├── pages/                # Page components
  ├── modules/              # Feature modules
  ├── components/           # Shared components
  ├── redux/                # Redux slices
  └── forms/                # Form configurations
```

## 6. Business Process View

### 6.1 Foundation Layer

#### BR-001 Global Context Management
**Requirement**: System maintains shared context for company, user, document type, tax mode

**Implementation**:
- `frontend/src/apps/Header/HeaderContainer.jsx` - Company selector
- `frontend/src/redux/auth/selectors.js` - `selectCurrentCompany`
- Backend middleware sets company context from session

#### BR-002 UI Data Initialization
**Requirement**: Standardized grid lookups, date formats, currency formats

**Implementation**:
- `frontend/src/settings/index.js` - `useMoney`, `useDate` hooks
- `frontend/src/components/SelectAsync/index.jsx` - Async lookups
- `frontend/src/components/MoneyInputFormItem/index.jsx` - Currency formatting

#### BR-003 Value Conversion
**Requirement**: Convert numeric totals to words

**Implementation**:
- `frontend/src/utils/calculate.js` - Calculation utilities
- To be extended: Number-to-words conversion module

### 6.2 Security and Access Layer

#### BR-010 Authentication
**Requirement**: Validate username/password, initialize session

**Implementation**:
- `frontend/src/pages/Login.jsx`
- `backend/src/controllers/middlewaresControllers/createAuthMiddleware/login.js`
- JWT token storage in localStorage (`authToken`)

### 6.3 Master Data Layer

#### BR-030 Party Master Management
**Requirement**: Maintain customer/party profile with statutory and contact data

**Implementation**:
- Model: `backend/src/models/appModels/Client.js`
- Frontend: `frontend/src/pages/Customer/`
- Fields: name, contactPerson, phone, address, city, state, gstStatus, gstin, panNo, pin

#### BR-031 Vendor Master Management
**Requirement**: Maintain vendor profile with GST and communication data

**Implementation**:
- Model: `backend/src/models/appModels/Vendor.js`
- Frontend: `frontend/src/pages/Vendor/`
- Fields: name, contactPerson, contactNo1/2, address, gstStatus, gstin, panNo, vatNo, cstNo, eccNo, iecCode

#### BR-032 Product and Classification Masters
**Requirement**: Category/sub-category/product/PO product with tax identifiers

**Implementation**:
- Models: `Category.js`, `SubCategory.js`, `Product.js`, `POProduct.js`
- Frontend: `frontend/src/pages/Category/`, `SubCategory/`, `Product/`, `POProduct/`
- Supports HSN/SAC codes

#### BR-033 Banking and Company Profile
**Requirement**: Bank details and company-level profile/prefix settings

**Implementation**:
- Models: `Bank.js`, `Company.js`
- Frontend: `frontend/src/pages/Bank/`, `Company/`
- Company fields: name, address, gstin, panNo, financialYear, email1/2, phone1/2, website, prefix (invoice, serviceInvoice, quotation, purchaseOrder, workOrder)

#### BR-034 Goods and Technical Masters
**Requirement**: Goods with technical dimensions and stock controls

**Implementation**:
- Models: `Goods.js`, `Type.js`, `Model.js`, `PlungerDia.js`, `MOC.js`
- Frontend: Corresponding pages in `frontend/src/pages/`

### 6.4 Transaction Layer (Major Business Flows)

#### BR-100 Sales Invoice Lifecycle
**Requirement**: Create, modify, delete, print, email, statutory generation

**Flow**:
1. Initialize data tables and relations
2. Load lookups (party/product)
3. Generate invoice number by company/year logic
4. Enter line items and charges
5. Recalculate taxable and tax totals in real time
6. Save header/detail to DB
7. Print selected output format
8. Generate E-Invoice and E-Way
9. Email document if required

**Implementation**:
- Model: `backend/src/models/appModels/Invoice.js`
- Frontend: `frontend/src/modules/InvoiceModule/`
- Form: `frontend/src/modules/InvoiceModule/Forms/InvoiceForm.jsx`

**Current Status**: ✅ Implemented, needs calculation fixes

#### BR-101 Service Invoice Lifecycle
**Requirement**: Equivalent lifecycle for service invoices

**Implementation**:
- Model: `backend/src/models/appModels/ServiceInvoice.js`
- Uses `buildTransactionSchema()` - needs full Invoice-like schema

**Current Status**: ⚠️ Uses generic schema, needs custom fields

#### BR-102 Proforma Invoice Lifecycle (Sales)
**Requirement**: Pre-commercial proforma document generation

**Implementation**:
- Model: `backend/src/models/appModels/ProformaInvoice.js`
- Uses `buildTransactionSchema()`

**Current Status**: ⚠️ Uses generic schema, needs UI module

#### BR-103 Proforma Invoice Lifecycle (Service)
**Requirement**: Service-type proforma generation

**Implementation**:
- Model: `backend/src/models/appModels/ProformaServiceInvoice.js`

**Current Status**: ⚠️ Uses generic schema, needs UI module

#### BR-104 Quotation Lifecycle
**Requirement**: Quotation creation, revision, printing, proposal linkage

**Implementation**:
- Model: `backend/src/models/appModels/Quotation.js`
- Uses `buildTransactionSchema()`

**Current Status**: ⚠️ Uses generic schema, needs UI module

#### BR-105 Purchase Order Lifecycle
**Requirement**: PO creation and vendor-facing communication

**Implementation**:
- Model: `backend/src/models/appModels/PurchaseOrder.js`
- Uses `buildTransactionSchema()` with vendor reference

**Current Status**: ⚠️ Uses generic schema, needs UI module

#### BR-106 Work Order Lifecycle
**Requirement**: Work order creation and communication

**Implementation**:
- Model: `backend/src/models/appModels/WorkOrder.js`
- Uses `buildTransactionSchema()`

**Current Status**: ⚠️ Uses generic schema, needs UI module

### 6.5 Proposal Layer

#### BR-120 Proposal Authoring
**Requirement**: Generate technical-commercial proposal

**Implementation**:
- Model: `backend/src/models/appModels/ProposalHistory.js`
- Frontend: `frontend/src/pages/ProposalHistory/`
- Fields: proposalNumber, company, party, product, pumpType, pumpModel, price, discount, proposalDate, generatedBy, fullProductName, technical specs

**Missing Models**:
- `ProposalScopeHistory` - Scope items per proposal
- `ProposalScopeMaster` - Reusable scope templates

### 6.6 Inventory Layer

#### BR-130 Inventory Transaction Posting
**Requirement**: Post inventory movements as IN, OUT, RETURN

**Implementation**:
- Model: `backend/src/models/appModels/GoodsInventory.js`
- Frontend: `frontend/src/pages/GoodsInventory/`
- Fields: goods, party, invDate, inventoryType (IN/OUT/RETURN), qty, price, totalPrice

#### BR-131 Reorder Monitoring
**Requirement**: Display goods below reorder level

**Implementation**:
- Field in Goods model: `reOrderLevel`
- Dashboard alert to be implemented

### 6.7 Reporting Layer

#### BR-140 Sales and Service Reports
**Requirement**: Filter-based report extraction and export

**Implementation**:
- To be implemented: Report controllers and frontend modules
- Export formats: Excel, PDF

### 6.8 Compliance Layer

#### BR-150 E-Invoice / E-Way Integration
**Requirement**: API-compliant payloads and response parsing

**Implementation**:
- To be implemented:
  - `backend/src/modules/einvoice/EInvoiceService.js`
  - `backend/src/modules/eway/EWayBillService.js`
  - JSON schema validators
  - Auth token management

## 7. Data Entities

### 7.1 Master Entities
| Entity | File | Key Fields |
|--------|------|------------|
| Company | `Company.js` | name, address, gstin, panNo, financialYear, prefix, counters |
| Client | `Client.js` | name, contactPerson, phone, address, gstStatus, gstin, panNo |
| Vendor | `Vendor.js` | name, contactPerson, contactNo1/2, gstin, panNo, vatNo, cstNo |
| Product | `Product.js` | name, description, category, subCategory, hsnSac, price |
| Category | `Category.js` | name, description |
| SubCategory | `SubCategory.js` | name, description, category |
| Bank | `Bank.js` | bankName, accountNo, ifscCode, branch |
| Goods | `Goods.js` | goodsName, type, model, plungerDia, moc, reOrderLevel |

### 7.2 Transaction Entities
| Entity | File | Key Fields |
|--------|------|------------|
| Invoice | `Invoice.js` | number, year, client, items[], subTotal, taxRate, taxTotal, discount, total |
| ServiceInvoice | `ServiceInvoice.js` | Same structure via buildTransactionSchema |
| ProformaInvoice | `ProformaInvoice.js` | Same structure via buildTransactionSchema |
| Quotation | `Quotation.js` | Same structure via buildTransactionSchema |
| PurchaseOrder | `PurchaseOrder.js` | Same structure via buildTransactionSchema |
| WorkOrder | `WorkOrder.js` | Same structure via buildTransactionSchema |
| GoodsInventory | `GoodsInventory.js` | goods, party, inventoryType, qty, price, totalPrice |
| Payment | `Payment.js` | invoice, amount, date, paymentMode |

### 7.3 Proposal Entities
| Entity | File | Status |
|--------|------|--------|
| ProposalHistory | `ProposalHistory.js` | ✅ Implemented |
| ProposalScopeHistory | Not created | ⚠️ Missing |
| ProposalScopeMaster | Not created | ⚠️ Missing |

## 8. Implementation Status

### 8.1 Completed ✅
- [x] Authentication and session management
- [x] Company context switching
- [x] Master data CRUD (Company, Client, Vendor, Product, Category, SubCategory, Bank)
- [x] Technical masters (Type, Model, PlungerDia, MOC)
- [x] Goods and Inventory masters
- [x] Invoice module with line items
- [x] Payment recording
- [x] Basic tax calculation
- [x] Financial settings
- [x] Proposal history basic CRUD

### 8.2 In Progress / Needs Fix ⚠️
- [ ] Invoice calculation logic (subtotal, tax, discount, total)
- [ ] ServiceInvoice custom fields (currently generic)
- [ ] ProformaInvoice UI module
- [ ] Quotation UI module
- [ ] PurchaseOrder UI module
- [ ] WorkOrder UI module

### 8.3 Not Started ❌
- [ ] ProposalScopeHistory model
- [ ] ProposalScopeMaster model
- [ ] E-Invoice integration service
- [ ] E-Way Bill integration service
- [ ] Sales reports module
- [ ] Service reports module
- [ ] Stock/reorder reports
- [ ] Email service integration
- [ ] Print template system
- [ ] Database backup to cloud

## 9. Functional Requirements (Test-Oriented)

### 9.1 Common Master Form Requirements
- FR-MST-001: Create new record
- FR-MST-002: Open existing record
- FR-MST-003: Update record
- FR-MST-004: Delete with confirmation
- FR-MST-005: Field mandatory validations
- FR-MST-006: Duplicate prevention

### 9.2 Transaction Form Requirements
- FR-TRN-001: Auto-number generation with financial context
- FR-TRN-002: Header-detail relation setup
- FR-TRN-003: Real-time line and header total calculation
- FR-TRN-004: Open historical document for edit/print
- FR-TRN-005: Print multiple legal copies
- FR-TRN-006: Email output attachment
- FR-TRN-007: Statutory payload generation

### 9.3 Compliance Requirements
- FR-CMP-001: GST/IGST flow support
- FR-CMP-002: PAN/GSTIN format validation
- FR-CMP-003: E-Invoice payload schema validation
- FR-CMP-004: E-Way payload schema validation

## 10. Non-Functional Requirements
- NFR-001: Desktop startup without DB corruption
- NFR-002: Form save operations maintain header-detail integrity
- NFR-003: Lookup loading remains responsive
- NFR-004: Critical operations provide user feedback
- NFR-005: All API endpoints enforce authentication
- NFR-006: Secrets stored in environment variables, not committed

## 11. Implementation Priority

### Phase 1: Foundation (Completed)
- Authentication, company context, masters

### Phase 2: Core Transactions (Current)
- Fix Invoice calculation logic
- Implement ServiceInvoice, ProformaInvoice, Quotation modules
- Implement PurchaseOrder, WorkOrder modules

### Phase 3: Compliance
- E-Invoice/E-Way integration
- GST validation and reporting

### Phase 4: Reporting and Proposal
- Sales/Service/Stock reports
- Complete proposal module with scope management
- Dashboard with reorder alerts

---

*Document Version: 1.0*
*Last Updated: April 2026*
