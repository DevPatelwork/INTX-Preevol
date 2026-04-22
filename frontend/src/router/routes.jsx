import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));
const Dashboard = lazy(() => import('@/modules/DashboardModule'));


const Customer = lazy(() => import('@/pages/Customer'));
const Company = lazy(() => import('@/pages/Company'));
const Product = lazy(() => import('@/pages/Product'));
const Category = lazy(() => import('@/pages/Category'));
const SubCategory = lazy(() => import('@/pages/SubCategory'));
const Bank = lazy(() => import('@/pages/Bank'));
const FinancialSettings = lazy(() => import('@/pages/FinancialSettings'));
const POProduct = lazy(() => import('@/pages/POProduct'));
const Goods = lazy(() => import('@/pages/Goods'));
const GoodsInventory = lazy(() => import('@/pages/GoodsInventory'));
const ProposalHistory = lazy(() => import('@/pages/ProposalHistory'));
const ModelMaster = lazy(() => import('@/pages/ModelMaster'));
const PlungerDia = lazy(() => import('@/pages/PlungerDia'));
const TypeMaster = lazy(() => import('@/pages/TypeMaster'));
const MOC = lazy(() => import('@/pages/MOC'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));
const TransactionDocumentList = lazy(() => import('@/pages/TransactionDocument/List'));
const TransactionDocumentCreate = lazy(() => import('@/pages/TransactionDocument/Create'));
const TransactionDocumentRead = lazy(() => import('@/pages/TransactionDocument/Read'));
const TransactionDocumentUpdate = lazy(() => import('@/pages/TransactionDocument/Update'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));
const Vendor = lazy(() => import('@/pages/Vendor'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));


const Profile = lazy(() => import('@/pages/Profile'));

const User = lazy(() => import('@/pages/User'));
const Client = lazy(() => import('@/pages/Client'));

const About = lazy(() => import('@/pages/About'));

// Report Pages
const SalesReport = lazy(() => import('@/pages/Reports/SalesReport'));
const ServiceReport = lazy(() => import('@/pages/Reports/ServiceReport'));
const StockReport = lazy(() => import('@/pages/Reports/StockReport'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/company',
      element: <Company />,
    },
    {
      path: '/product',
      element: <Product />,
    },
    {
      path: '/category',
      element: <Category />,
    },
    {
      path: '/subcategory',
      element: <SubCategory />,
    },
    {
      path: '/bank',
      element: <Bank />,
    },
    {
      path: '/financialsettings',
      element: <FinancialSettings />,
    },
    {
      path: '/poproduct',
      element: <POProduct />,
    },
    {
      path: '/goods',
      element: <Goods />,
    },
    {
      path: '/goodsinventory',
      element: <GoodsInventory />,
    },
    {
      path: '/proposalhistory',
      element: <ProposalHistory />,
    },
    {
      path: '/model',
      element: <ModelMaster />,
    },
    {
      path: '/plungerdia',
      element: <PlungerDia />,
    },
    {
      path: '/type',
      element: <TypeMaster />,
    },
    {
      path: '/moc',
      element: <MOC />,
    },

    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quotation',
      element: <TransactionDocumentList entity="quotation" label="Quotation" />,
    },
    {
      path: '/quotation/create',
      element: <TransactionDocumentCreate entity="quotation" label="Quotation" />,
    },
    {
      path: '/quotation/read/:id',
      element: <TransactionDocumentRead entity="quotation" label="Quotation" />,
    },
    {
      path: '/quotation/update/:id',
      element: <TransactionDocumentUpdate entity="quotation" label="Quotation" />,
    },
    {
      path: '/purchaseorder',
      element: <TransactionDocumentList entity="purchaseorder" label="Purchase Order" />,
    },
    {
      path: '/purchaseorder/create',
      element: <TransactionDocumentCreate entity="purchaseorder" label="Purchase Order" />,
    },
    {
      path: '/purchaseorder/read/:id',
      element: <TransactionDocumentRead entity="purchaseorder" label="Purchase Order" />,
    },
    {
      path: '/purchaseorder/update/:id',
      element: <TransactionDocumentUpdate entity="purchaseorder" label="Purchase Order" />,
    },
    {
      path: '/workorder',
      element: <TransactionDocumentList entity="workorder" label="Work Order" />,
    },
    {
      path: '/workorder/create',
      element: <TransactionDocumentCreate entity="workorder" label="Work Order" />,
    },
    {
      path: '/workorder/read/:id',
      element: <TransactionDocumentRead entity="workorder" label="Work Order" />,
    },
    {
      path: '/workorder/update/:id',
      element: <TransactionDocumentUpdate entity="workorder" label="Work Order" />,
    },
    {
      path: '/serviceinvoice',
      element: <TransactionDocumentList entity="serviceinvoice" label="Service Invoice" />,
    },
    {
      path: '/serviceinvoice/create',
      element: <TransactionDocumentCreate entity="serviceinvoice" label="Service Invoice" />,
    },
    {
      path: '/serviceinvoice/read/:id',
      element: <TransactionDocumentRead entity="serviceinvoice" label="Service Invoice" />,
    },
    {
      path: '/serviceinvoice/update/:id',
      element: <TransactionDocumentUpdate entity="serviceinvoice" label="Service Invoice" />,
    },
    {
      path: '/proformainvoice',
      element: <TransactionDocumentList entity="proformainvoice" label="Proforma Invoice" />,
    },
    {
      path: '/proformainvoice/create',
      element: <TransactionDocumentCreate entity="proformainvoice" label="Proforma Invoice" />,
    },
    {
      path: '/proformainvoice/read/:id',
      element: <TransactionDocumentRead entity="proformainvoice" label="Proforma Invoice" />,
    },
    {
      path: '/proformainvoice/update/:id',
      element: <TransactionDocumentUpdate entity="proformainvoice" label="Proforma Invoice" />,
    },
    {
      path: '/proformaserviceinvoice',
      element: <TransactionDocumentList
        entity="proformaserviceinvoice"
        label="Proforma Service Invoice"
      />,
    },
    {
      path: '/proformaserviceinvoice/create',
      element: <TransactionDocumentCreate
        entity="proformaserviceinvoice"
        label="Proforma Service Invoice"
      />,
    },
    {
      path: '/proformaserviceinvoice/read/:id',
      element: <TransactionDocumentRead
        entity="proformaserviceinvoice"
        label="Proforma Service Invoice"
      />,
    },
    {
      path: '/proformaserviceinvoice/update/:id',
      element: <TransactionDocumentUpdate
        entity="proformaserviceinvoice"
        label="Proforma Service Invoice"
      />,
    },
    {
      path: '/quote',
      element: <Navigate to="/quotation" replace />,
    },
    {
      path: '/quote/create',
      element: <Navigate to="/quotation/create" replace />,
    },
    {
      path: '/quote/read/:id',
      element: <Navigate to="/quotation/read/:id" replace />,
    },
    {
      path: '/quote/update/:id',
      element: <Navigate to="/quotation/update/:id" replace />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },
    {
      path: '/vendor',
      element: <Vendor />,
    },
    {
      path: '/client',
      element: <Client />,
    },
    
    // Report Routes
    {
      path: '/salesreport',
      element: <SalesReport />,
    },
    {
      path: '/servicereport',
      element: <ServiceReport />,
    },
    {
      path: '/stockreport',
      element: <StockReport />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/user',
      element: <User />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
