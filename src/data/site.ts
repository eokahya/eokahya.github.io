/** Site-wide navigation and metadata. */
export const site = {
  url: 'https://eokahya.github.io',
  title: 'Emre Onur Kahya',
  tagline: 'Physics, cosmology and the inner workings of learning machines',
  taglineTr: 'Fizik, kozmoloji ve öğrenen makinelerin iç işleyişi',
  description:
    'Prof. Dr. Emre Onur Kahya — physicist at Istanbul Technical University working on quantum fields, gravitation and cosmology, machine learning for physics and mechanistic interpretability. Teaching MYZ 310E and science communication on Teke Tek Bilim.',
  ogImage: '/og-image.jpg',
  themeColor: '#05060b',
};

export const nav = [
  { label: 'Research', href: '/research/' },
  { label: 'Publications', href: '/publications/' },
  { label: 'Teaching', href: '/teaching/' },
  { label: 'Outreach', href: '/outreach/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;
