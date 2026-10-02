/**
 * Invited talks, seminars and conference presentations, and media coverage, as listed in the
 * author's CVs (public/cv/, 2026). Talk titles are kept in their original (English) wording.
 */
export interface Talk {
  year: number;
  date: string;
  dateTr: string;
  event: string;
  place: string;
  placeTr: string;
  title: string;
  invited: boolean;
}

export const talks: readonly Talk[] = [
  { year: 2017, date: 'May 1–6, 2017', dateTr: '1–6 Mayıs 2017', event: 'Hot Topics in Modern Cosmology, Spontaneous Workshop XI', place: 'Corsica, France', placeTr: 'Korsika, Fransa', title: 'Loop Effects on Non-Gaussianity', invited: true },
  { year: 2016, date: 'July 10–15, 2016', dateTr: '10–15 Temmuz 2016', event: 'GR21, 21st International Conference on General Relativity and Gravitation', place: 'Columbia University, New York, USA', placeTr: 'Columbia University, New York, ABD', title: 'Effects of Time-Dependent Scalar Mode Functions on Non-Gaussianity', invited: false },
  { year: 2016, date: 'June 27–July 1, 2016', dateTr: '27 Haziran–1 Temmuz 2016', event: 'Utrecht Cosmology Symposium 2016', place: 'Utrecht, the Netherlands', placeTr: 'Utrecht, Hollanda', title: 'Loop Corrections to Primordial Non-Gaussianities', invited: true },
  { year: 2016, date: 'May 23–27, 2016', dateTr: '23–27 Mayıs 2016', event: 'Planck 2016, 19th International Conference from the Planck Scale to the Electroweak Scale', place: 'Valencia, Spain', placeTr: 'Valensiya, İspanya', title: 'Zeta-Zeta propagator: Is it time-dependent?', invited: false },
  { year: 2015, date: 'August 27, 2015', dateTr: '27 Ağustos 2015', event: 'Pusan National University', place: 'Busan, South Korea', placeTr: 'Busan, Güney Kore', title: 'Zeta Zeta Correlator is Time-Dependent', invited: true },
  { year: 2015, date: 'August 25, 2015', dateTr: '25 Ağustos 2015', event: 'CosKASI, Korea Astronomy and Space Science Institute', place: 'Daejeon, South Korea', placeTr: 'Daejeon, Güney Kore', title: 'Zeta Zeta Correlator is Time-Dependent', invited: true },
  { year: 2015, date: 'May 25–29, 2015', dateTr: '25–29 Mayıs 2015', event: 'Planck 2015, 18th International Conference from the Planck Scale to the Electroweak Scale', place: 'Ioannina, Greece', placeTr: 'Ioannina, Yunanistan', title: 'Zeta-Zeta propagator: Is it time-dependent?', invited: false },
  { year: 2015, date: 'April 2015', dateTr: 'Nisan 2015', event: 'University of Granada', place: 'Granada, Spain', placeTr: 'Granada, İspanya', title: 'Quantum Effects During Inflation', invited: true },
  { year: 2015, date: 'February 13, 2015', dateTr: '13 Şubat 2015', event: 'Ankara YEF Days 2015', place: 'Ankara, Türkiye', placeTr: 'Ankara, Türkiye', title: 'Cosmological Perturbations', invited: true },
  { year: 2014, date: 'November 2014', dateTr: 'Kasım 2014', event: 'Middle East Technical University', place: 'Ankara, Türkiye', placeTr: 'Ankara, Türkiye', title: 'Quantum Gravitational Effects during the Early Universe', invited: true },
  { year: 2014, date: 'September 1–12, 2014', dateTr: '1–12 Eylül 2014', event: 'Feza Gürsey Summer Schools', place: 'Türkiye', placeTr: 'Türkiye', title: 'Primordial Nucleosynthesis', invited: true },
  { year: 2014, date: 'August 2014', dateTr: 'Ağustos 2014', event: 'Cosmo 2014, 18th International Conference on Particle Physics and Cosmology', place: 'Kavli Institute for Cosmological Physics, Chicago, USA', placeTr: 'Kavli Institute for Cosmological Physics, Chicago, ABD', title: 'Quantum Effects on Conformal Scalars during Inflation', invited: false },
  { year: 2012, date: 'September 11–14, 2012', dateTr: '11–14 Eylül 2012', event: 'Physics of de Sitter Spacetime, Albert Einstein Institute', place: 'Hannover, Germany', placeTr: 'Hannover, Almanya', title: 'Quantum Effects on Scalar Particles During Inflation', invited: true },
  { year: 2012, date: 'June 19–23, 2012', dateTr: '19–23 Haziran 2012', event: 'IZYEF 2012', place: 'Izmir, Türkiye', placeTr: 'İzmir, Türkiye', title: 'Quantum Effects During Inflation', invited: true },
  { year: 2012, date: 'April 20–22, 2012', dateTr: '20–22 Nisan 2012', event: '12th Workshop on Quantization, Dualities and Integrable Systems, Koç University', place: 'Istanbul, Türkiye', placeTr: 'İstanbul, Türkiye', title: 'Power Spectrum — Can it really be time-dependent?', invited: true },
  { year: 2012, date: 'March 23–24, 2012', dateTr: '23–24 Mart 2012', event: 'Annual Meeting GRK 1523: Quantum and Gravitational Fields', place: 'Oppurg, Germany', placeTr: 'Oppurg, Almanya', title: 'Realizing Quantum Effects During Inflation', invited: true },
  { year: 2012, date: 'April 21–23, 2012', dateTr: '21–23 Nisan 2012', event: '11th Workshop on Quantization, Dualities and Integrable Systems', place: 'Pamukkale, Türkiye', placeTr: 'Pamukkale, Türkiye', title: 'Quantum Effects During Inflation', invited: true },
  { year: 2011, date: 'September 5–23, 2011', dateTr: '5–23 Eylül 2011', event: 'Quantum Gravity: From UV to IR, CERN', place: 'Geneva, Switzerland', placeTr: 'Cenevre, İsviçre', title: 'Effects of Loops During Inflation', invited: true },
  { year: 2010, date: 'June 28–July 1, 2010', dateTr: '28 Haziran–1 Temmuz 2010', event: 'Modified Gravity Approaches to the Dark Sector', place: 'Strasbourg, France', placeTr: 'Strazburg, Fransa', title: 'Testing New Physics with Gravitational Waves', invited: true },
  { year: 2010, date: 'June 26–27, 2010', dateTr: '26–27 Haziran 2010', event: 'Gravitational Wave Tests of Alternative Theories of Gravity in the Advanced Detector Era', place: 'Milwaukee, Wisconsin, USA', placeTr: 'Milwaukee, Wisconsin, ABD', title: 'Externally Triggered GW Searches and Tests of Alternate Gravity Models', invited: true },
  { year: 2010, date: 'June 8–11, 2010', dateTr: '8–11 Haziran 2010', event: 'Dark Matter in the Universe and Universal Properties of Galaxies: Theory and Observations', place: 'Paris, France', placeTr: 'Paris, Fransa', title: 'Externally Triggered GW Searches and Tests of Alternate Gravity Models', invited: true },
  { year: 2009, date: 'April 4–9, 2009', dateTr: '4–9 Nisan 2009', event: 'Interactions in the Dark: Physics of Dark Energy–Dark Matter Interactions', place: 'Leiden, the Netherlands', placeTr: 'Leiden, Hollanda', title: 'Testing Alternative Gravity Models', invited: true },
  { year: 2007, date: 'December 13–16, 2007', dateTr: '13–16 Aralık 2007', event: '12th Gravitational Wave Data Analysis Workshop, MIT', place: 'Cambridge, MA, USA', placeTr: 'Cambridge, MA, ABD', title: 'Testing Modified Gravity Models by Gravitational Wave Observation', invited: false },
  { year: 2007, date: 'August 2007', dateTr: 'Ağustos 2007', event: 'Inaugural Conference, Penn State University', place: 'University Park, PA, USA', placeTr: 'University Park, PA, ABD', title: 'A Generic Test of Modified Gravity Models which Emulate Dark Matter', invited: false },
  { year: 2006, date: 'August 2006', dateTr: 'Ağustos 2006', event: 'University of Crete', place: 'Heraklion, Crete', placeTr: 'Heraklion, Girit', title: 'Quantum Corrected Mode Functions for SQED during Inflation', invited: true },
  { year: 2006, date: 'July 2006', dateTr: 'Temmuz 2006', event: 'MG11, Eleventh Marcel Grossmann Meeting on General Relativity', place: 'Berlin, Germany', placeTr: 'Berlin, Almanya', title: 'Effective Field Equations for Charged Scalar during Inflation', invited: false },
];

export interface MediaItem {
  outlet: string;
  title: string;
  date: string;
  dateTr: string;
  /** Only links that were checked are given; the others are listed as in the CV. */
  url?: string;
}

/** Coverage listed in the CV; the 2017 items concern the GW170817 test of dark-matter emulators. */
export const media: readonly MediaItem[] = [
  { outlet: 'Physics World', title: 'Happy Dark Matter Day', date: 'October 31, 2017', dateTr: '31 Ekim 2017', url: 'https://physicsworld.com/a/happy-dark-matter-day/' },
  { outlet: 'Smithsonian Magazine', title: 'What the Neutron Star Collision Means for Dark Matter', date: 'October 31, 2017', dateTr: '31 Ekim 2017', url: 'https://www.smithsonianmag.com/science-nature/what-neutron-star-collision-means-dark-matter-180967016/' },
  { outlet: 'MIT Technology Review', title: 'The Best of the Physics arXiv', date: 'October 28, 2017', dateTr: '28 Ekim 2017' },
  { outlet: 'Forbes', title: 'Merging Neutron Stars Deliver Deathblow To Dark Matter And Dark Energy Alternatives', date: 'October 25, 2017', dateTr: '25 Ekim 2017' },
  { outlet: 'Ars Technica', title: 'Colliding neutron stars apply kiss of death to theories of gravity', date: 'October 25, 2017', dateTr: '25 Ekim 2017' },
  { outlet: 'Alphr', title: 'The neutron star merger is good news for dark matter', date: 'October 25, 2017', dateTr: '25 Ekim 2017' },
  { outlet: 'New Scientist', title: 'Particle race could settle dark matter debate', date: 'March 7, 2008', dateTr: '7 Mart 2008' },
];
