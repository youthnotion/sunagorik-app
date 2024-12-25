import arrowDown from "@/assets/icons/arrow-down.png";
import arrowUp from "@/assets/icons/arrow-up.png";
import backArrow from "@/assets/icons/back-arrow.png";
import chat from "@/assets/icons/chat.png";
import checkmark from "@/assets/icons/check.png";
import close from "@/assets/icons/close.png";
import dollar from "@/assets/icons/dollar.png";
import email from "@/assets/icons/email.png";
import eyecross from "@/assets/icons/eyecross.png";
import google from "@/assets/icons/google.png";
import home from "@/assets/icons/home.png";
import list from "@/assets/icons/list.png";
import lock from "@/assets/icons/lock.png";
import map from "@/assets/icons/map.png";
import out from "@/assets/icons/out.png";
import person from "@/assets/icons/person.png";
import pin from "@/assets/icons/pin.png";
import point from "@/assets/icons/point.png";
import profile from "@/assets/icons/profile.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";
import target from "@/assets/icons/target.png";
import to from "@/assets/icons/to.png";
import check from "@/assets/images/check.png";
import noResult from "@/assets/images/no-result.png";
import screen1 from "@/assets/images/screen1.png";
import screen2 from "@/assets/images/screen2.png";
import screen3 from "@/assets/images/screen3.png";
import signup from "@/assets/images/signup.jpeg";
import crimeHotspot from "@/assets/icons/crime-hotspot.png";
import drainageFailure from "@/assets/icons/drainage-failure.png";
import overpricedShop from "@/assets/icons/overpriced-shop.png";
import roadBlocking from "@/assets/icons/road-blocking.png";
import roadDamage from "@/assets/icons/road-damage.png";
import toilet from "@/assets/icons/toilet.png";
import tree from "@/assets/icons/tree.png";
import wasteMismanagement from "@/assets/icons/waste-mismanagement.png";
import waterSource from "@/assets/icons/water-source.png";
import loader from "@/assets/animations/loader.json";
import catLoading from "@/assets/animations/cat_loading.json";
import { CategoryOption } from "@/types/type";

export const images = {
  check,
  noResult,
  screen1,
  screen2,
  screen3,
  signup,
};

export const icons = {
  arrowDown,
  arrowUp,
  backArrow,
  chat,
  checkmark,
  close,
  dollar,
  email,
  eyecross,
  google,
  home,
  list,
  lock,
  map,
  out,
  person,
  pin,
  point,
  profile,
  search,
  star,
  target,
  to,
  crimeHotspot,
  drainageFailure,
  overpricedShop,
  roadBlocking,
  roadDamage,
  toilet,
  tree,
  wasteMismanagement,
  waterSource,
};

export const animations = {
  loader,
  catLoading,
};

export const onboarding = [
  {
    id: 1,
    image: images.screen1,
  },
  {
    id: 2,
    image: images.screen2,
  },
  {
    id: 3,
    image: images.screen3,
  },
];

export const data = {
  onboarding,
};

export const categories: CategoryOption[] = [
  {
    id: "crimeHotspot",
    title: "Crime Hotspot",
    image: crimeHotspot, // Adjust path as needed
  },
  {
    id: "draingeFailure",
    title: "Drainage Failure",
    image: drainageFailure,
  },
  {
    id: "overpricedShop",
    title: "Overpriced Grocery Shop",
    image: overpricedShop,
  },
  {
    id: "roadBlocking",
    title: "Illegal Road Blocking",
    image: roadBlocking,
  },
  {
    id: "roadDamage",
    title: "Road Damage",
    image: roadDamage,
  },
  {
    id: "tree",
    title: "Landmark Tree",
    image: tree,
  },
  {
    id: "wasteMismanagement",
    title: "Waste Mismanagement",
    image: wasteMismanagement,
  },
  {
    id: "waterSource",
    title: "Clean Water Source",
    image: waterSource,
  },
];

export const neighborhoods = [
  {
    id: 1,
    en: "Rashid Colony",
    bn: "রশিদ কলোনি",
  },
  {
    id: 2,
    en: "Fakirpur",
    bn: "ফকিরপুর",
  },
  {
    id: 3,
    en: "Maijdee Housing",
    bn: "মাইজদী হাউজিং",
  },
  {
    id: 4,
    en: "Lakshinarayanpur",
    bn: "লক্ষীনারায়ণপুর",
  },
  {
    id: 5,
    en: "Stadium Para",
    bn: "স্টেডিয়াম পাড়া",
  },
  {
    id: 6,
    en: "Khondokar Para",
    bn: "খন্দকার পাড়া",
  },
  {
    id: 7,
    en: "Bashundhara Colony",
    bn: "বসুন্ধরা কলোনি",
  },
  {
    id: 8,
    en: "Masterpara",
    bn: "মাস্টারপাড়া",
  },
  {
    id: 9,
    en: "Napiter Pool",
    bn: "নাপিতের পুল",
  },
  {
    id: 10,
    en: "Ukil Para",
    bn: "উকিল পাড়া",
  },
  {
    id: 11,
    en: "Harinarayanpur",
    bn: "হরিণারায়ণপুর",
  },
  {
    id: 12,
    en: "Alipur",
    bn: "আলিপুর",
  },
  {
    id: 13,
    en: "Maijdee Bazar",
    bn: "মাইজদী বাজার",
  },
  {
    id: 14,
    en: "Kazi Colony",
    bn: "কাজী কলোনি",
  },
  {
    id: 15,
    en: "Sultan Colony",
    bn: "সুলতান কলোনি",
  },
  {
    id: 16,
    en: "Guptank",
    bn: "গুপ্তাংক",
  },
  {
    id: 17,
    en: "Pashchim Alipur",
    bn: "পশ্চিম আলীপুর",
  },
  {
    id: 18,
    en: "Puratan Hospital Road",
    bn: "পুরাতন হাসপাতাল রোড",
  },
  {
    id: 19,
    en: "Uttar Fakirpur",
    bn: "উত্তর ফকিরপুর",
  },
  {
    id: 20,
    en: "Lawyer's Colony",
    bn: "ল ইয়ার্স কলোনি",
  },
  {
    id: 21,
    en: "Housing Estate",
    bn: "হাউজিং",
  },
  {
    id: 22,
    en: "Ashrampara",
    bn: "আশ্রমপাড়া",
  },
  {
    id: 23,
    en: "Miaji Para",
    bn: "মিয়াজী পাড়া",
  },
  {
    id: 24,
    en: "Patwari Para",
    bn: "পাটওয়ারী পাড়া",
  },
  {
    id: 25,
    en: "Adarsha School Mor",
    bn: "আদর্শ স্কুল মোড়",
  },
  {
    id: 26,
    en: "Kadir Hanif",
    bn: "কাদির হানিফ",
  },
  {
    id: 27,
    en: "Methor Quarter",
    bn: "মেথর কোয়ার্টার",
  },
  {
    id: 28,
    en: "Madhusudanpur/Madhupur",
    bn: "মধুসূদনপুর/মধুপুর",
  },
  {
    id: 29,
    en: "Ambikanagar",
    bn: "অম্বিকানগর",
  },
  {
    id: 30,
    en: "Baridhara Abasik",
    bn: "বারিধারা আবাসিক",
  },
  {
    id: 31,
    en: "Ekhlaspur",
    bn: "এক্লাসপুর",
  },
  {
    id: 32,
    en: "Haji Bari",
    bn: "হাজি বাড়ি",
  },
  {
    id: 33,
    en: "Puratan College Road",
    bn: "পুরাতন কলেজ রোড",
  },
  {
    id: 34,
    en: "Police Line Road",
    bn: "পুলিশলাইন রোড",
  },
  {
    id: 35,
    en: "Jail Road",
    bn: "জেল রোড",
  },
  {
    id: 36,
    en: "Court Station",
    bn: "কোট স্টেশন",
  },
  {
    id: 37,
    en: "Muktijoddha Colony",
    bn: "মুক্তিযোদ্ধা কলোনি",
  },
  {
    id: 38,
    en: "Muslim Colony",
    bn: "মুসলিম কলোনি",
  },
  {
    id: 39,
    en: "Cinemahal Pichone",
    bn: "সিনেমাহল পেছনে",
  },
  {
    id: 40,
    en: "Raja Raybahadur Bari",
    bn: "রাজা রায়বাহাদুর বাড়ী",
  },
  {
    id: 41,
    en: "Dargabari",
    bn: "দরগাবাড়ি",
  },
  {
    id: 42,
    en: "Bakshi Miaji Bari",
    bn: "বকশি মিয়াজি বাড়ি",
  },
  {
    id: 43,
    en: "Al Falah Area",
    bn: "আল ফালাহ এরিয়া",
  },
  {
    id: 44,
    en: "Noakhali Uchcha Bidyalayer Paschim-Dokkhin",
    bn: "নোয়াখালী উচ্চ বিদ্যায়লের পশ্চিম-দক্ষিণে",
  },
  {
    id: 45,
    en: "Miji Bari",
    bn: "মিজি বাড়ি",
  },
  {
    id: 46,
    en: "Kanugazi Para",
    bn: "কানুগাজী পাড়া",
  },
  {
    id: 47,
    en: "Shripur",
    bn: "শ্রীপুর",
  },
  {
    id: 48,
    en: "Jaykrishnapur",
    bn: "জয়কৃষ্ণপুর",
  },
  {
    id: 49,
    en: "Chhabid Mia Road",
    bn: "ছাবিদ মিয়া রোড",
  },
  {
    id: 50,
    en: "Shomwita Hospitaler Goli",
    bn: "শমৱিতা হসপিটালেৱ গলি",
  },
  {
    id: 51,
    en: "Thakurpara",
    bn: "ঠাকুরপাড়া",
  },
  {
    id: 52,
    en: "Satani Pukur Par",
    bn: "সাতানী পুকুর পাড়",
  },
  {
    id: 53,
    en: "Dargah Bari",
    bn: "দরগাহ বাড়ি",
  },
  {
    id: 54,
    en: "Noajpur",
    bn: "নয়াজপুর",
  },
  {
    id: 55,
    en: "Haji Kazim Uddin Road",
    bn: "হাজী কাজিম উদ্দিন রোড",
  },
  {
    id: 56,
    en: "Meji Bari",
    bn: "মেজি বাড়ি",
  },
  {
    id: 57,
    en: "Sonapur",
    bn: "সোনাপুর",
  },
  {
    id: 58,
    en: "Mohanganj",
    bn: "মোহনগঞ্জ",
  },
  {
    id: 59,
    en: "Kamgazi",
    bn: "কামগাজি",
  },
  {
    id: 60,
    en: "Harinarayanpur Schooler Pashe",
    bn: "হরিনারায়নপুর স্কুলের পাশে",
  },
];
