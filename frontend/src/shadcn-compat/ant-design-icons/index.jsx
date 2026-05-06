import {
  AlertTriangle,
  Apartment,
  ArrowDown,
  ArrowUp,
  Banknote,
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Columns3,
  CreditCard,
  Database,
  FileCheck2,
  FileClock,
  FileSearch2,
  FileSpreadsheet,
  FileText,
  FileUp,
  FileWarning,
  Gauge,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  LucideIcon,
  Menu,
  MinusCircle,
  Package2,
  PenSquare,
  Plus,
  Printer,
  Rocket,
  Save,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  ToolCase,
  Trash2,
  Upload,
  User,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';

function icon(Icon) {
  return function AntdIcon(props) {
    return <Icon size={16} {...props} />;
  };
}

const RightChevron = icon(ChevronDown);

export const MenuOutlined = icon(Menu);
export const CloseOutlined = icon(X);
export const CheckOutlined = icon(Check);
export const UserOutlined = icon(User);
export const LockOutlined = icon(ShieldCheck);
export const MailOutlined = icon(FileUp);
export const SearchOutlined = icon(Search);
export const MinusCircleOutlined = icon(MinusCircle);
export const PlusOutlined = icon(Plus);
export const UploadOutlined = icon(Upload);
export const LoadingOutlined = icon(LoaderCircle);
export const DeleteOutlined = icon(Trash2);
export const RocketOutlined = icon(Rocket);
export const CheckCircleOutlined = icon(CheckCircle2);
export const PrinterOutlined = icon(Printer);
export const FileExcelOutlined = icon(FileSpreadsheet);
export const WarningOutlined = icon(AlertTriangle);
export const CloseCircleOutlined = icon(XCircle);
export const SaveOutlined = icon(Save);
export const EditOutlined = icon(PenSquare);
export const LogoutOutlined = icon(LogOut);
export const EllipsisOutlined = RightChevron;
export const EyeOutlined = icon(FileSearch2);
export const FilePdfOutlined = icon(FileText);
export const ArrowUpOutlined = icon(ArrowUp);
export const ArrowDownOutlined = icon(ArrowDown);
export const CreditCardOutlined = icon(CreditCard);
export const FileTextOutlined = icon(FileText);
export const SyncOutlined = icon(LoaderCircle);

export const DesktopOutlined = icon(LayoutDashboard);
export const SettingOutlined = icon(Settings);
export const CustomerServiceOutlined = icon(Users);
export const FileSyncOutlined = icon(FileClock);
export const DashboardOutlined = icon(Gauge);
export const TeamOutlined = icon(Users);
export const BankOutlined = icon(Banknote);
export const ContainerOutlined = icon(Package2);
export const ShopOutlined = icon(Briefcase);
export const AppstoreOutlined = icon(Boxes);
export const SolutionOutlined = icon(FileText);
export const DatabaseOutlined = icon(Database);
export const BuildOutlined = icon(Wrench);
export const ToolOutlined = icon(ToolCase);
export const ClusterOutlined = icon(Apartment);
export const TagsOutlined = icon(FileWarning);
export const BarChartOutlined = icon(BarChart3);
export const ShoppingOutlined = icon(ShoppingBag);
export const ColumnHeightOutlined = icon(Columns3);
export const ThunderboltOutlined = icon(Rocket);
export const HomeOutlined = icon(Home);
export const ApartmentOutlined = icon(Building2);
export const ProfileOutlined = icon(CircleUserRound);
export const StockOutlined = icon(BarChart3);
export const FileProtectOutlined = icon(ShieldCheck);
export const FileDoneOutlined = icon(FileCheck2);
export const LineChartOutlined = icon(BarChart3);
export const FileSearchOutlined = icon(FileSearch2);
export const ShoppingCartOutlined = icon(ShoppingCart);

