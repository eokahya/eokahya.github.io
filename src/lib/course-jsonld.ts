import { course } from '../data/course';
import { site } from '../data/site';

/** schema.org Course description built from the same course source. */
export function courseJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    courseCode: course.code,
    name: `${course.code} — ${course.title}`,
    description: course.overview[0],
    inLanguage: 'en',
    url: `${site.url}${course.termPath}`,
    provider: { '@type': 'CollegeOrUniversity', name: course.institution },
    instructor: { '@type': 'Person', name: course.instructor, email: `mailto:${course.email}` },
    hasCourseInstance: { '@type': 'CourseInstance', name: course.term, courseMode: 'onsite', instructor: { '@type': 'Person', name: course.instructor } },
  };
}
