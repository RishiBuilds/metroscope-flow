import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Alert01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Award01Icon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  BookmarkRemove01Icon,
  Calendar03Icon,
  Cancel01Icon,
  ChartBarLineIcon,
  ChartNoAxesCombinedIcon,
  CheckmarkCircle02Icon,
  Delete01Icon,
  EarthIcon,
  Exchange01Icon,
  HeartPulseIcon,
  Leaf01Icon,
  Loading01Icon,
  Location01Icon,
  Login01Icon,
  Logout01Icon,
  Menu01Icon,
  RefreshIcon,
  Search01Icon,
  Shield01Icon,
  SparklesIcon,
  Table01Icon,
  UserAdd01Icon,
  UserIcon,
  ViewIcon,
  ViewOffIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';

function createIcon(icon) {
  return function Icon({ size = 20, ...props }) {
    return <HugeiconsIcon icon={icon} {...props} size={size} color="currentColor" strokeWidth={1.5} />;
  };
}

export const Globe2 = createIcon(EarthIcon);
export const AlertTriangle = createIcon(Alert01Icon);
export const AlertCircle = createIcon(Alert01Icon);
export const RefreshCw = createIcon(RefreshIcon);
export const CheckCircle2 = createIcon(CheckmarkCircle02Icon);
export const X = createIcon(Cancel01Icon);
export const Search = createIcon(Search01Icon);
export const Plus = createIcon(Add01Icon);
export const Loader2 = createIcon(Loading01Icon);
export const Bookmark = createIcon(Bookmark01Icon);
export const BookmarkCheck = createIcon(BookmarkCheck01Icon);
export const BookmarkX = createIcon(BookmarkRemove01Icon);
export const Menu = createIcon(Menu01Icon);
export const LogOut = createIcon(Logout01Icon);
export const User = createIcon(UserIcon);
export const UserPlus = createIcon(UserAdd01Icon);
export const Eye = createIcon(ViewIcon);
export const EyeOff = createIcon(ViewOffIcon);
export const ArrowRight = createIcon(ArrowRight01Icon);
export const ArrowLeft = createIcon(ArrowLeft01Icon);
export const ArrowDown = createIcon(ArrowDown01Icon);
export const ArrowUp = createIcon(ArrowUp01Icon);
export const Exchange = createIcon(Exchange01Icon);
export const Trash2 = createIcon(Delete01Icon);
export const LogIn = createIcon(Login01Icon);
export const Calendar = createIcon(Calendar03Icon);
export const MapPin = createIcon(Location01Icon);
export const BarChart3 = createIcon(ChartBarLineIcon);
export const ShieldCheck = createIcon(Shield01Icon);
export const Trophy = createIcon(Award01Icon);
export const TableProperties = createIcon(Table01Icon);
export const ChartNoAxesCombined = createIcon(ChartNoAxesCombinedIcon);
export const Sparkles = createIcon(SparklesIcon);
export const WalletCards = createIcon(Wallet01Icon);
export const HeartPulse = createIcon(HeartPulseIcon);
export const Leaf = createIcon(Leaf01Icon);
