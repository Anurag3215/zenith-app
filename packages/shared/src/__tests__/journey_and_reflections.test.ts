import assert from 'assert';
import {
  DEMO_TRAINING_DAYS,
  DEMO_PROFILES,
  DEMO_REFLECTIONS,
  DEMO_RESOURCES,
  DEMO_GALLERY,
  Profile,
  Reflection,
  TrainingDay,
  PERMITTED_MEMBER_EDIT_FIELDS,
  RESTRICTED_PROFILE_FIELDS,
  isProfileFieldEditable,
  filterPermittedProfileUpdates,
  validateReflectionSubmission,
  canUserApproveShowcase,
  filterShowcaseReflections,
  filterWorkspaceReflections,
  filterShowcaseResources,
  validateResourceUpload,
  filterShowcaseGallery,
  validateCurriculumIntegrity,
} from '../index';

console.log('=================================================');
console.log(' ZENITH PHASE 5: CURRICULUM, PROFILES & REFLECTIONS TEST SUITE');
console.log('=================================================');

// -----------------------------------------------------------------------------
// Test 1: Four-Day Curriculum Integrity (Day 1 completed, Days 2-4 upcoming)
// -----------------------------------------------------------------------------
console.log('--- Suite 1: Curriculum Timeline Integrity ---');

assert.strictEqual(DEMO_TRAINING_DAYS.length, 4, 'Must have exactly 4 curriculum days');

const day1 = DEMO_TRAINING_DAYS.find((d) => d.day_number === 1);
assert(day1, 'Day 1 must exist');
assert.strictEqual(day1.status, 'completed', 'Day 1 must be marked completed');
assert(
  day1.topics_covered && day1.topics_covered.length > 0,
  'Day 1 must contain actual topics covered'
);
assert(
  day1.learning_outcomes && day1.learning_outcomes.length > 0,
  'Day 1 must contain verified learning outcomes'
);

const upcomingDays = DEMO_TRAINING_DAYS.filter((d) => d.day_number > 1);
assert.strictEqual(upcomingDays.length, 3, 'Days 2, 3, 4 must exist');
for (const day of upcomingDays) {
  assert.strictEqual(
    day.status,
    'upcoming',
    `Day ${day.day_number} must remain upcoming prior to official faculty delivery`
  );
  assert.strictEqual(
    day.is_published,
    false,
    `Day ${day.day_number} must not be marked published`
  );
  assert(
    day.description.includes('Awaiting Delivery from Faculty'),
    `Day ${day.day_number} description must declare pending status`
  );
}

const curriculumValidation = validateCurriculumIntegrity(DEMO_TRAINING_DAYS);
assert.strictEqual(
  curriculumValidation.valid,
  true,
  'Curriculum integrity validation must pass for official timeline'
);

// Verify that a prematurely completed Day 2 fails integrity check
const corruptedDays: TrainingDay[] = [
  ...DEMO_TRAINING_DAYS.slice(0, 1),
  { ...DEMO_TRAINING_DAYS[1], status: 'completed' },
  ...DEMO_TRAINING_DAYS.slice(2),
];
const failedValidation = validateCurriculumIntegrity(corruptedDays);
assert.strictEqual(
  failedValidation.valid,
  false,
  'Curriculum integrity validation must catch fabricated completion on upcoming days'
);
console.log('✓ TC-CURR-01: 4-Day curriculum sequence, Day 1 completed, Days 2-4 upcoming verified');

// -----------------------------------------------------------------------------
// Test 2: Profile Permitted Field Whitelist & Tampering Protection
// -----------------------------------------------------------------------------
console.log('--- Suite 2: Profile Security Whitelist ---');

const memberUser = DEMO_PROFILES.find((p) => p.role === 'member')!;
const targetProfileId = memberUser.id;

// Member can edit bio, skills, linkedin_url
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'bio'),
  true,
  'Member should be permitted to edit their own bio'
);
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'skills'),
  true,
  'Member should be permitted to edit their own skills'
);
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'linkedin_url'),
  true,
  'Member should be permitted to edit their own linkedin URL'
);

// Member CANNOT edit role, email, is_active, team_id
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'role'),
  false,
  'Member must NOT be permitted to mutate their own role'
);
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'email'),
  false,
  'Member must NOT be permitted to mutate their own email'
);
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, targetProfileId, 'is_active'),
  false,
  'Member must NOT be permitted to mutate their account active state'
);

// Member CANNOT edit another member's profile
const anotherMember = DEMO_PROFILES.find((p) => p.id !== memberUser.id)!;
assert.strictEqual(
  isProfileFieldEditable('member', memberUser.id, anotherMember.id, 'bio'),
  false,
  'Member must NOT be permitted to edit peer profiles'
);

// Test filterPermittedProfileUpdates stripping restricted fields
const maliciousUpdate: Partial<Profile> = {
  bio: 'Legitimate bio update',
  role: 'captain', // Attempted elevation!
  email: 'hijacked@zenith5.edu', // Attempted account hijacking!
  skills: ['TypeScript', 'Security'],
};

const filterResult = filterPermittedProfileUpdates(
  'member',
  memberUser.id,
  targetProfileId,
  maliciousUpdate
);

assert.strictEqual(filterResult.sanitized.bio, 'Legitimate bio update');
assert.deepStrictEqual(filterResult.sanitized.skills, ['TypeScript', 'Security']);
assert.strictEqual(filterResult.sanitized.role, undefined, 'Role elevation must be stripped');
assert.strictEqual(filterResult.sanitized.email, undefined, 'Email alteration must be stripped');
assert(filterResult.strippedFields.includes('role'), 'Stripped fields must list role');
assert(filterResult.strippedFields.includes('email'), 'Stripped fields must list email');
console.log('✓ TC-PROF-01: Profile whitelist enforced; role and email mutations stripped safely');

// -----------------------------------------------------------------------------
// Test 3: Reflection Validation, Privacy, Drafts & Showcase Gating
// -----------------------------------------------------------------------------
console.log('--- Suite 3: Reflection Drafts & Showcase Authorization ---');

// Minimum length validation (< 10 characters rejected)
const shortTakeaways = validateReflectionSubmission({
  key_takeaways: 'Too short',
  day_number: 1,
  mood_rating: 5,
});
assert.strictEqual(shortTakeaways.valid, false, 'Reflections under 10 chars must be rejected');

const validSubmission = validateReflectionSubmission({
  key_takeaways: 'Learned systematic time allocation for quantitative problem sets.',
  day_number: 1,
  mood_rating: 5,
});
assert.strictEqual(validSubmission.valid, true, 'Valid reflection must pass validation');

// Showcase approval authority
assert.strictEqual(canUserApproveShowcase('captain'), true, 'Captain can endorse for showcase');
assert.strictEqual(canUserApproveShowcase('vice_captain'), true, 'Vice-Captain can endorse for showcase');
assert.strictEqual(canUserApproveShowcase('team_admin'), true, 'Team Admin can endorse for showcase');
assert.strictEqual(canUserApproveShowcase('member'), false, 'Ordinary member CANNOT endorse for showcase');

// Public Evaluator Showcase Filtering
const testReflections: Reflection[] = [
  {
    id: 'r1',
    day_id: 'day-01',
    day_number: 1,
    member_id: 'user-002',
    member_name: 'Candidate 02',
    member_role: 'captain',
    key_takeaways: 'Official approved takeaways for placement jury.',
    mood_rating: 5,
    visibility: 'showcase',
    is_draft: false,
    is_approved_for_showcase: true,
    created_at: '2026-10-15T16:00:00Z',
    updated_at: '2026-10-15T16:00:00Z',
  },
  {
    id: 'r2',
    day_id: 'day-01',
    day_number: 1,
    member_id: 'user-004',
    member_name: 'Candidate 04',
    member_role: 'member',
    key_takeaways: 'Internal squad debrief note.',
    mood_rating: 4,
    visibility: 'team',
    is_draft: false,
    is_approved_for_showcase: false,
    created_at: '2026-10-15T17:00:00Z',
    updated_at: '2026-10-15T17:00:00Z',
  },
  {
    id: 'r3',
    day_id: 'day-01',
    day_number: 1,
    member_id: 'user-005',
    member_name: 'Candidate 05',
    member_role: 'member',
    key_takeaways: 'Rough draft work-in-progress notes.',
    mood_rating: 3,
    visibility: 'private',
    is_draft: true,
    is_approved_for_showcase: false,
    created_at: '2026-10-15T18:00:00Z',
    updated_at: '2026-10-15T18:00:00Z',
  },
];

const publicShowcaseReflections = filterShowcaseReflections(testReflections);
assert.strictEqual(
  publicShowcaseReflections.length,
  1,
  'Only approved non-draft reflections must appear in showcase'
);
assert.strictEqual(publicShowcaseReflections[0].id, 'r1');

// Draft isolation: Candidate 04 cannot see Candidate 05's draft
const cand4View = filterWorkspaceReflections(testReflections, 'user-004', 'all');
assert(
  !cand4View.some((r) => r.id === 'r3'),
  'Drafts must NEVER be viewable by peer members'
);

// Draft author CAN see their own draft in their personal view
const cand5View = filterWorkspaceReflections(testReflections, 'user-005', 'all');
assert(
  cand5View.some((r) => r.id === 'r3'),
  'Authors must be able to view their own drafts'
);
console.log('✓ TC-REFL-01: Reflection draft isolation and showcase approval gating verified');

// -----------------------------------------------------------------------------
// Test 4: Resource Storage Access Control & Upload Validation
// -----------------------------------------------------------------------------
console.log('--- Suite 4: Resources Storage Tiers & Validation ---');

const showcaseResources = filterShowcaseResources(DEMO_RESOURCES);
assert(
  showcaseResources.every((r) => r.access_level === 'showcase_public'),
  'Showcase resource filter must strictly return showcase_public items'
);
assert(
  !showcaseResources.some((r) => r.access_level === 'internal_only'),
  'Internal-only documents must never leak into showcase filter'
);

// File size limit (max 15MB)
const oversizedFile = validateResourceUpload({
  title: 'Gigantic Dataset',
  size: 20 * 1024 * 1024, // 20 MB
  mimeType: 'application/pdf',
});
assert.strictEqual(oversizedFile.valid, false, 'Files > 15MB must be rejected');

// Invalid MIME type
const executableFile = validateResourceUpload({
  title: 'Unsafe Payload',
  size: 1024 * 1024,
  mimeType: 'application/x-executable',
});
assert.strictEqual(executableFile.valid, false, 'Non-document MIME types must be rejected');

// Valid PDF file
const validDoc = validateResourceUpload({
  title: 'Quantitative Aptitude Shortcuts',
  size: 3 * 1024 * 1024,
  mimeType: 'application/pdf',
});
assert.strictEqual(validDoc.valid, true, 'Valid document upload must pass');
console.log('✓ TC-RES-01: Resource access tier filtering and upload limits enforced');

// -----------------------------------------------------------------------------
// Test 5: Media Gallery Showcase Filtering
// -----------------------------------------------------------------------------
console.log('--- Suite 5: Media Gallery Showcase Filtering ---');

const showcaseGallery = filterShowcaseGallery(DEMO_GALLERY);
assert(
  showcaseGallery.every((item) => item.is_featured_showcase === true),
  'Showcase gallery filter must strictly return featured items'
);
assert(
  !showcaseGallery.some((item) => item.is_featured_showcase === false),
  'Unfeatured or internal gallery photos must not appear in showcase filter'
);
console.log('✓ TC-GAL-01: Media gallery showcase curation filter verified');

console.log('=================================================');
console.log('ALL PHASE 5 VERIFICATION CHECKS PASSED SUCCESSFULLY!');
console.log('=================================================');
