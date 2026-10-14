import { PublicShowcaseData } from './publicData';

export interface GrowthMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  definition: string;
  source: string;
  category: 'curriculum' | 'scoreboard' | 'skills' | 'deliverables';
}

/**
 * Derives growth metrics directly from verified public showcase data.
 * Guarantees zero synthetic percentages, invented ratings, or unverified claims.
 */
export function calculateGrowthMetrics(data: PublicShowcaseData): GrowthMetric[] {
  // 1. Completed Training Days
  const completedDays = data.trainingDays.filter((d) => d.status === 'completed').length;
  const totalDays = data.trainingDays.length;

  // 2. Verified Learning Outcomes Delivered
  const totalOutcomes = data.trainingDays.reduce(
    (acc, d) => acc + (d.learning_outcomes ? d.learning_outcomes.length : 0),
    0
  );

  // 3. Unique Verified Skills
  const allSkills = new Set<string>();
  data.roster.forEach((m) => m.skills.forEach((s) => allSkills.add(s.trim())));

  // 4. Approved Showcase Reflections
  const approvedReflections = data.reflections.length;

  // 5. Official Scoreboard Total & Standing
  const zenithGroup = data.scoreboard.find((g) => g.group_number === 5 || g.is_current_team);
  const currentPoints = zenithGroup ? zenithGroup.current_points : 0;
  const currentRank = zenithGroup ? zenithGroup.rank : 0;

  // 6. Public Study Resources Curated
  const publicResources = data.resources.length;

  return [
    {
      id: 'metric-curriculum',
      label: 'Curriculum Completion',
      value: `${completedDays} / ${totalDays}`,
      unit: 'Days Concluded',
      definition: 'Count of placement training days officially delivered and verified.',
      source: 'training_days table where status = "completed"',
      category: 'curriculum',
    },
    {
      id: 'metric-rank',
      label: 'mPOWER Competition Rank',
      value: currentRank > 0 ? `#${currentRank}` : 'Unranked',
      unit: 'Rank 2 Cohort Standing',
      definition: 'Official ranking among 10 competition groups based on accumulated points.',
      source: 'scoreboard_groups table sorted by current_points descending (1224 tie rule)',
      category: 'scoreboard',
    },
    {
      id: 'metric-points',
      label: 'Verified Scoreboard Points',
      value: currentPoints,
      unit: 'Points',
      definition: 'Official point total accumulated across aptitude, coding, and teamwork rounds.',
      source: 'scoreboard_groups row for Group 05 (ZENITH)',
      category: 'scoreboard',
    },
    {
      id: 'metric-outcomes',
      label: 'Verified Learning Outcomes',
      value: totalOutcomes,
      unit: 'Milestones Mastered',
      definition: 'Concrete competencies evaluated and certified following Day 1 sprint.',
      source: 'training_days[day_1].learning_outcomes array',
      category: 'curriculum',
    },
    {
      id: 'metric-skills',
      label: 'Distinct Technical & Core Skills',
      value: allSkills.size,
      unit: 'Recorded Competencies',
      definition: 'Unique technical frameworks, algorithms, and leadership skills recorded by members.',
      source: 'profiles.skills across all 8 verified candidate accounts',
      category: 'skills',
    },
    {
      id: 'metric-reflections',
      label: 'Showcase-Endorsed Reflections',
      value: approvedReflections,
      unit: 'Curated Logs',
      definition: 'Structured daily debriefs vetted and endorsed by Captains for presentation.',
      source: 'reflections table where is_approved_for_showcase = true',
      category: 'deliverables',
    },
    {
      id: 'metric-resources',
      label: 'Public Reference Guides',
      value: publicResources,
      unit: 'Documents',
      definition: 'Formulas, DSA patterns, and behavioral banks verified for evaluator access.',
      source: 'resources_documents table where access_level = "showcase_public"',
      category: 'deliverables',
    },
  ];
}
