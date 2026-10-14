import { ScoreboardGroup } from '../types';

export interface RankedScoreboardGroup extends ScoreboardGroup {
  rank: number;
  is_tied: boolean;
  rank_display: string;
  rank_movement: number | null; // Positive = climbed, Negative = dropped, 0 = unchanged, null = no baseline
}

/**
 * Calculates standard competition rankings ("1224" ranking rule).
 * If two groups tie for 1st, both receive Rank 1, and the next group receives Rank 3.
 * Deterministic secondary sorting uses group_number ASC to guarantee stable ordering.
 */
export function calculateCompetitionRankings(
  groups: ScoreboardGroup[]
): RankedScoreboardGroup[] {
  if (!groups || groups.length === 0) return [];

  // Sort by net points descending, break ties deterministically by group_number ascending
  const sorted = [...groups].sort((a, b) => {
    const netA = a.current_points + (a.bonus_points || 0) - (a.penalty_points || 0);
    const netB = b.current_points + (b.bonus_points || 0) - (b.penalty_points || 0);

    if (netB !== netA) {
      return netB - netA;
    }
    return a.group_number - b.group_number;
  });

  // Calculate prior rankings to determine authentic rank movement (if previous_points exists)
  const prevRankMap = new Map<string, number>();
  const hasPreviousBaseline = sorted.some((g) => g.previous_points !== undefined && g.previous_points > 0);

  if (hasPreviousBaseline) {
    const prevSorted = [...groups].sort((a, b) => {
      const netA = a.previous_points || 0;
      const netB = b.previous_points || 0;
      if (netB !== netA) return netB - netA;
      return a.group_number - b.group_number;
    });

    let prevRank = 1;
    for (let i = 0; i < prevSorted.length; i++) {
      if (i > 0) {
        const currNet = prevSorted[i].previous_points || 0;
        const priorNet = prevSorted[i - 1].previous_points || 0;
        if (currNet < priorNet) {
          prevRank = i + 1; // Competition rank skip
        }
      }
      prevRankMap.set(prevSorted[i].id, prevRank);
    }
  }

  // Assign 1224 competition rankings
  const rankedGroups: RankedScoreboardGroup[] = [];
  let currentRank = 1;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const netPoints = current.current_points + (current.bonus_points || 0) - (current.penalty_points || 0);

    if (i > 0) {
      const prior = sorted[i - 1];
      const priorNet = prior.current_points + (prior.bonus_points || 0) - (prior.penalty_points || 0);

      if (netPoints < priorNet) {
        // Standard competition ranking: jump to (index + 1)
        currentRank = i + 1;
      }
    }

    // Check if tied with adjacent peers
    const isTiedWithNext =
      i < sorted.length - 1 &&
      netPoints ===
        (sorted[i + 1].current_points + (sorted[i + 1].bonus_points || 0) - (sorted[i + 1].penalty_points || 0));

    const isTiedWithPrev =
      i > 0 &&
      netPoints ===
        (sorted[i - 1].current_points + (sorted[i - 1].bonus_points || 0) - (sorted[i - 1].penalty_points || 0));

    const is_tied = isTiedWithNext || isTiedWithPrev;

    // Movement calculation
    let rank_movement: number | null = null;
    if (prevRankMap.has(current.id)) {
      const previousRank = prevRankMap.get(current.id)!;
      // Movement = previousRank - currentRank (e.g. from rank 3 to rank 1 is +2 climb)
      rank_movement = previousRank - currentRank;
    }

    const rank_display = is_tied ? `T-${currentRank}` : `#0${currentRank}`.slice(-3);

    rankedGroups.push({
      ...current,
      rank: currentRank,
      is_tied,
      rank_display,
      rank_movement,
    });
  }

  return rankedGroups;
}
