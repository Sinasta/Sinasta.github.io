export const CONFIG = {
  IMAGE_PATH: 'images/',
  IMAGE_FORMAT: 'webp',
  SPLAT_PATH: './splats/',
  VIDEO_PATH: 'videos/',
  VIDEO_FORMAT: 'webm',
  DESKTOP_DURATION: 12000,
  MOBILE_PAN_DURATION: 8000,
  VIDEO_DURATION: 3000,
  PRELOAD_COUNT: 2
};

export const PROJECTS = [
//  { id: 25, title: "Griesplatz - Graz", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "90%", prize: null },
//  { id: 24, title: "Griesplatz - Graz", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "65%", prize: null },
  { id: 23, title: "LAGA - Sachsen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/11-saechsische-landesgartenschau-in-auerbachvogtl-und-rodewisch-freudenthal-2029-579379/prizegroup/1-preis-198597.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/landesgartenschau-sachsen", focusY: "70%", prize: 1 },
  { id: 22, title: "LAGA - Sachsen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/11-saechsische-landesgartenschau-in-auerbachvogtl-und-rodewisch-freudenthal-2029-579379/prizegroup/1-preis-198597.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/landesgartenschau-sachsen", focusY: "70%", prize: 1 },
  { id: 21, title: "Mathildenhöhe - Darmstadt", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-freiflaechen-am-informationszentrum-mathildenhoehe-in-darmstadt-634364/prizegroup/ein-1-preis-217143.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "85%", prize: 1 },
  { id: 20, title: "Mathildenhöhe - Darmstadt", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-freiflaechen-am-informationszentrum-mathildenhoehe-in-darmstadt-634364/prizegroup/ein-1-preis-217143.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "70%", prize: 1 },
  { id: 19, title: "Horb am Neckar", titleLink: "https://www.competitionline.com/de/news/ergebnisse/rueckbau-ortsdurchfahrt-und-neugestaltung-innenstadt-horb-am-neckar-562061/prizegroup/1-preis-zuschlag-192412.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/horb-am-neckar", focusY: "50%", prize: 1 },
//  { id: 18, title: "Alice-Salomon-Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "80%", prize: null },
  { id: 17, title: "Ernst-Abbe-Platz - Jena", titleLink: "https://www.competitionline.com/de/news/ergebnisse/klimaangepasste-platzgestaltung-ernst-abbe-platz-in-jena-592546/prizegroup/2-preis-202426.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/ernst-abbe-platz", focusY: "70%", prize: 2 },
  { id: 16, title: "Ernst-Abbe-Platz - Jena", titleLink: "https://www.competitionline.com/de/news/ergebnisse/klimaangepasste-platzgestaltung-ernst-abbe-platz-in-jena-592546/prizegroup/2-preis-202426.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/ernst-abbe-platz", focusY: "55%", prize: 2 },
  { id: 15, title: "Stahlwerkspark - Oberhausen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/gestaltung-stahlwerkspark-in-oberhausen-572729/prizegroup/anerkennung-193706.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/stahlwerkspark-oberhausen", focusY: "55%", prize: "recognition" },
  { id: 14, title: "Stahlwerkspark - Oberhausen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/gestaltung-stahlwerkspark-in-oberhausen-572729/prizegroup/anerkennung-193706.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/stahlwerkspark-oberhausen", focusY: "70%", prize: "recognition" },
  { id: 13, title: "Wilhelm-Leuschner-Platz - Leipzig", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/leipzig-leuschner", focusY: "20%", prize: null },
  { id: 12, title: "Wilhelm-Leuschner-Platz - Leipzig", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/leipzig-leuschner", focusY: "50%", prize: null },
  { id: 11, title: "Altmarkt - Duisburg", titleLink: "https://www.competitionline.com/de/news/ergebnisse/umgestaltung-altmarkt-alt-hamborn-in-duisburg-557619/prizegroup/3-preis-190478.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/alt-hamborn", focusY: "50%", prize: 3 },
  { id: 10, title: "Marktplatz - Vilseck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-marktplatz-vilseck-520308/prizegroup/anerkennung-176405.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/vilseck", focusY: "80%", prize: "recognition" },
  { id: 9, title: "Marktplatz - Vilseck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neugestaltung-marktplatz-vilseck-520308/prizegroup/anerkennung-176405.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/vilseck", focusY: "95%", prize: "recognition" },
  { id: 8, title: "Inklusives Quartier - Reutlingen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/quartiersentwicklung-konradsiedlung-in-regensburg-546558/prizegroup/3-preis-192170.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/rappertshofen", focusY: "70%", prize: 3 },
  { id: 7, title: "Inklusives Quartier - Reutlingen", titleLink: "https://www.competitionline.com/de/news/ergebnisse/quartiersentwicklung-konradsiedlung-in-regensburg-546558/prizegroup/3-preis-192170.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/rappertshofen", focusY: "70%", prize: 3 },
  { id: 6, title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "50%", prize: 2 },
  { id: 5, title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "40%", prize: 2 },
  { id: 4, title: "Brunnenquartier - Karben", titleLink: "https://www.competitionline.com/de/news/ergebnisse/freiraumplanerische-gestaltung-brunnenquartier-in-karben-517453/prizegroup/2-preis-175890.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/karben", focusY: "50%", prize: 2 },
  { id: 3, title: "Lausitzer Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/berlin", focusY: "80%", prize: null },
  { id: 2, title: "Lausitzer Platz - Berlin", titleLink: null, office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe/berlin", focusY: "55%", prize: null },
//  { id: 1, title: "Moisling - Lübeck", titleLink: "https://www.competitionline.com/de/news/ergebnisse/neubau-stadtteilhaus-moisling-in-luebeck-585323/prizegroup/3-preis-200457.html", office: "TDB Landschaft", officeLink: "https://www.tdb-berlin.de/wettbewerbe", focusY: "50%", prize: 3 }
];