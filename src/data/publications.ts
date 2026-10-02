/** Verified, editable bibliography snapshot. No build-time network requests. */
export type PublicationType = 'journal' | 'preprint' | 'conference' | 'thesis';
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  link: string;
  selected: boolean;
  type: PublicationType;
  journal?: string;
  volume?: string;
  articleNumber?: string;
  pages?: string;
  doi?: string;
  arxiv?: string;
  notes?: string;
  sourceUrls: string[];
  verifiedOn: string;
}

export const publicationSnapshot = {
  verifiedOn: '2026-10-02',
  scope: 'A verified bibliography snapshot: all 39 records linked to the matched INSPIRE author profile, plus an institutional light-curve paper, a computer-science thesis, and a recent arXiv manuscript. Journal articles, preprints, a conference paper and theses are labelled separately. Talks and unverified records are excluded.',
  authorProfile: 'https://inspirehep.net/authors/1039459',
  identity: 'E.O.Kahya.1 / ORCID 0000-0003-2760-7091',
};

export const publicationTypeLabels: Record<PublicationType, string> = {
  journal: 'Journal article', preprint: 'Preprint', conference: 'Conference paper', thesis: 'Thesis',
};

export const publications: Publication[] = [
  {
    "id": "inspire-3144795",
    "title": "Do equation of state parametrizations of dark energy faithfully capture the dynamics of the late universe?",
    "authors": [
      "Özgür Akarsu",
      "Maria Caruana",
      "Konstantinos F. Dialektopoulos",
      "Luis A. Escamilla",
      "Emre Onur Kahya",
      "Jackson Levi Said"
    ],
    "year": 2026,
    "link": "https://arxiv.org/abs/2604.12987",
    "selected": false,
    "type": "preprint",
    "sourceUrls": [
      "https://inspirehep.net/literature/3144795",
      "https://arxiv.org/abs/2604.12987"
    ],
    "verifiedOn": "2026-10-02",
    "arxiv": "2604.12987"
  },
  {
    "id": "satellite-collision-2026",
    "title": "Early Prediction of Satellite Collision Probability Using a Hybrid TCN-Transformer Model for a CDM-Based Conjunction Analysis Framework",
    "authors": [
      "Rabia Tüylek Tok",
      "Burak Yağlıoğlu",
      "Enes Dağ",
      "Emre Onur Kahya"
    ],
    "year": 2026,
    "link": "https://arxiv.org/abs/2609.13191",
    "selected": false,
    "type": "preprint",
    "arxiv": "2609.13191",
    "sourceUrls": [
      "https://arxiv.org/abs/2609.13191",
      "https://arxiv.org/html/2609.13191v1"
    ],
    "verifiedOn": "2026-10-02",
    "notes": "Public arXiv manuscript. The arXiv comments report acceptance at the 2026 AAS/AIAA Astrodynamics Specialist Conference; no journal publication is inferred."
  },
  {
    "id": "inspire-3117757",
    "title": "Hints of sign-changing scalar field energy density and a transient acceleration phase at z ∼ 2 from model-agnostic reconstructions",
    "authors": [
      "Özgür Akarsu",
      "Maria Caruana",
      "Konstantinos F. Dialektopoulos",
      "Luis A. Escamilla",
      "Emre Onur Kahya",
      "Jackson Levi Said"
    ],
    "year": 2026,
    "link": "https://arxiv.org/abs/2602.08928",
    "selected": false,
    "type": "preprint",
    "sourceUrls": [
      "https://inspirehep.net/literature/3117757",
      "https://arxiv.org/abs/2602.08928"
    ],
    "verifiedOn": "2026-10-02",
    "arxiv": "2602.08928"
  },
  {
    "id": "inspire-3149343",
    "title": "Stationary solutions in the small-c expansion of GR",
    "authors": [
      "Enes Bal",
      "Ertuğrul Ekiz",
      "Emre Onur Kahya",
      "Utku Zorba"
    ],
    "year": 2026,
    "link": "https://arxiv.org/abs/2604.23677",
    "selected": false,
    "type": "preprint",
    "sourceUrls": [
      "https://inspirehep.net/literature/3149343",
      "https://arxiv.org/abs/2604.23677"
    ],
    "verifiedOn": "2026-10-02",
    "arxiv": "2604.23677"
  },
  {
    "id": "inspire-2878317",
    "title": "Quantization of Carrollian fermions",
    "authors": [
      "Ertuğrul Ekiz",
      "Emre Onur Kahya",
      "Utku Zorba"
    ],
    "year": 2025,
    "link": "https://doi.org/10.1103/PhysRevD.111.105019",
    "selected": true,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/2878317",
      "https://doi.org/10.1103/PhysRevD.111.105019",
      "https://arxiv.org/abs/2502.05645"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "111",
    "articleNumber": "105019",
    "doi": "10.1103/PhysRevD.111.105019",
    "arxiv": "2502.05645"
  },
  {
    "id": "inspire-2907383",
    "title": "The CosmoVerse White Paper: Addressing observational tensions in cosmology with systematics and fundamental physics",
    "authors": [
      "The CosmoVerse Network (including Emre Onur Kahya)"
    ],
    "year": 2025,
    "link": "https://doi.org/10.1016/j.dark.2025.101965",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/2907383",
      "https://doi.org/10.1016/j.dark.2025.101965",
      "https://arxiv.org/abs/2504.01669"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physics of the Dark Universe",
    "volume": "49",
    "articleNumber": "101965",
    "doi": "10.1016/j.dark.2025.101965",
    "arxiv": "2504.01669",
    "notes": "Collective author credit; the linked record lists the individual authors."
  },
  {
    "id": "inspire-2842587",
    "title": "Holographic boundary conformal field theory within Horndeski gravity",
    "authors": [
      "Fabiano F. Santos",
      "Behnam Pourhassan",
      "Emmanuel N. Saridakis",
      "Oleksii Sokoliuk",
      "Alexander Baransky",
      "Emre Onur Kahya"
    ],
    "year": 2024,
    "link": "https://doi.org/10.1007/JHEP12(2024)217",
    "selected": true,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/2842587",
      "https://doi.org/10.1007/JHEP12(2024)217",
      "https://arxiv.org/abs/2410.18781"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Journal of High Energy Physics",
    "volume": "2024",
    "articleNumber": "217",
    "doi": "10.1007/JHEP12(2024)217",
    "arxiv": "2410.18781"
  },
  {
    "id": "light-curves-2021",
    "title": "On the Classification and Feature Relevance of Multiband Light Curves",
    "authors": [
      "Fatma Kuzey Edes-Huyal",
      "Zehra Cataltepe",
      "Emre Onur Kahya"
    ],
    "year": 2021,
    "link": "https://doi.org/10.3847/1538-3881/abdecf",
    "selected": true,
    "type": "journal",
    "journal": "The Astronomical Journal",
    "volume": "161",
    "articleNumber": "168",
    "doi": "10.3847/1538-3881/abdecf",
    "sourceUrls": [
      "https://research.itu.edu.tr/en/publications/on-the-classification-and-feature-relevance-of-multiband-light-cu/",
      "https://doi.org/10.3847/1538-3881/abdecf"
    ],
    "verifiedOn": "2026-10-02"
  },
  {
    "id": "electron-identification-2020",
    "title": "Identifying electrons with deep learning methods",
    "authors": [
      "Emre Onur Kahya"
    ],
    "year": 2020,
    "link": "https://doi.org/10.71781/10723",
    "selected": false,
    "type": "thesis",
    "doi": "10.71781/10723",
    "sourceUrls": [
      "https://doi.org/10.71781/10723",
      "https://api.datacite.org/dois/10.71781/10723",
      "https://orcid.org/0000-0003-2760-7091"
    ],
    "verifiedOn": "2026-10-02",
    "notes": "M.Sc. thesis, Université de Montréal; thesis year 2020 in DataCite and the institutional repository."
  },
  {
    "id": "inspire-1768430",
    "title": "Superconformal generalizations of auxiliary vector modified polynomial f(R) theories",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya",
      "Nese Ozdemir",
      "Mehmet Ozkan",
      "Utku Zorba"
    ],
    "year": 2020,
    "link": "https://doi.org/10.1088/1475-7516/2020/04/005",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1768430",
      "https://doi.org/10.1088/1475-7516/2020/04/005",
      "https://arxiv.org/abs/1912.01919"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Journal of Cosmology and Astroparticle Physics",
    "volume": "04",
    "articleNumber": "005",
    "doi": "10.1088/1475-7516/2020/04/005",
    "arxiv": "1912.01919"
  },
  {
    "id": "inspire-1682331",
    "title": "Constraints on differential Shapiro delay between neutrinos and photons from IceCube-170922A",
    "authors": [
      "Sibel Boran",
      "Shantanu Desai",
      "Emre Onur Kahya"
    ],
    "year": 2019,
    "link": "https://doi.org/10.1140/epjc/s10052-019-6695-6",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1682331",
      "https://doi.org/10.1140/epjc/s10052-019-6695-6",
      "https://arxiv.org/abs/1807.05201"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "The European Physical Journal C",
    "volume": "79",
    "articleNumber": "185",
    "doi": "10.1140/epjc/s10052-019-6695-6",
    "arxiv": "1807.05201"
  },
  {
    "id": "inspire-1502315",
    "title": "Galactic Shapiro delay to the Crab pulsar and limit on weak equivalence principle violation",
    "authors": [
      "Shantanu Desai",
      "Emre Onur Kahya"
    ],
    "year": 2018,
    "link": "https://doi.org/10.1140/epjc/s10052-018-5571-0",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1502315",
      "https://doi.org/10.1140/epjc/s10052-018-5571-0",
      "https://arxiv.org/abs/1612.02532"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "The European Physical Journal C",
    "volume": "78",
    "articleNumber": "86",
    "doi": "10.1140/epjc/s10052-018-5571-0",
    "arxiv": "1612.02532"
  },
  {
    "id": "inspire-1631136",
    "title": "GW170817 falsifies dark matter emulators",
    "authors": [
      "S. Boran",
      "S. Desai",
      "Emre Onur Kahya",
      "R. P. Woodard"
    ],
    "year": 2018,
    "link": "https://doi.org/10.1103/PhysRevD.97.041501",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1631136",
      "https://doi.org/10.1103/PhysRevD.97.041501",
      "https://arxiv.org/abs/1710.06168"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "97",
    "articleNumber": "041501",
    "doi": "10.1103/PhysRevD.97.041501",
    "arxiv": "1710.06168"
  },
  {
    "id": "inspire-1413719",
    "title": "Loop corrections to primordial non-Gaussianity",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya"
    ],
    "year": 2018,
    "link": "https://doi.org/10.1103/PhysRevD.97.043507",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1413719",
      "https://doi.org/10.1103/PhysRevD.97.043507",
      "https://arxiv.org/abs/1601.01106"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "97",
    "articleNumber": "043507",
    "doi": "10.1103/PhysRevD.97.043507",
    "arxiv": "1601.01106"
  },
  {
    "id": "inspire-1470921",
    "title": "Broken scale invariance, α-attractors and vector impurity",
    "authors": [
      "Özgür Akarsu",
      "Sibel Boran",
      "Emre Onur Kahya",
      "Neşe Özdemir",
      "Mehmet Ozkan"
    ],
    "year": 2017,
    "link": "https://doi.org/10.1140/epjc/s10052-017-4874-x",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1470921",
      "https://doi.org/10.1140/epjc/s10052-017-4874-x",
      "https://arxiv.org/abs/1606.05308"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "The European Physical Journal C",
    "volume": "77",
    "articleNumber": "306",
    "doi": "10.1140/epjc/s10052-017-4874-x",
    "arxiv": "1606.05308"
  },
  {
    "id": "inspire-1614630",
    "title": "One loop corrected conformally coupled scalar mode equations during inflation",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya",
      "Sohyun Park"
    ],
    "year": 2017,
    "link": "https://doi.org/10.1103/PhysRevD.96.105003",
    "selected": true,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1614630",
      "https://doi.org/10.1103/PhysRevD.96.105003",
      "https://arxiv.org/abs/1708.01831"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "96",
    "articleNumber": "105003",
    "doi": "10.1103/PhysRevD.96.105003",
    "arxiv": "1708.01831",
    "notes": "Includes the 2018 erratum: https://doi.org/10.1103/PhysRevD.98.029903."
  },
  {
    "id": "inspire-1593746",
    "title": "Quantum gravity corrections to the conformally coupled scalar self-mass-squared on de Sitter background. II. Kinetic conformal cross terms",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya",
      "Sohyun Park"
    ],
    "year": 2017,
    "link": "https://doi.org/10.1103/PhysRevD.96.025001",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1593746",
      "https://doi.org/10.1103/PhysRevD.96.025001",
      "https://arxiv.org/abs/1704.05880"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "96",
    "articleNumber": "025001",
    "doi": "10.1103/PhysRevD.96.025001",
    "arxiv": "1704.05880"
  },
  {
    "id": "inspire-1421643",
    "title": "Constraints on frequency-dependent violations of Shapiro delay from GW150914",
    "authors": [
      "Emre Onur Kahya",
      "Shantanu Desai"
    ],
    "year": 2016,
    "link": "https://doi.org/10.1016/j.physletb.2016.03.033",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1421643",
      "https://doi.org/10.1016/j.physletb.2016.03.033",
      "https://arxiv.org/abs/1602.04779"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physics Letters B",
    "volume": "756",
    "pages": "265–267",
    "doi": "10.1016/j.physletb.2016.03.033",
    "arxiv": "1602.04779"
  },
  {
    "id": "inspire-1401199",
    "title": "Galactic one-way Shapiro delay to PSR B1937+21",
    "authors": [
      "S. Desai",
      "Emre Onur Kahya"
    ],
    "year": 2016,
    "link": "https://doi.org/10.1142/S0217732316500838",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1401199",
      "https://doi.org/10.1142/S0217732316500838",
      "https://arxiv.org/abs/1510.08228"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Modern Physics Letters A",
    "volume": "31",
    "articleNumber": "1650083",
    "doi": "10.1142/S0217732316500838",
    "arxiv": "1510.08228"
  },
  {
    "id": "inspire-1359425",
    "title": "Constructing an Inflaton Potential by Mimicking Modified Chaplygin Gas",
    "authors": [
      "Emre Onur Kahya",
      "B. Pourhassan",
      "S. Uraz"
    ],
    "year": 2015,
    "link": "https://doi.org/10.1103/PhysRevD.92.103511",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1359425",
      "https://doi.org/10.1103/PhysRevD.92.103511",
      "https://arxiv.org/abs/1504.03412"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "92",
    "articleNumber": "103511",
    "doi": "10.1103/PhysRevD.92.103511",
    "arxiv": "1504.03412"
  },
  {
    "id": "inspire-1280920",
    "title": "Higher order corrections of the extended Chaplygin gas cosmology with varying G and Λ",
    "authors": [
      "Emre Onur Kahya",
      "M. Khurshudyan",
      "B. Pourhassan",
      "R. Myrzakulov",
      "A. Pasqua"
    ],
    "year": 2015,
    "link": "https://doi.org/10.1140/epjc/s10052-015-3263-6",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1280920",
      "https://doi.org/10.1140/epjc/s10052-015-3263-6",
      "https://arxiv.org/abs/1402.2592"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "The European Physical Journal C",
    "volume": "75",
    "articleNumber": "43",
    "doi": "10.1140/epjc/s10052-015-3263-6",
    "arxiv": "1402.2592"
  },
  {
    "id": "inspire-1342929",
    "title": "The universe dominated by the extended Chaplygin gas",
    "authors": [
      "Emre Onur Kahya",
      "B. Pourhassan"
    ],
    "year": 2015,
    "link": "https://doi.org/10.1142/S0217732315500704",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1342929",
      "https://doi.org/10.1142/S0217732315500704",
      "https://arxiv.org/abs/1502.01189"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Modern Physics Letters A",
    "volume": "30",
    "articleNumber": "1550070",
    "doi": "10.1142/S0217732315500704",
    "arxiv": "1502.01189"
  },
  {
    "id": "inspire-1309518",
    "title": "Extended Chaplygin gas model",
    "authors": [
      "B. Pourhassan",
      "Emre Onur Kahya"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1016/j.rinp.2014.05.007",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1309518",
      "https://doi.org/10.1016/j.rinp.2014.05.007"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Results in Physics",
    "volume": "4",
    "pages": "101–102",
    "doi": "10.1016/j.rinp.2014.05.007"
  },
  {
    "id": "inspire-1294132",
    "title": "FRW Cosmology with the Extended Chaplygin Gas",
    "authors": [
      "B. Pourhassan",
      "Emre Onur Kahya"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1155/2014/231452",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1294132",
      "https://doi.org/10.1155/2014/231452",
      "https://arxiv.org/abs/1405.0667"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Advances in High Energy Physics",
    "volume": "2014",
    "articleNumber": "231452",
    "doi": "10.1155/2014/231452",
    "arxiv": "1405.0667"
  },
  {
    "id": "inspire-1267496",
    "title": "Interacting two-component fluid models with varying EoS parameter",
    "authors": [
      "M. Khurshudyan",
      "B. Pourhassan",
      "Emre Onur Kahya"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1142/S0219887814500613",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1267496",
      "https://doi.org/10.1142/S0219887814500613",
      "https://arxiv.org/abs/1312.1162"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "International Journal of Geometric Methods in Modern Physics",
    "volume": "11",
    "articleNumber": "1450061",
    "doi": "10.1142/S0219887814500613",
    "arxiv": "1312.1162"
  },
  {
    "id": "inspire-1316411",
    "title": "Observational constraints on the extended Chaplygin gas inflation",
    "authors": [
      "Emre Onur Kahya",
      "B. Pourhassan"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1007/s10509-014-2069-6",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1316411",
      "https://doi.org/10.1007/s10509-014-2069-6"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Astrophysics and Space Science",
    "volume": "353",
    "pages": "677–682",
    "doi": "10.1007/s10509-014-2069-6"
  },
  {
    "id": "inspire-1319289",
    "title": "Quantum gravity corrections to the conformally coupled scalar self-mass-squared on de Sitter background",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya",
      "Sohyun Park"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1103/PhysRevD.90.124054",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1319289",
      "https://doi.org/10.1103/PhysRevD.90.124054",
      "https://arxiv.org/abs/1409.7753"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "90",
    "articleNumber": "124054",
    "doi": "10.1103/PhysRevD.90.124054",
    "arxiv": "1409.7753"
  },
  {
    "id": "inspire-1261851",
    "title": "Testing a Dilaton Gravity Model using Nucleosynthesis",
    "authors": [
      "Sibel Boran",
      "Emre Onur Kahya"
    ],
    "year": 2014,
    "link": "https://doi.org/10.1155/2014/282675",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1261851",
      "https://doi.org/10.1155/2014/282675",
      "https://arxiv.org/abs/1310.6145"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Advances in High Energy Physics",
    "volume": "2014",
    "articleNumber": "282675",
    "doi": "10.1155/2014/282675",
    "arxiv": "1310.6145"
  },
  {
    "id": "inspire-1082014",
    "title": "The Coincidence Limit of the Graviton Propagator in de Donder Gauge on de Sitter Background",
    "authors": [
      "Emre Onur Kahya",
      "S.P. Miao",
      "R.P. Woodard"
    ],
    "year": 2012,
    "link": "https://doi.org/10.1063/1.3681886",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/1082014",
      "https://doi.org/10.1063/1.3681886",
      "https://arxiv.org/abs/1112.4420"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Journal of Mathematical Physics",
    "volume": "53",
    "articleNumber": "022304",
    "doi": "10.1063/1.3681886",
    "arxiv": "1112.4420"
  },
  {
    "id": "inspire-841841",
    "title": "A useful guide for gravitational wave observers to test modified gravity models",
    "authors": [
      "Emre Onur Kahya"
    ],
    "year": 2011,
    "link": "https://doi.org/10.1016/j.physletb.2011.05.073",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/841841",
      "https://doi.org/10.1016/j.physletb.2011.05.073",
      "https://arxiv.org/abs/1001.0725"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physics Letters B",
    "volume": "701",
    "pages": "291–295",
    "doi": "10.1016/j.physletb.2011.05.073",
    "arxiv": "1001.0725"
  },
  {
    "id": "inspire-819121",
    "title": "Completely regular quantum stress tensor with w < −1",
    "authors": [
      "Emre Onur Kahya",
      "V. K. Onemli",
      "R. P. Woodard"
    ],
    "year": 2010,
    "link": "https://doi.org/10.1103/PhysRevD.81.023508",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/819121",
      "https://doi.org/10.1103/PhysRevD.81.023508",
      "https://arxiv.org/abs/0904.4811"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "81",
    "articleNumber": "023508",
    "doi": "10.1103/PhysRevD.81.023508",
    "arxiv": "0904.4811"
  },
  {
    "id": "inspire-858985",
    "title": "The ζ–ζ correlator is time dependent",
    "authors": [
      "Emre Onur Kahya",
      "V.K. Onemli",
      "R.P. Woodard"
    ],
    "year": 2010,
    "link": "https://doi.org/10.1016/j.physletb.2010.09.050",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/858985",
      "https://doi.org/10.1016/j.physletb.2010.09.050",
      "https://arxiv.org/abs/1006.3999"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physics Letters B",
    "volume": "694",
    "pages": "101–107",
    "doi": "10.1016/j.physletb.2010.09.050",
    "arxiv": "1006.3999"
  },
  {
    "id": "inspire-777331",
    "title": "A decisive test to confirm or rule out the existence of dark matter emulators using gravitational wave observations",
    "authors": [
      "Emre Onur Kahya"
    ],
    "year": 2008,
    "link": "https://doi.org/10.1088/0264-9381/25/18/184008",
    "selected": false,
    "type": "conference",
    "sourceUrls": [
      "https://inspirehep.net/literature/777331",
      "https://doi.org/10.1088/0264-9381/25/18/184008",
      "https://arxiv.org/abs/0801.1984"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Classical and Quantum Gravity",
    "volume": "25",
    "articleNumber": "184008",
    "doi": "10.1088/0264-9381/25/18/184008",
    "arxiv": "0801.1984"
  },
  {
    "id": "inspire-1263713",
    "title": "Quantum Gravitational Correction to Scalar Field Equations during Inflation",
    "authors": [
      "Emre Onur Kahya"
    ],
    "year": 2008,
    "link": "https://inspirehep.net/literature/1263713",
    "selected": false,
    "type": "thesis",
    "sourceUrls": [
      "https://inspirehep.net/literature/1263713"
    ],
    "verifiedOn": "2026-10-02"
  },
  {
    "id": "inspire-784182",
    "title": "Reduced time delay for gravitational waves with dark matter emulators",
    "authors": [
      "S. Desai",
      "Emre Onur Kahya",
      "R. P. Woodard"
    ],
    "year": 2008,
    "link": "https://doi.org/10.1103/PhysRevD.77.124041",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/784182",
      "https://doi.org/10.1103/PhysRevD.77.124041",
      "https://arxiv.org/abs/0804.3804"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "77",
    "articleNumber": "124041",
    "doi": "10.1103/PhysRevD.77.124041",
    "arxiv": "0804.3804"
  },
  {
    "id": "inspire-765838",
    "title": "Scalar field equations from quantum gravity during inflation",
    "authors": [
      "Emre Onur Kahya",
      "R. P. Woodard"
    ],
    "year": 2008,
    "link": "https://doi.org/10.1103/PhysRevD.77.084012",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/765838",
      "https://doi.org/10.1103/PhysRevD.77.084012",
      "https://arxiv.org/abs/0710.5282"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "77",
    "articleNumber": "084012",
    "doi": "10.1103/PhysRevD.77.084012",
    "arxiv": "0710.5282"
  },
  {
    "id": "inspire-749690",
    "title": "A generic test of modified gravity models which emulate dark matter",
    "authors": [
      "Emre Onur Kahya",
      "R.P. Woodard"
    ],
    "year": 2007,
    "link": "https://doi.org/10.1016/j.physletb.2007.07.029",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/749690",
      "https://doi.org/10.1016/j.physletb.2007.07.029",
      "https://arxiv.org/abs/0705.0153"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physics Letters B",
    "volume": "652",
    "articleNumber": "24157",
    "doi": "10.1016/j.physletb.2007.07.029",
    "arxiv": "0705.0153"
  },
  {
    "id": "inspire-759916",
    "title": "Quantum gravity corrections to the one loop scalar self-mass during inflation",
    "authors": [
      "Emre Onur Kahya",
      "R. P. Woodard"
    ],
    "year": 2007,
    "link": "https://doi.org/10.1103/PhysRevD.76.124005",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/759916",
      "https://doi.org/10.1103/PhysRevD.76.124005",
      "https://arxiv.org/abs/0709.0536"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "76",
    "articleNumber": "124005",
    "doi": "10.1103/PhysRevD.76.124005",
    "arxiv": "0709.0536"
  },
  {
    "id": "inspire-733341",
    "title": "Quantum stability of a w < −1 phase of cosmic acceleration",
    "authors": [
      "Emre Onur Kahya",
      "V. K. Onemli"
    ],
    "year": 2007,
    "link": "https://doi.org/10.1103/PhysRevD.76.043512",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/733341",
      "https://doi.org/10.1103/PhysRevD.76.043512",
      "https://arxiv.org/abs/gr-qc/0612026"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "76",
    "articleNumber": "043512",
    "doi": "10.1103/PhysRevD.76.043512",
    "arxiv": "gr-qc/0612026"
  },
  {
    "id": "inspire-723503",
    "title": "One loop corrected mode functions for scalar QED during inflation",
    "authors": [
      "Emre Onur Kahya",
      "R. P. Woodard"
    ],
    "year": 2006,
    "link": "https://doi.org/10.1103/PhysRevD.74.084012",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/723503",
      "https://doi.org/10.1103/PhysRevD.74.084012",
      "https://arxiv.org/abs/gr-qc/0608049"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "74",
    "articleNumber": "084012",
    "doi": "10.1103/PhysRevD.74.084012",
    "arxiv": "gr-qc/0608049"
  },
  {
    "id": "inspire-688934",
    "title": "Charged scalar self-mass during inflation",
    "authors": [
      "Emre Onur Kahya",
      "R.P. Woodard"
    ],
    "year": 2005,
    "link": "https://doi.org/10.1103/PhysRevD.72.104001",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/688934",
      "https://doi.org/10.1103/PhysRevD.72.104001",
      "https://arxiv.org/abs/gr-qc/0508015"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "72",
    "articleNumber": "104001",
    "doi": "10.1103/PhysRevD.72.104001",
    "arxiv": "gr-qc/0508015"
  },
  {
    "id": "inspire-585315",
    "title": "Higher dimensional metrics of colliding gravitational plane waves",
    "authors": [
      "M. Gürses",
      "Emre Onur Kahya",
      "A. Karasu"
    ],
    "year": 2002,
    "link": "https://doi.org/10.1103/PhysRevD.66.024029",
    "selected": false,
    "type": "journal",
    "sourceUrls": [
      "https://inspirehep.net/literature/585315",
      "https://doi.org/10.1103/PhysRevD.66.024029",
      "https://arxiv.org/abs/gr-qc/0204041"
    ],
    "verifiedOn": "2026-10-02",
    "journal": "Physical Review D",
    "volume": "66",
    "articleNumber": "024029",
    "doi": "10.1103/PhysRevD.66.024029",
    "arxiv": "gr-qc/0204041"
  }
];

export const selectedPublications = publications.filter((publication) => publication.selected);
