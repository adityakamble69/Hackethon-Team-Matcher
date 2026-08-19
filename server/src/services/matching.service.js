// Pure, testable compatibility-scoring function. See architecture.md §5 for the formula.
// Weights: role 35%, skill complement 30%, interest overlap 20%, level balance 10%, team-size match 5%

const LEVEL_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 };

export function computeCompatibilityScore(userA, userB) {
  const roleScore = scoreRoleComplement(userA, userB);
  const skillScore = scoreSkillGap(userA, userB);
  const interestScore = scoreInterestOverlap(userA, userB);
  const levelScore = scoreLevelBalance(userA, userB);
  const teamSizeScore = scoreTeamSizeMatch(userA, userB);

  const total =
    roleScore * 0.35 +
    skillScore * 0.3 +
    interestScore * 0.2 +
    levelScore * 0.1 +
    teamSizeScore * 0.05;

  return Math.round(total * 100); // 0-100
}

// 1 if B's preferred role(s) are NOT already covered by A, else lower.
// Partial overlap gives a proportional score.
function scoreRoleComplement(userA, userB) {
  const aRoles = new Set(userA.preferred_roles || []);
  const bRoles = userB.preferred_roles || [];
  if (bRoles.length === 0) return 0;

  const newRoles = bRoles.filter((r) => !aRoles.has(r)).length;
  return newRoles / bRoles.length;
}

// Proportion of B's skills that A does NOT already have — rewards filling gaps,
// penalizes near-duplicate skillsets.
function scoreSkillGap(userA, userB) {
  const aSkills = new Set(userA.skills || []);
  const bSkills = userB.skills || [];
  if (bSkills.length === 0) return 0;

  const gapSkills = bSkills.filter((s) => !aSkills.has(s)).length;
  return gapSkills / bSkills.length;
}

// Jaccard similarity of interest tags between A and B.
function scoreInterestOverlap(userA, userB) {
  const aInterests = new Set(userA.interests || []);
  const bInterests = new Set(userB.interests || []);
  if (aInterests.size === 0 && bInterests.size === 0) return 0;

  const intersection = [...aInterests].filter((i) => bInterests.has(i)).length;
  const union = new Set([...aInterests, ...bInterests]).size;
  return union === 0 ? 0 : intersection / union;
}

// Penalize if both are beginners on the same shared skill (no one can lead on it).
// Reward mentor/mentee spread or matched-level pairs on shared skills.
// Skills only one of them has don't affect this score.
function scoreLevelBalance(userA, userB) {
  const aLevels = userA.skill_levels || {};
  const bLevels = userB.skill_levels || {};
  const sharedSkills = Object.keys(aLevels).filter((s) => s in bLevels);

  if (sharedSkills.length === 0) return 0.5; // no shared skills = neutral, not a penalty

  let sum = 0;
  for (const skill of sharedSkills) {
    const aLevel = LEVEL_RANK[aLevels[skill]] || 1;
    const bLevel = LEVEL_RANK[bLevels[skill]] || 1;
    const gap = Math.abs(aLevel - bLevel);

    if (aLevel === 1 && bLevel === 1) {
      sum += 0; // both beginners on the same skill — worst case
    } else if (gap >= 2) {
      sum += 1; // mentor/mentee spread (e.g. Beginner + Advanced) — best case
    } else {
      sum += 0.6; // matched mid/high levels or a 1-step gap — decent
    }
  }
  return sum / sharedSkills.length;
}

// 1 if both users' team-size preferences are compatible (equal, or one/both unset), else 0.
function scoreTeamSizeMatch(userA, userB) {
  const a = userA.team_size_pref;
  const b = userB.team_size_pref;
  if (!a || !b) return 1; // unset preference = no conflict
  return a === b ? 1 : 0;
}
