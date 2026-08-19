// Pure, testable compatibility-scoring function. See architecture.md §5 for the formula.
// Weights: role 35%, skill complement 30%, interest overlap 20%, level balance 10%, team-size match 5%

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

function scoreRoleComplement(userA, userB) {
  // TODO: 1 if B's preferred role is not already covered by A/A's team, else lower
  return 0;
}

function scoreSkillGap(userA, userB) {
  // TODO: proportion of B's skills that A does NOT have
  return 0;
}

function scoreInterestOverlap(userA, userB) {
  // TODO: Jaccard similarity of interest tags
  return 0;
}

function scoreLevelBalance(userA, userB) {
  // TODO: penalize same-skill same-beginner pairs, reward balanced/mentor pairs
  return 0;
}

function scoreTeamSizeMatch(userA, userB) {
  // TODO: 1 if team-size preferences are compatible, else 0
  return 0;
}
