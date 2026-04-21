const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');
const { resolveProductForInvoiceItem } = require('./productPriceResolver');
const { resolveCompanyId } = require('@/controllers/helpers/companyScope');

const create = async (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const { items = [], taxRate = 0, discount = 0 } = value;
  const resolvedItems = await Promise.all(items.map((item) => resolveProductForInvoiceItem(item)));

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  //Calculate the items array with subTotal, total, taxTotal
  resolvedItems.map((item) => {
    const safePrice = Number(item?.price || 0);
    let lineTotal = calculate.multiply(item['quantity'], safePrice);
    //sub total
    subTotal = calculate.add(subTotal, lineTotal);
    //item total
    item['price'] = safePrice;
    item['total'] = lineTotal;
  });

  // Apply discount before tax calculation
  const discountedSubTotal = calculate.sub(subTotal, discount);
  taxTotal = calculate.multiply(discountedSubTotal, taxRate / 100);
  total = calculate.add(discountedSubTotal, taxTotal);

  body['subTotal'] = subTotal;
  body['discountTotal'] = discount;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = resolvedItems;

  let paymentStatus = total === 0 ? 'paid' : 'unpaid';

  body['paymentStatus'] = paymentStatus;
  body['createdBy'] = req.admin._id;
  body['company'] = resolveCompanyId(req) || body.company;

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = 'invoice-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_invoice_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
