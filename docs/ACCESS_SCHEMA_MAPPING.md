# Access Schema Relation Mapping (from `doc_rptObjects.txt`)

This project now follows these core relation mappings extracted from the Access schema:

## Master Tables

- `Company (CompanyID)` -> Mongo `Company` (`legacyCompanyId`).
- `Party (PartyID, Company)` -> Mongo `Client` (`legacyPartyId`, `company` ref).
- `Product (ProductID, CategoryID, SubCategoryID, Company)` -> Mongo `Product`
  - `legacyProductId`
  - `categoryId`
  - `subCategoryId`
  - `company` ref
- `Bank (BankID, CompanyID)` relation target is `Company`.
- `FinancialSettings (FinancialYearID, Company)` relation target is `Company`.
- `POProduct (POProductID, CategoryID, SubCategoryID, Company)` relation target is `Company`.
- `GoodsInventory (InventoryID, GoodsID, Company)` relation target is `Company` and `Goods`.
- `ProposalHistory (ProposalID, CompanyID, PartyID, ProductID)` relation targets are `Company`, `Client(Party)`, `Product`.

## Transaction Tables

- `Invoice (InvoiceID, Company, Receiver/Consignee data)` -> Mongo `Invoice`
  - `company` ref added
  - `client` ref already present
- `InvoiceDetail (InvoiceDetailID, InvoiceID)` -> represented by `Invoice.items[]`
  - `product` ref added on line item
  - `itemName`, `description`, `quantity`, `price`, `total`
- `ProformaInvoiceDetail (ProformaInvoiceID)` and `ProformaServiceInvoiceDetail (ProformaServiceInvoiceID)`
  - header-detail relation pattern to be followed in corresponding modules.

## Implemented in Code

Implemented in current codebase:

- `Client.company` relation
- `Client.legacyPartyId`
- `Product.legacyProductId`, `categoryId`, `subCategoryId`, `company`
- `Company.legacyCompanyId`
- `Invoice.company` relation
- `Invoice.items[].product` relation
- Invoice create/update now resolves item price from related product and stores normalized values
- Generic lookup resolver is enabled in CRUD create/update:
  - Accepts direct ObjectId refs when provided
  - Resolves refs from legacy numeric IDs (e.g. `categoryId`, `subCategoryId`, `goodsId`, `partyId`)
  - Falls back to exact-name lookup for known fields
  - Auto-applies `company` from request context when the model has a `company` field

## Next Migration Scope

For full parity with Access schema, next steps are:

1. Add dedicated Mongo models for `Category`, `SubCategory`, `POProduct`, `Goods`, `GoodsInventory`, `FinancialSettings`, `ProposalHistory`, `ProposalScopeHistory`, `ProposalScopeMaster`.
2. Add references in `Product`, `Invoice`, `ProformaInvoice`, `ProformaServiceInvoice`, and report sources.
3. Add migration script from Access IDs to Mongo ObjectIds while preserving `legacy*Id` fields for traceability.
