import React from "react";

export const defaultIconName = "AutoAwesome";
export const defaultIconImport = React.lazy(
  () => import("@mui/icons-material/AutoAwesome")
);

const iconMap = {
  [defaultIconName]: defaultIconImport,
  Home: React.lazy(() => import("@mui/icons-material/Home")),
  Settings: React.lazy(() => import("@mui/icons-material/Settings")),
  AccountCircle: React.lazy(() => import("@mui/icons-material/AccountCircle")),
  Notifications: React.lazy(() => import("@mui/icons-material/Notifications")),
  Search: React.lazy(() => import("@mui/icons-material/Search")),
  Favorite: React.lazy(() => import("@mui/icons-material/Favorite")),
  ShoppingCart: React.lazy(() => import("@mui/icons-material/ShoppingCart")),
  Info: React.lazy(() => import("@mui/icons-material/Info")),
  Help: React.lazy(() => import("@mui/icons-material/Help")),
  Logout: React.lazy(() => import("@mui/icons-material/Logout")),
  Add: React.lazy(() => import("@mui/icons-material/Add")),
  Edit: React.lazy(() => import("@mui/icons-material/Edit")),
  Delete: React.lazy(() => import("@mui/icons-material/Delete")),
  Check: React.lazy(() => import("@mui/icons-material/Check")),
  Close: React.lazy(() => import("@mui/icons-material/Close")),
  ArrowForward: React.lazy(() => import("@mui/icons-material/ArrowForward")),
  ArrowBack: React.lazy(() => import("@mui/icons-material/ArrowBack")),
  ArrowUpward: React.lazy(() => import("@mui/icons-material/ArrowUpward")),
  ArrowDownward: React.lazy(() => import("@mui/icons-material/ArrowDownward")),
  ExpandMore: React.lazy(() => import("@mui/icons-material/ExpandMore")),
  ExpandLess: React.lazy(() => import("@mui/icons-material/ExpandLess")),
  Menu: React.lazy(() => import("@mui/icons-material/Menu")),
  MoreVert: React.lazy(() => import("@mui/icons-material/MoreVert")),
  CheckCircle: React.lazy(() => import("@mui/icons-material/CheckCircle")),
  Cancel: React.lazy(() => import("@mui/icons-material/Cancel")),
  Warning: React.lazy(() => import("@mui/icons-material/Warning")),
  Error: React.lazy(() => import("@mui/icons-material/Error")),
  InfoOutlined: React.lazy(() => import("@mui/icons-material/InfoOutlined")),
  HelpOutline: React.lazy(() => import("@mui/icons-material/HelpOutline")),
  Visibility: React.lazy(() => import("@mui/icons-material/Visibility")),
  VisibilityOff: React.lazy(() => import("@mui/icons-material/VisibilityOff")),
  Lock: React.lazy(() => import("@mui/icons-material/Lock")),
  LockOpen: React.lazy(() => import("@mui/icons-material/LockOpen")),
  ThumbUp: React.lazy(() => import("@mui/icons-material/ThumbUp")),
  ThumbDown: React.lazy(() => import("@mui/icons-material/ThumbDown")),
  Star: React.lazy(() => import("@mui/icons-material/Star")),
  StarBorder: React.lazy(() => import("@mui/icons-material/StarBorder")),
  StarHalf: React.lazy(() => import("@mui/icons-material/StarHalf")),
  FavoriteBorder: React.lazy(
    () => import("@mui/icons-material/FavoriteBorder")
  ),
  Share: React.lazy(() => import("@mui/icons-material/Share")),
  Send: React.lazy(() => import("@mui/icons-material/Send")),
  Save: React.lazy(() => import("@mui/icons-material/Save")),
  Print: React.lazy(() => import("@mui/icons-material/Print")),
  Download: React.lazy(() => import("@mui/icons-material/Download")),
  Upload: React.lazy(() => import("@mui/icons-material/Upload")),
  Cloud: React.lazy(() => import("@mui/icons-material/Cloud")),
  CloudUpload: React.lazy(() => import("@mui/icons-material/CloudUpload")),
  CloudDownload: React.lazy(() => import("@mui/icons-material/CloudDownload")),
  CloudDone: React.lazy(() => import("@mui/icons-material/CloudDone")),
  Folder: React.lazy(() => import("@mui/icons-material/Folder")),
  FolderOpen: React.lazy(() => import("@mui/icons-material/FolderOpen")),
  FileCopy: React.lazy(() => import("@mui/icons-material/FileCopy")),
  AttachFile: React.lazy(() => import("@mui/icons-material/AttachFile")),
  Attachment: React.lazy(() => import("@mui/icons-material/Attachment")),
  Link: React.lazy(() => import("@mui/icons-material/Link")),
  InsertLink: React.lazy(() => import("@mui/icons-material/InsertLink")),
  Image: React.lazy(() => import("@mui/icons-material/Image")),
  Photo: React.lazy(() => import("@mui/icons-material/Photo")),
  PhotoCamera: React.lazy(() => import("@mui/icons-material/PhotoCamera")),
  CameraAlt: React.lazy(() => import("@mui/icons-material/CameraAlt")),
  VideoCall: React.lazy(() => import("@mui/icons-material/VideoCall")),
  Videocam: React.lazy(() => import("@mui/icons-material/Videocam")),
  Mic: React.lazy(() => import("@mui/icons-material/Mic")),
  MicOff: React.lazy(() => import("@mui/icons-material/MicOff")),
  VolumeUp: React.lazy(() => import("@mui/icons-material/VolumeUp")),
  VolumeOff: React.lazy(() => import("@mui/icons-material/VolumeOff")),
  VolumeDown: React.lazy(() => import("@mui/icons-material/VolumeDown")),
  PlayArrow: React.lazy(() => import("@mui/icons-material/PlayArrow")),
  Pause: React.lazy(() => import("@mui/icons-material/Pause")),
  Stop: React.lazy(() => import("@mui/icons-material/Stop")),
  SkipNext: React.lazy(() => import("@mui/icons-material/SkipNext")),
  SkipPrevious: React.lazy(() => import("@mui/icons-material/SkipPrevious")),
  FastForward: React.lazy(() => import("@mui/icons-material/FastForward")),
  FastRewind: React.lazy(() => import("@mui/icons-material/FastRewind")),
  Loop: React.lazy(() => import("@mui/icons-material/Loop")),
  Shuffle: React.lazy(() => import("@mui/icons-material/Shuffle")),
  Repeat: React.lazy(() => import("@mui/icons-material/Repeat")),
  RepeatOne: React.lazy(() => import("@mui/icons-material/RepeatOne")),
  QueueMusic: React.lazy(() => import("@mui/icons-material/QueueMusic")),
  LibraryMusic: React.lazy(() => import("@mui/icons-material/LibraryMusic")),
  Album: React.lazy(() => import("@mui/icons-material/Album")),
  MusicNote: React.lazy(() => import("@mui/icons-material/MusicNote")),
  Headset: React.lazy(() => import("@mui/icons-material/Headset")),
  HeadsetMic: React.lazy(() => import("@mui/icons-material/HeadsetMic")),
  Speaker: React.lazy(() => import("@mui/icons-material/Speaker")),
  SpeakerGroup: React.lazy(() => import("@mui/icons-material/SpeakerGroup")),
  Cast: React.lazy(() => import("@mui/icons-material/Cast")),
  CastConnected: React.lazy(() => import("@mui/icons-material/CastConnected")),
  Tv: React.lazy(() => import("@mui/icons-material/Tv")),
  Computer: React.lazy(() => import("@mui/icons-material/Computer")),
  Laptop: React.lazy(() => import("@mui/icons-material/Laptop")),
  Tablet: React.lazy(() => import("@mui/icons-material/Tablet")),
  Phone: React.lazy(() => import("@mui/icons-material/Phone")),
  PhoneAndroid: React.lazy(() => import("@mui/icons-material/PhoneAndroid")),
  PhoneIphone: React.lazy(() => import("@mui/icons-material/PhoneIphone")),
  Watch: React.lazy(() => import("@mui/icons-material/Watch")),
  Devices: React.lazy(() => import("@mui/icons-material/Devices")),
  BatteryFull: React.lazy(() => import("@mui/icons-material/BatteryFull")),
  BatteryChargingFull: React.lazy(
    () => import("@mui/icons-material/BatteryChargingFull")
  ),
  BatteryAlert: React.lazy(() => import("@mui/icons-material/BatteryAlert")),
  SignalCellular4Bar: React.lazy(
    () => import("@mui/icons-material/SignalCellular4Bar")
  ),
  SignalWifi4Bar: React.lazy(
    () => import("@mui/icons-material/SignalWifi4Bar")
  ),
  Wifi: React.lazy(() => import("@mui/icons-material/Wifi")),
  Bluetooth: React.lazy(() => import("@mui/icons-material/Bluetooth")),
  LocationOn: React.lazy(() => import("@mui/icons-material/LocationOn")),
  LocationOff: React.lazy(() => import("@mui/icons-material/LocationOff")),
  Map: React.lazy(() => import("@mui/icons-material/Map")),
  Place: React.lazy(() => import("@mui/icons-material/Place")),
  Directions: React.lazy(() => import("@mui/icons-material/Directions")),
  Navigation: React.lazy(() => import("@mui/icons-material/Navigation")),
  Explore: React.lazy(() => import("@mui/icons-material/Explore")),
  MyLocation: React.lazy(() => import("@mui/icons-material/MyLocation")),
  HomeWork: React.lazy(() => import("@mui/icons-material/HomeWork")),
  Business: React.lazy(() => import("@mui/icons-material/Business")),
  School: React.lazy(() => import("@mui/icons-material/School")),
  LocalHospital: React.lazy(() => import("@mui/icons-material/LocalHospital")),
  LocalPharmacy: React.lazy(() => import("@mui/icons-material/LocalPharmacy")),
  LocalGroceryStore: React.lazy(
    () => import("@mui/icons-material/LocalGroceryStore")
  ),
  LocalCafe: React.lazy(() => import("@mui/icons-material/LocalCafe")),
  LocalDining: React.lazy(() => import("@mui/icons-material/LocalDining")),
  LocalBar: React.lazy(() => import("@mui/icons-material/LocalBar")),
  LocalLibrary: React.lazy(() => import("@mui/icons-material/LocalLibrary")),
  LocalMall: React.lazy(() => import("@mui/icons-material/LocalMall")),
  LocalMovies: React.lazy(() => import("@mui/icons-material/LocalMovies")),
  LocalOffer: React.lazy(() => import("@mui/icons-material/LocalOffer")),
  LocalParking: React.lazy(() => import("@mui/icons-material/LocalParking")),
  LocalPlay: React.lazy(() => import("@mui/icons-material/LocalPlay")),
  LocalPostOffice: React.lazy(
    () => import("@mui/icons-material/LocalPostOffice")
  ),
  LocalPrintshop: React.lazy(
    () => import("@mui/icons-material/LocalPrintshop")
  ),
  LocalSee: React.lazy(() => import("@mui/icons-material/LocalSee")),
  LocalShipping: React.lazy(() => import("@mui/icons-material/LocalShipping")),
  LocalTaxi: React.lazy(() => import("@mui/icons-material/LocalTaxi")),
} as const;

export type IconNameType = keyof typeof iconMap;
export const iconNames = Object.keys(iconMap);

export function searchForIconNames(
  searchTerm: string,
  page: number = 1,
  limit: number = 16
): IconNameType[] {
  const filteredNames = iconNames.filter((name): name is IconNameType =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return filteredNames.slice(startIndex, endIndex);
}

export default iconMap;
