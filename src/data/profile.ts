/** Public academic identity, checked on 2026-10-02. See docs/SOURCES.md. */
export interface ProfileLink { label: string; url: string }
export interface AcademicMilestone {
  role: string;
  institution: string;
  period: string;
  sourceUrl: string;
}

export const profile = {
  name: 'Emre Onur Kahya',
  fullName: 'Prof. Dr. Emre Onur Kahya',
  displayRole: 'Professor of Physics',
  affiliation: 'Department of Physics Engineering, Istanbul Technical University',
  institution: 'Istanbul Technical University',
  department: 'Department of Physics Engineering',
  email: 'eokahya@itu.edu.tr',
  location: 'Istanbul, Türkiye',
  orcid: '0000-0003-2760-7091',
  bio: 'I study quantum fields, gravitation and cosmology, and develop machine-learning approaches to physical data. My current research direction asks how the internal mechanisms of learned models can be understood and tested.',
  aboutBio: [
    'I am a professor in the Department of Physics Engineering at Istanbul Technical University. My research spans quantum field theory in curved spacetime, quantum corrections during inflation, cosmology and tests of modified gravity.',
    'My work in machine learning includes astronomical light-curve classification and electron identification with deep learning. I bring this combination of theoretical physics and computational methods to teaching and to a current interest in mechanistic interpretability and reliable AI.',
  ],
  links: [
    { label: 'İTÜ academic profile', url: 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya' },
    { label: 'İTÜ research profile', url: 'https://research.itu.edu.tr/en/persons/eokahya/' },
    { label: 'ORCID', url: 'https://orcid.org/0000-0003-2760-7091' },
    { label: 'INSPIRE', url: 'https://inspirehep.net/authors/1039459' },
    { label: 'GitHub', url: 'https://github.com/eokahya' },
  ] satisfies ProfileLink[],
  education: [
    { degree: 'M.Sc. in Computer Science', institution: 'Université de Montréal', year: 2020, sourceUrl: 'https://doi.org/10.71781/10723' },
    { degree: 'Ph.D. in Physics', institution: 'University of Florida', year: 2008, sourceUrl: 'https://inspirehep.net/literature/1263713' },
    { degree: 'M.Sc. in Physics', institution: 'Middle East Technical University', year: 2002, sourceUrl: 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya' },
    { degree: 'B.Sc. in Physics', institution: 'Middle East Technical University', year: 2000, sourceUrl: 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya' },
  ],
  appointments: [
    { role: 'Professor', institution: 'Istanbul Technical University', period: '2018–present', sourceUrl: 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya' },
    { role: 'Associate Professor', institution: 'Istanbul Technical University', period: '2013–2018', sourceUrl: 'https://akademi.itu.edu.tr/eokahya/Emre-Onur-Kahya' },
    { role: 'Postdoctoral researcher', institution: 'Friedrich Schiller University Jena', period: '2009–2012', sourceUrl: 'https://inspirehep.net/authors/1039459' },
    { role: 'Postdoctoral researcher', institution: 'Koç University', period: '2008–2009', sourceUrl: 'https://inspirehep.net/authors/1039459' },
  ] satisfies AcademicMilestone[],
  verifiedOn: '2026-10-02',
};
