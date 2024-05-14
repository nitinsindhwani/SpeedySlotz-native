// commonData.js
import DogGroomer from "../images/doggroomer.png";
import Dentist from "../images/dentist.png";
import Doctor from "../images/doctor.png";
import NailSpa from "../images/nailspa.png";
import LegalService from "../images/legalservice.png";
import Plumber from "../images/plumber.png";
import Electrician from "../images/electrician.png";
import PhysicalTherapist from "../images/physicaltherapist.png";
import Chiropractor from "../images/chiropractor.png";
import CleaningService from "../images/cleaningservice.png";
import HVAC from "../images/hvac.png";
import HairSalon from "../images/hairsalon.png";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Fontisto,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";

export const commonData = {};
const iconColor = "white";
const iconSize = 24;
export const categories = [
  {
    id: 1,
    name: "Pets",
    component: DogGroomer,
  },
  {
    id: 2,
    name: "Dentist",

    // component: <Dentist width={40} height={40} />
    component: Dentist,
  },
  { id: 3, name: "Doctor", component: Doctor },
  { id: 5, name: "Nail Spa", component: NailSpa },
  {
    id: 6,
    name: "Legal Service",
    component: LegalService,
  },
  { id: 7, name: "Plumber", component: Plumber },
  {
    id: 8,
    name: "Electrician",
    component: Electrician,
  },
  {
    id: 9,
    name: "Physical Therapist",
    component: PhysicalTherapist,
  },
  {
    id: 10,
    name: "Chiropractor",
    component: Chiropractor,
  },
  {
    id: 11,
    name: "Cleaning Service",
    component: CleaningService,
  },
  { id: 12, name: "HVAC", component: HVAC },
  {
    id: 13,
    name: "Hair Salon",
    component: HairSalon,
  },
  {
    id: 14,
    name: "Pet Hospotal",
    component: HairSalon,
  },
];
