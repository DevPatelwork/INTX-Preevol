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
    let total = calculate.multiply(item['quantity'], safePrice);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['price'] = safePrice;
    item['total'] = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = resolvedItems;

  let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

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
