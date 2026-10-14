import {
  DEMO_PROFILES,
  DEMO_SCOREBOARD_GROUPS,
  DEMO_TRAINING_DAYS,
} from '../constants/mockData';

export function runDomainVerificationTests() {
  const assertions: string[] = [];

  // Test 1: Exactly 8 provisioned member accounts
  if (DEMO_PROFILES.length !== 8) {
    throw new Error(`Expected exactly 8 member profiles, got ${DEMO_PROFILES.length}`);
  }
  assertions.push('✓ Test 1: Exactly 8 authorized member accounts verified');

  // Test 2: Role separation
  const admins = DEMO_PROFILES.filter((p) => p.role === 'team_admin');
  const captains = DEMO_PROFILES.filter((p) => p.role === 'captain');
  const viceCaptains = DEMO_PROFILES.filter((p) => p.role === 'vice_captain');
  const members = DEMO_PROFILES.filter((p) => p.role === 'member');

  if (admins.length !== 1) throw new Error('Expected 1 Team Admin');
  if (captains.length !== 1) throw new Error('Expected 1 Captain');
  if (viceCaptains.length !== 1) throw new Error('Expected 1 Vice-Captain');
  if (members.length !== 5) throw new Error('Expected 5 ordinary Members');
  assertions.push('✓ Test 2: Operational role segregation verified (1 Admin, 1 Capt, 1 V-Capt, 5 Members)');

  // Test 3: Unique emails
  const emails = new Set(DEMO_PROFILES.map((p) => p.email.toLowerCase()));
  if (emails.size !== 8) throw new Error('Duplicate member emails detected');
  assertions.push('✓ Test 3: Account email uniqueness verified');

  // Test 4: Scoreboard Team 5 presence
  const ourTeam = DEMO_SCOREBOARD_GROUPS.find((g) => g.is_current_team);
  if (!ourTeam) throw new Error('ZENITH Team 5 not designated on scoreboard');
  if (ourTeam.group_number !== 5) throw new Error('Our team number must be 5');
  assertions.push('✓ Test 4: ZENITH (Team 5) identity and pinned standing verified');

  // Test 5: Four-Day Curriculum
  if (DEMO_TRAINING_DAYS.length !== 4) throw new Error('Expected 4 training days');
  const dayNumbers = DEMO_TRAINING_DAYS.map((d) => d.day_number);
  if (![1, 2, 3, 4].every((n) => dayNumbers.includes(n as any))) {
    throw new Error('Day numbers 1 to 4 must be present');
  }
  assertions.push('✓ Test 5: Four-Day Curriculum sequence verified (Days 1 to 4)');

  return assertions;
}

// Standalone execution if run directly via ts-node / node
if (require.main === module) {
  const results = runDomainVerificationTests();
  console.log('\n========================================');
  console.log(' ZENITH DOMAIN INTEGRITY TEST SUITE');
  console.log('========================================');
  results.forEach((r) => console.log(r));
  console.log('========================================\nALL VERIFICATION CHECKS PASSED!\n');
}
