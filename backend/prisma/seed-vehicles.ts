import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🚗 SEED DE VEÍCULOS BRASILEIROS (1960 - ANO ATUAL)
 *
 * ✨ ATUALIZAÇÃO AUTOMÁTICA DE ANOS!
 * - Modelos novos (2015+): Ganham ano atual + 1 automaticamente
 * - Modelos antigos: Anos históricos fixos
 * - Não precisa editar todo ano!
 */

// ========== HELPER: GERAR ANOS AUTOMATICAMENTE ==========
const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

/**
 * Gera array de anos baseado no início e fim
 * @param startYear - Ano inicial
 * @param endYear - Ano final (se "current", usa ano atual + 1)
 */
function generateYears(
  startYear: number,
  endYear: number | "current",
): number[] {
  const end = endYear === "current" ? nextYear : endYear;
  const years: number[] = [];

  for (let year = startYear; year <= end; year++) {
    years.push(year);
  }

  return years;
}

/**
 * Gera anos espaçados para modelos antigos (ex: a cada 5 anos)
 */
function generateSpacedYears(
  startYear: number,
  endYear: number,
  interval: number = 5,
): number[] {
  const years: number[] = [];

  for (let year = startYear; year <= endYear; year += interval) {
    years.push(year);
  }

  // Sempre adicionar o último ano
  if (!years.includes(endYear)) {
    years.push(endYear);
  }

  return years;
}

// Marcas e seus modelos populares
const vehicleData = [
  // ========== CHEVROLET ==========
  {
    brand: "Chevrolet",
    models: [
      // Modelos históricos (anos fixos)
      {
        name: "Opala",
        years: generateSpacedYears(1968, 1992, 5),
        versions: ["Comodoro", "SS", "Diplomata"],
        engines: ["2.5", "4.1", "6.0"],
      },
      {
        name: "Chevette",
        years: generateSpacedYears(1973, 1993, 5),
        versions: ["SL", "DL", "Junior"],
        engines: ["1.4", "1.6"],
      },
      {
        name: "Monza",
        years: generateSpacedYears(1982, 1996, 3),
        versions: ["SL", "SR", "Classic"],
        engines: ["1.6", "1.8", "2.0"],
      },
      {
        name: "Kadett",
        years: generateSpacedYears(1989, 1998, 2),
        versions: ["GL", "GLS", "GSi"],
        engines: ["1.8", "2.0"],
      },
      {
        name: "Corsa",
        years: generateSpacedYears(1994, 2012, 2),
        versions: ["Wind", "GL", "Super"],
        engines: ["1.0", "1.4", "1.6"],
      },
      {
        name: "Celta",
        years: generateSpacedYears(2000, 2015, 2),
        versions: ["Life", "Spirit", "LT"],
        engines: ["1.0", "1.4"],
      },
      {
        name: "Classic",
        years: generateYears(2010, 2016),
        versions: ["LS", "LT", "LTZ"],
        engines: ["1.0", "1.4"],
      },

      // Modelos atuais (anos até atual + 1)
      {
        name: "Prisma",
        years: generateYears(2013, "current"),
        versions: ["LT", "LTZ", "Premier"],
        engines: ["1.0", "1.4"],
      },
      {
        name: "Onix",
        years: generateYears(2012, "current"),
        versions: ["Joy", "LT", "LTZ", "Premier"],
        engines: ["1.0", "1.0 Turbo"],
      },
      {
        name: "Cruze",
        years: generateYears(2011, 2020),
        versions: ["LT", "LTZ", "Premier"],
        engines: ["1.4 Turbo", "1.8"],
      },
      {
        name: "S10",
        years: generateYears(2012, "current"),
        versions: ["LS", "LT", "LTZ", "High Country"],
        engines: ["2.4", "2.5", "2.8 Diesel"],
      },
      {
        name: "Tracker",
        years: generateYears(2013, "current"),
        versions: ["LT", "LTZ", "Premier"],
        engines: ["1.0 Turbo", "1.2 Turbo"],
      },
      {
        name: "Spin",
        years: generateYears(2012, 2020),
        versions: ["LT", "LTZ", "Activ"],
        engines: ["1.8"],
      },
      {
        name: "Montana",
        years: generateYears(2020, "current"),
        versions: ["LS", "LT", "Premier"],
        engines: ["1.4", "1.5"],
      },
    ],
  },

  // ========== FIAT ==========
  {
    brand: "Fiat",
    models: [
      // Históricos
      {
        name: "147",
        years: generateSpacedYears(1976, 1987, 3),
        versions: ["C", "CL", "GL"],
        engines: ["1.0", "1.3", "1.5"],
      },
      {
        name: "Uno",
        years: generateSpacedYears(1984, 2013, 3),
        versions: ["Mille", "CS", "SX", "Way"],
        engines: ["1.0", "1.3", "1.5"],
      },
      {
        name: "Tipo",
        years: generateYears(1993, 1997),
        versions: ["SLX", "1.6 ie"],
        engines: ["1.6", "2.0"],
      },
      {
        name: "Tempra",
        years: generateYears(1991, 1998),
        versions: ["SX", "SW"],
        engines: ["2.0", "2.0 Turbo"],
      },
      {
        name: "Palio",
        years: generateSpacedYears(1996, 2017, 2),
        versions: ["EX", "ELX", "Fire"],
        engines: ["1.0", "1.3", "1.5", "1.8"],
      },
      {
        name: "Siena",
        years: generateSpacedYears(1997, 2018, 2),
        versions: ["EL", "ELX", "Essence"],
        engines: ["1.0", "1.4", "1.6"],
      },
      {
        name: "Punto",
        years: generateSpacedYears(2007, 2017, 2),
        versions: ["ELX", "Essence", "T-Jet"],
        engines: ["1.4", "1.6", "1.8"],
      },
      {
        name: "Linea",
        years: generateYears(2008, 2016),
        versions: ["LX", "Essence", "Absolute"],
        engines: ["1.8", "1.9 Turbo Diesel"],
      },
      {
        name: "Bravo",
        years: generateYears(2010, 2016),
        versions: ["Essence", "Sporting", "Blackmotion"],
        engines: ["1.8", "1.4 Turbo"],
      },

      // Atuais
      {
        name: "Strada",
        years: generateYears(2020, "current"),
        versions: ["Working", "Endurance", "Volcano"],
        engines: ["1.3", "1.4", "1.6"],
      },
      {
        name: "Argo",
        years: generateYears(2017, "current"),
        versions: ["Drive", "HGT", "Trekking"],
        engines: ["1.0", "1.3", "1.8"],
      },
      {
        name: "Cronos",
        years: generateYears(2018, "current"),
        versions: ["Drive", "Precision", "HGT"],
        engines: ["1.3", "1.8"],
      },
      {
        name: "Toro",
        years: generateYears(2016, "current"),
        versions: ["Freedom", "Volcano", "Ranch"],
        engines: ["1.8", "2.0 Diesel", "2.4"],
      },
      {
        name: "Mobi",
        years: generateYears(2016, "current"),
        versions: ["Easy", "Like", "Trekking"],
        engines: ["1.0"],
      },
      {
        name: "Fiorino",
        years: generateYears(2016, "current"),
        versions: ["Working", "Furgão"],
        engines: ["1.3", "1.4"],
      },
      {
        name: "Pulse",
        years: generateYears(2022, "current"),
        versions: ["Drive", "Impetus"],
        engines: ["1.0 Turbo", "1.3"],
      },
      {
        name: "Fastback",
        years: generateYears(2022, "current"),
        versions: ["Audace", "Impetus"],
        engines: ["1.0 Turbo", "1.3"],
      },
    ],
  },

  // ========== FORD ==========
  {
    brand: "Ford",
    models: [
      // Históricos
      {
        name: "Corcel",
        years: generateSpacedYears(1968, 1985, 5),
        versions: ["Luxo", "GT", "L"],
        engines: ["1.3", "1.4", "1.6"],
      },
      {
        name: "Maverick",
        years: generateYears(1973, 1980),
        versions: ["Super Luxo", "GT"],
        engines: ["2.3", "4.9", "5.0"],
      },
      {
        name: "Del Rey",
        years: generateYears(1981, 1991),
        versions: ["L", "GL", "Ghia"],
        engines: ["1.6", "1.8"],
      },
      {
        name: "Escort",
        years: generateSpacedYears(1983, 2002, 3),
        versions: ["L", "GL", "Ghia", "XR3"],
        engines: ["1.6", "1.8", "2.0"],
      },
      {
        name: "Verona",
        years: generateYears(1989, 1995),
        versions: ["LX", "GLX"],
        engines: ["1.8", "2.0"],
      },
      {
        name: "Fiesta",
        years: generateSpacedYears(1996, 2018, 2),
        versions: ["Street", "SE", "Titanium"],
        engines: ["1.0", "1.5", "1.6"],
      },
      {
        name: "Ka",
        years: generateSpacedYears(1997, 2020, 2),
        versions: ["GL", "SE", "SEL"],
        engines: ["1.0", "1.5"],
      },
      {
        name: "Focus",
        years: generateSpacedYears(2000, 2017, 2),
        versions: ["GL", "GLX", "Titanium"],
        engines: ["1.6", "2.0"],
      },
      {
        name: "Fusion",
        years: generateYears(2006, 2016),
        versions: ["SEL", "Titanium"],
        engines: ["2.0", "2.5", "2.0 EcoBoost"],
      },
      {
        name: "EcoSport",
        years: generateSpacedYears(2003, 2021, 2),
        versions: ["XLS", "Freestyle", "Titanium"],
        engines: ["1.5", "1.6", "2.0"],
      },

      // Atuais (obs: Ford saiu do Brasil em 2021, mas Ranger continua)
      {
        name: "Ranger",
        years: generateYears(2012, "current"),
        versions: ["XL", "XLS", "Limited"],
        engines: ["2.3", "2.5", "3.2 Diesel"],
      },
      {
        name: "F-250",
        years: generateYears(2018, "current"),
        versions: ["XL", "XLT"],
        engines: ["4.2", "3.9 Diesel"],
      },
    ],
  },

  // ========== VOLKSWAGEN ==========
  {
    brand: "Volkswagen",
    models: [
      // Históricos
      {
        name: "Fusca",
        years: generateSpacedYears(1960, 1986, 5),
        versions: ["1200", "1300", "1500"],
        engines: ["1.2", "1.3", "1.5", "1.6"],
      },
      {
        name: "Brasília",
        years: generateYears(1973, 1982),
        versions: ["LS"],
        engines: ["1.6"],
      },
      {
        name: "Kombi",
        years: generateSpacedYears(1960, 2013, 10),
        versions: ["Standard", "Lotação", "Furgão"],
        engines: ["1.4", "1.6"],
      },
      {
        name: "Gol",
        years: generateSpacedYears(1980, 2023, 3),
        versions: ["CL", "GL", "GTi", "Comfortline"],
        engines: ["1.0", "1.6", "1.8", "2.0"],
      },
      {
        name: "Voyage",
        years: generateSpacedYears(1981, 2023, 3),
        versions: ["CL", "GL", "Comfortline"],
        engines: ["1.0", "1.6"],
      },
      {
        name: "Parati",
        years: generateSpacedYears(1982, 2012, 3),
        versions: ["CL", "GL", "Surf"],
        engines: ["1.6", "1.8", "2.0"],
      },
      {
        name: "Santana",
        years: generateSpacedYears(1984, 2006, 3),
        versions: ["CL", "CD", "Quantum"],
        engines: ["1.8", "2.0"],
      },
      {
        name: "Polo",
        years: generateSpacedYears(2002, 2024, 2),
        versions: ["Bluemotion", "Comfortline", "Highline"],
        engines: ["1.0", "1.6"],
      },
      {
        name: "Fox",
        years: generateSpacedYears(2003, 2020, 2),
        versions: ["Route", "Connect", "Xtreme"],
        engines: ["1.0", "1.6"],
      },
      {
        name: "CrossFox",
        years: generateYears(2005, 2017),
        versions: ["Highline"],
        engines: ["1.6"],
      },
      {
        name: "SpaceFox",
        years: generateYears(2005, 2017),
        versions: ["Comfortline", "Highline"],
        engines: ["1.6"],
      },
      {
        name: "Up",
        years: generateYears(2014, 2020),
        versions: ["Take", "Move", "Cross"],
        engines: ["1.0"],
      },

      // Atuais
      {
        name: "Saveiro",
        years: generateYears(2016, "current"),
        versions: ["Robust", "Trendline", "Cross"],
        engines: ["1.6"],
      },
      {
        name: "Amarok",
        years: generateYears(2010, "current"),
        versions: ["Trendline", "Highline", "Extreme"],
        engines: ["2.0 Diesel"],
      },
      {
        name: "T-Cross",
        years: generateYears(2019, "current"),
        versions: ["Sense", "Comfortline", "Highline"],
        engines: ["1.0 TSI", "1.4 TSI"],
      },
      {
        name: "Nivus",
        years: generateYears(2020, "current"),
        versions: ["Comfortline", "Highline"],
        engines: ["1.0 TSI"],
      },
      {
        name: "Virtus",
        years: generateYears(2018, "current"),
        versions: ["Comfortline", "Highline", "GTS"],
        engines: ["1.0 TSI", "1.4 TSI"],
      },
      {
        name: "Taos",
        years: generateYears(2021, "current"),
        versions: ["Comfortline", "Highline"],
        engines: ["1.4 TSI"],
      },
    ],
  },

  // ========== TOYOTA ==========
  {
    brand: "Toyota",
    models: [
      {
        name: "Bandeirante",
        years: generateSpacedYears(1960, 2001, 10),
        versions: ["Jipe", "Pick-up"],
        engines: ["3.7 Diesel", "4.0 Diesel"],
      },
      {
        name: "Corolla",
        years: generateYears(2014, "current"),
        versions: ["XEi", "GLi", "Altis"],
        engines: ["1.6", "1.8", "2.0"],
      },
      {
        name: "Hilux",
        years: generateYears(2015, "current"),
        versions: ["SR", "SRV", "SRX"],
        engines: ["2.7", "2.8 Diesel"],
      },
      {
        name: "SW4",
        years: generateYears(2015, "current"),
        versions: ["SR", "SRV", "Diamond"],
        engines: ["2.7", "2.8 Diesel"],
      },
      {
        name: "Yaris",
        years: generateYears(2018, "current"),
        versions: ["XL", "XLS", "XS"],
        engines: ["1.3", "1.5"],
      },
      {
        name: "Camry",
        years: generateYears(2018, "current"),
        versions: ["XLE"],
        engines: ["2.5", "3.5"],
      },
      {
        name: "RAV4",
        years: generateYears(2019, "current"),
        versions: ["4x4", "Hybrid"],
        engines: ["2.0", "2.5 Hybrid"],
      },
      {
        name: "Corolla Cross",
        years: generateYears(2021, "current"),
        versions: ["XR", "XRE", "XRV"],
        engines: ["2.0"],
      },
    ],
  },

  // ========== HONDA ==========
  {
    brand: "Honda",
    models: [
      {
        name: "Civic",
        years: generateYears(2016, "current"),
        versions: ["LX", "EX", "Touring"],
        engines: ["1.5 Turbo", "2.0"],
      },
      {
        name: "Fit",
        years: generateYears(2014, 2023),
        versions: ["LX", "EX", "EXL"],
        engines: ["1.5"],
      },
      {
        name: "City",
        years: generateYears(2020, "current"),
        versions: ["LX", "EX", "Touring"],
        engines: ["1.5"],
      },
      {
        name: "HR-V",
        years: generateYears(2015, "current"),
        versions: ["LX", "EX", "Touring"],
        engines: ["1.5 Turbo", "1.8"],
      },
      {
        name: "CR-V",
        years: generateYears(2017, "current"),
        versions: ["LX", "EX", "Touring"],
        engines: ["1.5 Turbo", "2.0"],
      },
      {
        name: "WR-V",
        years: generateYears(2017, 2023),
        versions: ["LX", "EX"],
        engines: ["1.5"],
      },
      {
        name: "ZR-V",
        years: generateYears(2023, "current"),
        versions: ["LX", "EX", "Touring"],
        engines: ["1.5 Turbo"],
      },
    ],
  },

  // ========== NISSAN ==========
  {
    brand: "Nissan",
    models: [
      {
        name: "Versa",
        years: generateYears(2020, "current"),
        versions: ["SV", "Unique", "Exclusive"],
        engines: ["1.0 Turbo", "1.6"],
      },
      {
        name: "Kicks",
        years: generateYears(2016, "current"),
        versions: ["S", "SV", "Exclusive"],
        engines: ["1.6"],
      },
      {
        name: "Frontier",
        years: generateYears(2016, "current"),
        versions: ["SE", "SV", "LE"],
        engines: ["2.3", "2.5 Diesel"],
      },
    ],
  },

  // ========== HYUNDAI ==========
  {
    brand: "Hyundai",
    models: [
      {
        name: "HB20",
        years: generateYears(2019, "current"),
        versions: ["Sense", "Vision", "Diamond"],
        engines: ["1.0", "1.0 Turbo"],
      },
      {
        name: "HB20S",
        years: generateYears(2019, "current"),
        versions: ["Sense", "Vision", "Diamond"],
        engines: ["1.0", "1.0 Turbo"],
      },
      {
        name: "Creta",
        years: generateYears(2016, "current"),
        versions: ["Smart", "Pulse", "Ultimate"],
        engines: ["1.6", "2.0"],
      },
      {
        name: "Tucson",
        years: generateYears(2021, "current"),
        versions: ["GLS", "Limited"],
        engines: ["1.6 Turbo", "2.0"],
      },
      {
        name: "Santa Fe",
        years: generateYears(2018, "current"),
        versions: ["GLS"],
        engines: ["2.4", "3.3"],
      },
      {
        name: "i30",
        years: generateYears(2017, 2021),
        versions: ["GLS"],
        engines: ["1.6", "2.0"],
      },
    ],
  },

  // ========== RENAULT ==========
  {
    brand: "Renault",
    models: [
      {
        name: "Sandero",
        years: generateYears(2019, "current"),
        versions: ["Authentique", "Expression", "Stepway"],
        engines: ["1.0", "1.6"],
      },
      {
        name: "Logan",
        years: generateYears(2019, "current"),
        versions: ["Authentique", "Expression"],
        engines: ["1.0", "1.6"],
      },
      {
        name: "Duster",
        years: generateYears(2020, "current"),
        versions: ["Expression", "Dynamique", "Iconic"],
        engines: ["1.6", "2.0"],
      },
      {
        name: "Captur",
        years: generateYears(2020, "current"),
        versions: ["Zen", "Intense", "Bose"],
        engines: ["1.6", "2.0"],
      },
      {
        name: "Kwid",
        years: generateYears(2017, "current"),
        versions: ["Zen", "Intense", "Outsider"],
        engines: ["1.0"],
      },
      {
        name: "Kardian",
        years: generateYears(2023, "current"),
        versions: ["Zen", "Intense"],
        engines: ["1.0 Turbo"],
      },
    ],
  },

  // ========== JEEP ==========
  {
    brand: "Jeep",
    models: [
      {
        name: "Renegade",
        years: generateYears(2015, "current"),
        versions: ["Sport", "Longitude", "Limited"],
        engines: ["1.8", "2.0 Diesel"],
      },
      {
        name: "Compass",
        years: generateYears(2017, "current"),
        versions: ["Sport", "Longitude", "Limited"],
        engines: ["1.3 Turbo", "2.0 Diesel"],
      },
      {
        name: "Commander",
        years: generateYears(2021, "current"),
        versions: ["Sport", "Longitude", "Limited"],
        engines: ["1.3 Turbo", "2.0 Diesel"],
      },
      {
        name: "Wrangler",
        years: generateYears(2018, "current"),
        versions: ["Sport", "Sahara", "Rubicon"],
        engines: ["2.0 Turbo", "3.6"],
      },
      {
        name: "Grand Cherokee",
        years: generateYears(2021, "current"),
        versions: ["Laredo", "Limited"],
        engines: ["3.0 Diesel", "3.6"],
      },
    ],
  },

  // ========== PEUGEOT ==========
  {
    brand: "Peugeot",
    models: [
      {
        name: "208",
        years: generateYears(2019, "current"),
        versions: ["Active", "Allure", "GT"],
        engines: ["1.2", "1.6"],
      },
      {
        name: "2008",
        years: generateYears(2019, "current"),
        versions: ["Active", "Allure", "GT"],
        engines: ["1.2", "1.6"],
      },
      {
        name: "3008",
        years: generateYears(2017, "current"),
        versions: ["Allure", "Griffe"],
        engines: ["1.6 Turbo"],
      },
    ],
  },

  // ========== CITROËN ==========
  {
    brand: "Citroën",
    models: [
      {
        name: "C3",
        years: generateYears(2016, "current"),
        versions: ["Origin", "Shine"],
        engines: ["1.2", "1.6"],
      },
      {
        name: "C4 Cactus",
        years: generateYears(2018, "current"),
        versions: ["Live", "Feel", "Shine"],
        engines: ["1.6"],
      },
      {
        name: "Aircross",
        years: generateYears(2019, "current"),
        versions: ["Start", "Live", "Shine"],
        engines: ["1.6"],
      },
      {
        name: "Basalt",
        years: generateYears(2024, "current"),
        versions: ["Feel", "Shine"],
        engines: ["1.0 Turbo"],
      },
    ],
  },

  // ========== MITSUBISHI ==========
  {
    brand: "Mitsubishi",
    models: [
      {
        name: "L200",
        years: generateYears(2015, "current"),
        versions: ["GL", "GLX", "Triton"],
        engines: ["2.4 Diesel", "2.5 Diesel"],
      },
      {
        name: "Outlander",
        years: generateYears(2021, "current"),
        versions: ["GT"],
        engines: ["2.0", "2.4"],
      },
      {
        name: "Eclipse Cross",
        years: generateYears(2022, "current"),
        versions: ["HPE", "HPE-S"],
        engines: ["1.5 Turbo"],
      },
    ],
  },

  // ========== CAMINHÕES ==========
  {
    brand: "Mercedes-Benz",
    models: [
      {
        name: "Sprinter",
        years: generateYears(2018, "current"),
        versions: ["313", "415", "515"],
        engines: ["2.2 Diesel"],
      },
      {
        name: "Accelo",
        years: generateYears(2016, "current"),
        versions: ["715", "815", "1016"],
        engines: ["Diesel"],
      },
      {
        name: "Atego",
        years: generateYears(2015, "current"),
        versions: ["1718", "1726", "2426"],
        engines: ["Diesel"],
      },
      {
        name: "Axor",
        years: generateYears(2015, "current"),
        versions: ["2536", "2544"],
        engines: ["Diesel"],
      },
    ],
  },

  {
    brand: "Volvo",
    models: [
      {
        name: "FH",
        years: generateYears(2015, "current"),
        versions: ["FH 440", "FH 540"],
        engines: ["Diesel"],
      },
      {
        name: "FM",
        years: generateYears(2015, "current"),
        versions: ["FM 370", "FM 440"],
        engines: ["Diesel"],
      },
      {
        name: "VM",
        years: generateYears(2015, "current"),
        versions: ["VM 260", "VM 330"],
        engines: ["Diesel"],
      },
    ],
  },

  {
    brand: "Scania",
    models: [
      {
        name: "R-Series",
        years: generateYears(2015, "current"),
        versions: ["R 440", "R 500"],
        engines: ["Diesel"],
      },
      {
        name: "G-Series",
        years: generateYears(2015, "current"),
        versions: ["G 380", "G 420"],
        engines: ["Diesel"],
      },
      {
        name: "P-Series",
        years: generateYears(2015, "current"),
        versions: ["P 310", "P 360"],
        engines: ["Diesel"],
      },
    ],
  },

  {
    brand: "Iveco",
    models: [
      {
        name: "Daily",
        years: generateYears(2015, "current"),
        versions: ["35S14", "55C16", "70C16"],
        engines: ["Diesel"],
      },
      {
        name: "Tector",
        years: generateYears(2015, "current"),
        versions: ["170E22", "240E25"],
        engines: ["Diesel"],
      },
      {
        name: "Stralis",
        years: generateYears(2015, "current"),
        versions: ["380", "440", "570"],
        engines: ["Diesel"],
      },
    ],
  },
];

async function seedVehicles() {
  console.log("🚗 Iniciando seed de veículos...");
  console.log(`📅 Ano atual: ${currentYear}`);
  console.log(`📅 Gerando até: ${nextYear}`);

  let totalVehicles = 0;

  for (const brandData of vehicleData) {
    console.log(`\n📦 Processando marca: ${brandData.brand}`);

    for (const modelData of brandData.models) {
      for (const year of modelData.years) {
        // Para cada combinação de versão e motor
        if (modelData.versions && modelData.engines) {
          for (const version of modelData.versions) {
            for (const engine of modelData.engines) {
              await prisma.vehicle.create({
                data: {
                  brand: brandData.brand,
                  model: modelData.name,
                  year: year,
                  version: version,
                  engine: engine,
                  fuelType: engine.includes("Diesel") ? "Diesel" : "Flex",
                },
              });
              totalVehicles++;
            }
          }
        } else {
          // Veículo básico sem versão/motor
          await prisma.vehicle.create({
            data: {
              brand: brandData.brand,
              model: modelData.name,
              year: year,
              fuelType: "Flex",
            },
          });
          totalVehicles++;
        }
      }

      console.log(
        `  ✅ ${modelData.name}: ${modelData.years.length} anos (${Math.min(...modelData.years)}-${Math.max(...modelData.years)})`,
      );
    }
  }

  console.log(`\n✅ Seed de veículos concluído!`);
  console.log(`📊 Total de veículos criados: ${totalVehicles}`);
  console.log(`📅 Anos cobertos: 1960 - ${nextYear}`);
  console.log(`\n💡 ATUALIZAÇÃO AUTOMÁTICA:`);
  console.log(
    `   - Rode novamente em ${nextYear + 1} para adicionar ano ${nextYear + 1}`,
  );
  console.log(`   - Não precisa editar código!`);
}

async function main() {
  try {
    await seedVehicles();
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
