import assert from 'node:assert/strict';
import test from 'node:test';
import { assessmentRows, course, isFinalAssessmentEligible, minimumMidtermScore, totalAssessmentPoints } from '../src/data/course';

test('fixed assessment categories remain 30 + 30 + 40 = 100', () => {
  assert.equal(course.assessment.midtermPoints, 30);
  assert.equal(course.assessment.presentationsTotalPoints, 30);
  assert.equal(course.assessment.finalPaperPoints, 40);
  assert.equal(totalAssessmentPoints(), 100);
  assert.equal(course.planning.presentations.reduce((sum, presentation) => sum + presentation.points, 0), 30);
  assert.deepEqual(assessmentRows().map((row) => row.points), [30, 15, 15, 40]);
  assert.equal(assessmentRows().reduce((sum, row) => sum + row.points, 0), 100);
});

test('eligibility is midterm 40 percent AND both presentations', () => {
  assert.equal(course.assessment.minimumMidtermPercent, 40);
  assert.equal(course.assessment.requiredPresentations, 2);
  assert.equal(minimumMidtermScore(), 12);
  assert.equal(isFinalAssessmentEligible(11.9, [true, true]), false);
  assert.equal(isFinalAssessmentEligible(12, [true, true]), true);
  assert.equal(isFinalAssessmentEligible(30, [true, false]), false);
  assert.equal(isFinalAssessmentEligible(30, [false, true]), false);
  assert.equal(isFinalAssessmentEligible(12, [false, false]), false);
});

test('invalid input never implies final-assessment eligibility', () => {
  for (const score of [NaN, Infinity, -1, 30.1]) assert.equal(isFinalAssessmentEligible(score, [true, true]), false);
  assert.equal(isFinalAssessmentEligible(30, []), false);
  assert.equal(isFinalAssessmentEligible(30, [true]), false);
  assert.equal(isFinalAssessmentEligible(30, [true, true, true]), false);
});

test('rubric totals match their assessment and remain provisional', () => {
  assert.equal(course.planning.presentationSplitProvisional, true);
  assert.equal(course.planning.sameProjectAcrossPresentationsProvisional, true);
  assert.equal(course.planning.rubricsProvisional, true);
  assert.equal(course.planning.scheduleProvisional, true);
  assert.equal(course.planning.paperFormatProvisional, true);
  for (const presentation of course.planning.presentations) {
    assert.equal(presentation.rubric.reduce((sum, item) => sum + item.points, 0), presentation.points);
  }
  assert.equal(course.planning.paperRubric.reduce((sum, item) => sum + item.points, 0), course.assessment.finalPaperPoints);
  assert.deepEqual(course.planning.paperMainTextPages, [4, 6]);
});

test('the complete 14-week schedule contains six foundation weeks and two presentation rounds', () => {
  assert.deepEqual(course.weeks.map((week) => week.week), Array.from({ length: 14 }, (_, index) => index + 1));
  assert.deepEqual(course.weeks.filter((week) => week.phase === 'foundations').map((week) => week.week), [1, 2, 3, 4, 5, 6]);
  assert.equal(course.planning.midtermWeek, 7);
  assert.deepEqual(course.planning.presentations.map((presentation) => presentation.window), ['Weeks 8–9', 'Weeks 12–13']);
  assert.equal(course.announcements.length, 0);
  assert.equal(course.weeks[13]?.phase, 'writing');
});
