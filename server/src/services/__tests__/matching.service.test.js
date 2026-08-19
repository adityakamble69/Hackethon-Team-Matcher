// Minimal assertion-based sanity tests for computeCompatibilityScore.
// Run with: node src/services/__tests__/matching.service.test.js
import { computeCompatibilityScore } from '../matching.service.js';

function assert(cond, msg) {
  if (!cond) throw new Error('FAILED: ' + msg);
  console.log('PASS: ' + msg);
}

// Case 1: perfect complement — different roles, different skills, shared interest,
// mentor/mentee level, same team-size pref -> should score high.
const a1 = {
  preferred_roles: ['Frontend'],
  skills: ['React', 'Tailwind'],
  interests: ['FinTech', 'AI'],
  skill_levels: { React: 'Advanced' },
  team_size_pref: 4,
};
const b1 = {
  preferred_roles: ['Backend'],
  skills: ['Node', 'Postgres'],
  interests: ['FinTech'],
  skill_levels: { React: 'Beginner' },
  team_size_pref: 4,
};
const score1 = computeCompatibilityScore(a1, b1);
assert(score1 >= 70, `high-complement pair scores high (got ${score1})`);

// Case 2: identical profiles — same role, same skills, same interests, same beginner
// level on shared skill, same team size -> should score low.
const a2 = {
  preferred_roles: ['Frontend'],
  skills: ['React'],
  interests: ['AI'],
  skill_levels: { React: 'Beginner' },
  team_size_pref: 4,
};
const b2 = { ...a2 };
const score2 = computeCompatibilityScore(a2, b2);
assert(score2 <= 30, `duplicate-profile pair scores low (got ${score2})`);

// Case 3: mismatched team size should only cost the 5% weight, not tank the whole score.
const a3 = { ...a1, team_size_pref: 3 };
const b3 = { ...b1, team_size_pref: 5 };
const score3 = computeCompatibilityScore(a3, b3);
assert(score1 - score3 <= 6, `team-size mismatch only costs ~5% (diff=${score1 - score3})`);

// Case 4: empty profiles shouldn't throw or produce NaN.
const score4 = computeCompatibilityScore({}, {});
assert(Number.isFinite(score4), `empty profiles produce a finite score (got ${score4})`);

console.log('\nAll matching.service tests passed.');
