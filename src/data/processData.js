import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvContent = fs.readFileSync(path.join(__dirname, "dataset.csv"), "utf-8");
const lines = csvContent.trim().split("\n");
const headers = lines[0].split(",").map(h => h.trim());

const STATE_MAPPINGS = {
  "Taj Mahal": "Uttar Pradesh",
  "Agra Fort": "Uttar Pradesh",
  "Fatehpur Sikri": "Uttar Pradesh",
  "Sikandra (Akbar's Tomb)": "Uttar Pradesh",
  "Red Fort": "Delhi",
  "Qutub Minar": "Delhi",
  "Humayun's Tomb": "Delhi",
  "Jama Masjid Delhi": "Delhi",
  "Purana Qila": "Delhi",
  "Khajuraho Group of Monuments": "Madhya Pradesh",
  "Sanchi Stupa": "Madhya Pradesh",
  "Gwalior Fort": "Madhya Pradesh",
  "Orchha Fort Complex": "Madhya Pradesh",
  "Mandu (Jahaz Mahal)": "Madhya Pradesh",
  "Bhimbetka Rock Shelters": "Madhya Pradesh",
  "Chanderi Fort": "Madhya Pradesh",
  "Amber Fort": "Rajasthan",
  "City Palace Udaipur": "Rajasthan",
  "Chittorgarh Fort": "Rajasthan",
  "Kumbhalgarh Fort": "Rajasthan",
  "Jaisalmer Fort": "Rajasthan",
  "Mehrangarh Fort": "Rajasthan",
  "Hawa Mahal": "Rajasthan",
  "Ranthambore Fort": "Rajasthan",
  "Junagarh Fort Bikaner": "Rajasthan",
  "Nagaur Fort": "Rajasthan",
  "Ranakpur Jain Temple": "Rajasthan",
  "Dilwara Temples": "Rajasthan",
  "Bharatpur Lohagarh Fort": "Rajasthan",
  "Deeg Palace": "Rajasthan",
  "Golconda Fort": "Telangana",
  "Charminar": "Telangana",
  "Qutb Shahi Tombs": "Telangana",
  "Warangal Fort": "Telangana",
  "Ramappa Temple": "Telangana",
  "Mysore Palace": "Karnataka",
  "Hampi (Virupaksha Temple Complex)": "Karnataka",
  "Belur Chennakeshava Temple": "Karnataka",
  "Halebidu Hoysaleswara Temple": "Karnataka",
  "Pattadakal Monuments": "Karnataka",
  "Badami Cave Temples": "Karnataka",
  "Aihole Temple Complex": "Karnataka",
  "Bidar Fort": "Karnataka",
  "Gol Gumbaz": "Karnataka",
  "Brihadeeswarar Temple Thanjavur": "Tamil Nadu",
  "Meenakshi Amman Temple": "Tamil Nadu",
  "Shore Temple Mahabalipuram": "Tamil Nadu",
  "Rock Fort Temple Tiruchirappalli": "Tamil Nadu",
  "Gingee Fort": "Tamil Nadu",
  "Fort St. George Chennai": "Tamil Nadu",
  "Airavatesvara Temple Darasuram": "Tamil Nadu",
  "Padmanabhapuram Palace": "Tamil Nadu",
  "Mattancherry Palace": "Kerala",
  "Bekal Fort": "Kerala",
  "Hill Palace Tripunithura": "Kerala",
  "Elephanta Caves": "Maharashtra",
  "Ajanta Caves": "Maharashtra",
  "Ellora Caves": "Maharashtra",
  "Gateway of India": "Maharashtra",
  "Chhatrapati Shivaji Maharaj Terminus": "Maharashtra",
  "Raigad Fort": "Maharashtra",
  "Shaniwar Wada": "Maharashtra",
  "Daulatabad Fort": "Maharashtra",
  "Basilica of Bom Jesus": "Goa",
  "Se Cathedral Goa": "Goa",
  "Fort Aguada": "Goa",
  "Rani ki Vav": "Gujarat",
  "Modhera Sun Temple": "Gujarat",
  "Champaner-Pavagadh Archaeological Park": "Gujarat",
  "Somnath Temple": "Gujarat",
  "Lakhota Fort": "Gujarat",
  "Junagadh Uparkot Fort": "Gujarat",
  "Adalaj Stepwell": "Gujarat",
  "Dholavira": "Gujarat",
  "Lothal": "Gujarat",
  "Konark Sun Temple": "Odisha",
  "Jagannath Temple Puri": "Odisha",
  "Lingaraj Temple": "Odisha",
  "Udayagiri and Khandagiri Caves": "Odisha",
  "Barabati Fort": "Odisha",
  "Victoria Memorial": "West Bengal",
  "Hazarduari Palace": "West Bengal",
  "Darjeeling Himalayan Railway (Ghum Station)": "West Bengal",
  "Mahabodhi Temple Bodh Gaya": "Bihar",
  "Nalanda Mahavihara Ruins": "Bihar",
  "Rajgir (Ajatashatru Fort ruins)": "Bihar",
  "Sher Shah Suri Tomb Sasaram": "Bihar",
  "Rock Garden Chandigarh": "Chandigarh",
  "Kangra Fort": "Himachal Pradesh",
  "Bhimakali Temple Sarahan": "Himachal Pradesh",
  "Leh Palace": "Ladakh",
  "Hemis Monastery": "Ladakh",
  "Thiksey Monastery": "Ladakh",
  "Alchi Monastery": "Ladakh",
  "Kamakhya Temple": "Assam",
  "Rang Ghar Sivasagar": "Assam",
  "Talatal Ghar": "Assam",
  "Tawang Monastery": "Arunachal Pradesh",
  "Rumtek Monastery": "Sikkim",
  "Sivasagar Sivadol": "Assam"
};

function determinePrimaryThreat(row) {
  if (parseFloat(row.flood_risk_score) >= 7.0) return "Severe Flood Inundation & Soil Saturation";
  if (parseFloat(row.air_quality_index) >= 150) return "High Air Pollution & Chemical Erosion";
  if (parseInt(row.seismic_zone_rating) >= 5) return "High Seismic & Tectonic Vulnerability";
  if (parseInt(row.extreme_weather_events_count) >= 3) return "Frequent Extreme Weather & Microclimate Shifts";
  if (parseInt(row.avg_daily_footfall) >= 15000) return "Intense Visitor Pressure & Structural Wear";
  if (parseFloat(row.distance_to_coast_km) <= 25) return "Coastal Saline Corrosion & Humidity";
  if (parseInt(row.vandalism_incidents_count) >= 3) return "Vandalism & Inadequate Perimeter Control";
  if (parseFloat(row.annual_rainfall_mm) >= 2500) return "Heavy Monsoon Dilution & Waterlogging";
  if (parseFloat(row.avg_temperature_c) >= 28 && parseFloat(row.temperature_variance) >= 10) return "Thermal Stress & Stone Spalling";
  return "General Environmental & Ageing Degradation";
}

function calculateScore(row, label) {
  const aqi = parseFloat(row.air_quality_index) || 50;
  const flood = parseFloat(row.flood_risk_score) || 0;
  const seismic = parseInt(row.seismic_zone_rating) || 2;
  const footfall = parseInt(row.avg_daily_footfall) || 2000;
  const weather = parseInt(row.extreme_weather_events_count) || 0;

  let base = 0;
  if (label === 0) {
    base = 15 + Math.round((aqi / 200) * 10 + flood * 1.2 + (footfall / 25000) * 5);
    return Math.min(38, Math.max(12, base));
  } else if (label === 1) {
    base = 42 + Math.round((aqi / 200) * 10 + flood * 1.1 + weather * 2);
    return Math.min(60, Math.max(40, base));
  } else if (label === 2) {
    base = 63 + Math.round((aqi / 200) * 8 + flood * 1.0 + (seismic - 2) * 2 + weather);
    return Math.min(80, Math.max(61, base));
  } else {
    base = 83 + Math.round((aqi / 250) * 6 + flood * 0.8 + (seismic - 2) * 2);
    return Math.min(98, Math.max(81, base));
  }
}

const sites = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const values = [];
  let current = "";
  let insideQuotes = false;
  
  for (let char of line) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  const row = {};
  headers.forEach((h, idx) => {
    row[h] = values[idx];
  });

  const labelNum = parseInt(row.condition_risk_label);
  let riskLevel = "Low";
  if (labelNum === 1) riskLevel = "Moderate";
  else if (labelNum === 2) riskLevel = "High";
  else if (labelNum === 3) riskLevel = "Critical";

  const score = calculateScore(row, labelNum);
  const primaryThreat = determinePrimaryThreat(row);
  const state = STATE_MAPPINGS[row.site_name] || "India";

  sites.push({
    id: row.site_id,
    name: row.site_name,
    locationName: row.site_name,
    state: state,
    lat: parseFloat(row.latitude),
    lng: parseFloat(row.longitude),
    riskScore: score,
    riskLevel: riskLevel,
    conditionLabel: labelNum,
    conditionLabelName: row.condition_risk_label_name,
    primaryThreat: primaryThreat,
    // Environmental Indicators
    avgTemp: parseFloat(row.avg_temperature_c),
    tempVariance: parseFloat(row.temperature_variance),
    humidity: parseFloat(row.humidity_pct),
    annualRainfall: parseFloat(row.annual_rainfall_mm),
    aqi: parseFloat(row.air_quality_index),
    pm25: parseFloat(row.pm25),
    pm10: parseFloat(row.pm10),
    so2: parseFloat(row.so2),
    no2: parseFloat(row.no2),
    extremeWeatherEvents: parseInt(row.extreme_weather_events_count),
    // Tourism & Crowd Indicators
    dailyFootfall: parseInt(row.avg_daily_footfall),
    annualVisitors: parseInt(row.annual_visitor_count),
    peakFootfall: parseInt(row.peak_season_footfall),
    visitorGrowthPct: parseFloat(row.visitor_growth_rate_pct),
    physicalContactAllowed: row.physical_contact_allowed === "1",
    crowdControlMeasures: row.crowd_control_measures,
    vandalismIncidents: parseInt(row.vandalism_incidents_count),
    // Geological / Spatial Indicators
    elevation: parseFloat(row.elevation_m),
    distanceToCoast: parseFloat(row.distance_to_coast_km),
    soilType: row.soil_type,
    floodZone: row.flood_zone_flag === "1",
    floodRiskScore: parseFloat(row.flood_risk_score),
    industrialProximityKm: parseFloat(row.proximity_to_industrial_area_km),
    vegetationCoverPct: parseFloat(row.vegetation_cover_pct),
    seismicZone: parseInt(row.seismic_zone_rating),
  });
}

const fileContent = `// ============================================================
//  Heritage Sites Master Dataset (100 Sites - SIH P4 ML Training)
//  Trained & Synchronized with Predictive Analytics Dataset
// ============================================================

export const RISK_LEVELS = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const RISK_COLORS = {
  Low: "#10B981",       // emerald-500
  Moderate: "#F59E0B",  // amber-500
  High: "#F97316",      // orange-500
  Critical: "#EF4444",  // red-500
};

export const RISK_BG = {
  Low: "#D1FAE5",
  Moderate: "#FEF3C7",
  High: "#FFEDD5",
  Critical: "#FEE2E2",
};

export const heritageSites = ${JSON.stringify(sites, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, "heritageSites.js"), fileContent, "utf-8");
console.log("Successfully processed " + sites.length + " heritage sites into heritageSites.js");
