const mongoose = require('mongoose');
const { resolveCompanyId } = require('./companyScope');

const hasRemovedPath = (Model) => Boolean(Model?.schema?.path('removed'));

const baseQuery = (Model) => (hasRemovedPath(Model) ? { removed: false } : {});

const findByLegacyId = async (modelName, legacyField, value) => {
  if (value === undefined || value === null || value === '') return null;
  const Model = mongoose.model(modelName);
  const query = { ...baseQuery(Model), [legacyField]: Number(value) };
  return Model.findOne(query).select('_id').lean();
};

const findByName = async (modelName, nameField, value) => {
  if (!value || typeof value !== 'string') return null;
  const Model = mongoose.model(modelName);
  const safe = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').trim();
  if (!safe) return null;
  const query = { ...baseQuery(Model), [nameField]: { $regex: new RegExp(`^${safe}$`, 'i') } };
  return Model.findOne(query).select('_id').lean();
};

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const resolveReference = async (payload, spec) => {
  const {
    targetKey,
    targetModel,
    directKeys = [],
    legacyKeys = [],
    legacyField,
    nameKeys = [],
    nameField = 'name',
  } = spec;

  const existing = payload?.[targetKey];
  if (existing && isObjectId(existing)) return existing;

  for (const key of directKeys) {
    const value = payload?.[key];
    if (value && isObjectId(value)) return value;
  }

  for (const key of legacyKeys) {
    const value = payload?.[key];
    if (value === undefined || value === null || value === '') continue;
    const doc = await findByLegacyId(targetModel, legacyField, value);
    if (doc?._id) return doc._id;
  }

  for (const key of nameKeys) {
    const value = payload?.[key];
    if (!value) continue;
    const doc = await findByName(targetModel, nameField, value);
    if (doc?._id) return doc._id;
  }

  return null;
};

const relationMap = {
  SubCategory: [
    {
      targetKey: 'category',
      targetModel: 'Category',
      directKeys: ['category'],
      legacyKeys: ['categoryId'],
      legacyField: 'legacyCategoryId',
      nameKeys: ['categoryName'],
      nameField: 'name',
    },
  ],
  Product: [
    {
      targetKey: 'categoryRef',
      targetModel: 'Category',
      directKeys: ['categoryRef', 'category'],
      legacyKeys: ['categoryId'],
      legacyField: 'legacyCategoryId',
      nameKeys: ['category'],
      nameField: 'name',
    },
    {
      targetKey: 'subCategoryRef',
      targetModel: 'SubCategory',
      directKeys: ['subCategoryRef', 'subCategory'],
      legacyKeys: ['subCategoryId'],
      legacyField: 'legacySubCategoryId',
      nameKeys: ['subCategory'],
      nameField: 'name',
    },
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  POProduct: [
    {
      targetKey: 'category',
      targetModel: 'Category',
      directKeys: ['category'],
      legacyKeys: ['categoryId'],
      legacyField: 'legacyCategoryId',
      nameKeys: ['categoryName'],
      nameField: 'name',
    },
    {
      targetKey: 'subCategory',
      targetModel: 'SubCategory',
      directKeys: ['subCategory'],
      legacyKeys: ['subCategoryId'],
      legacyField: 'legacySubCategoryId',
      nameKeys: ['subCategoryName'],
      nameField: 'name',
    },
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Goods: [
    {
      targetKey: 'type',
      targetModel: 'Type',
      directKeys: ['type'],
      legacyKeys: ['typeId'],
      legacyField: 'legacyTypeId',
      nameKeys: ['typeName'],
      nameField: 'typeName',
    },
    {
      targetKey: 'category',
      targetModel: 'Category',
      directKeys: ['category'],
      legacyKeys: ['stockCategoryId', 'categoryId'],
      legacyField: 'legacyCategoryId',
      nameKeys: ['categoryName'],
      nameField: 'name',
    },
    {
      targetKey: 'subCategory',
      targetModel: 'SubCategory',
      directKeys: ['subCategory'],
      legacyKeys: ['stockSubCategoryId', 'subCategoryId'],
      legacyField: 'legacySubCategoryId',
      nameKeys: ['subCategoryName'],
      nameField: 'name',
    },
    {
      targetKey: 'model',
      targetModel: 'Model',
      directKeys: ['model'],
      legacyKeys: ['modelId'],
      legacyField: 'legacyModelId',
      nameKeys: ['modelName'],
      nameField: 'modelName',
    },
    {
      targetKey: 'plungerDia',
      targetModel: 'PlungerDia',
      directKeys: ['plungerDia'],
      legacyKeys: ['plungerDiaId'],
      legacyField: 'legacyPlungerDiaId',
      nameKeys: ['plungerDiaName'],
      nameField: 'plungerDiaName',
    },
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  GoodsInventory: [
    {
      targetKey: 'goods',
      targetModel: 'Goods',
      directKeys: ['goods'],
      legacyKeys: ['goodsId'],
      legacyField: 'legacyGoodsId',
      nameKeys: ['goodsName'],
      nameField: 'goodsName',
    },
    {
      targetKey: 'party',
      targetModel: 'Client',
      directKeys: ['party', 'client'],
      legacyKeys: ['partyId'],
      legacyField: 'legacyPartyId',
      nameKeys: ['partyName'],
      nameField: 'name',
    },
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  ProposalHistory: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
    {
      targetKey: 'party',
      targetModel: 'Client',
      directKeys: ['party', 'client'],
      legacyKeys: ['partyId', 'legacyPartyId'],
      legacyField: 'legacyPartyId',
      nameKeys: ['partyName'],
      nameField: 'name',
    },
    {
      targetKey: 'product',
      targetModel: 'Product',
      directKeys: ['product'],
      legacyKeys: ['productId', 'legacyProductId'],
      legacyField: 'legacyProductId',
      nameKeys: ['productName', 'fullProductName'],
      nameField: 'name',
    },
  ],
  Client: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Category: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  SubCategory: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Invoice: [
    {
      targetKey: 'client',
      targetModel: 'Client',
      directKeys: ['client', 'party'],
      legacyKeys: ['clientId', 'partyId', 'legacyPartyId'],
      legacyField: 'legacyPartyId',
      nameKeys: ['clientName', 'partyName'],
      nameField: 'name',
    },
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Payment: [
    {
      targetKey: 'client',
      targetModel: 'Client',
      directKeys: ['client', 'party'],
      legacyKeys: ['clientId', 'partyId', 'legacyPartyId'],
      legacyField: 'legacyPartyId',
      nameKeys: ['clientName', 'partyName'],
      nameField: 'name',
    },
    {
      targetKey: 'invoice',
      targetModel: 'Invoice',
      directKeys: ['invoice'],
      legacyKeys: ['invoiceId', 'legacyInvoiceId'],
      legacyField: 'legacyInvoiceId',
      nameKeys: ['invoiceNumber'],
      nameField: 'number',
    },
  ],
  Bank: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  FinancialSettings: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  MOC: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Model: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  PlungerDia: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Type: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
  Vendor: [
    {
      targetKey: 'company',
      targetModel: 'Company',
      directKeys: ['company'],
      legacyKeys: ['companyId', 'legacyCompanyId'],
      legacyField: 'legacyCompanyId',
      nameKeys: ['companyName'],
      nameField: 'name',
    },
  ],
};

const applyLookupRelations = async (Model, req, payload = {}) => {
  const body = { ...payload };
  const modelName = Model?.modelName;

  if (Model?.schema?.path('company') && !body.company) {
    const companyId = resolveCompanyId(req);
    if (companyId) body.company = companyId;
  }

  const modelRelations = relationMap[modelName] || [];
  for (const spec of modelRelations) {
    const resolvedId = await resolveReference(body, spec);
    if (resolvedId) body[spec.targetKey] = resolvedId;
  }

  return body;
};

module.exports = { applyLookupRelations };
