const mongoose = require('mongoose');

const ProductModel = mongoose.model('Product');

const CACHE_TTL_MS = 5 * 60 * 1000;
const cacheById = new Map();
const cacheByName = new Map();

const now = () => Date.now();
const normalizeName = (value = '') => String(value).trim().toLowerCase();
const escapeRegExp = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getCached = (cache, key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (item.expiresAt <= now()) {
    cache.delete(key);
    return null;
  }
  return item.value;
};

const setCached = (cache, key, value) => {
  cache.set(key, { value, expiresAt: now() + CACHE_TTL_MS });
};

const selectProductProjection = 'name description rate price';

const findProductById = async (id) => {
  const key = String(id);
  const cached = getCached(cacheById, key);
  if (cached) return cached;

  const product = await ProductModel.findById(id).select(selectProductProjection).lean();
  if (product) {
    setCached(cacheById, key, product);
    setCached(cacheByName, normalizeName(product.name), product);
  }
  return product;
};

const findProductByName = async (name) => {
  const key = normalizeName(name);
  if (!key) return null;

  const cached = getCached(cacheByName, key);
  if (cached) return cached;

  const safeName = escapeRegExp(String(name).trim());
  const product = await ProductModel.findOne({
    removed: false,
    name: { $regex: new RegExp(`^${safeName}$`, 'i') },
  })
    .select(selectProductProjection)
    .lean();

  if (product) {
    setCached(cacheByName, key, product);
    setCached(cacheById, String(product._id), product);
  }
  return product;
};

const resolveProductForInvoiceItem = async (item) => {
  const resolved = { ...item };
  let product = null;

  if (item?.product && mongoose.Types.ObjectId.isValid(String(item.product))) {
    product = await findProductById(item.product);
  }

  if (!product && item?.itemName) {
    product = await findProductByName(item.itemName);
  }

  if (!product) return resolved;

  const productPrice = Number(product.rate ?? product.price ?? 0);
  if (Number.isFinite(productPrice)) {
    resolved.price = productPrice;
  }
  resolved.itemName = product.name || resolved.itemName;
  resolved.product = product._id;
  if (!resolved.description && product.description) {
    resolved.description = product.description;
  }

  return resolved;
};

module.exports = { resolveProductForInvoiceItem };
