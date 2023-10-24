import type { reportSchema } from '~/libs/feathers/services/report/report.schema'

export interface IndustryStats { total: number, answered: number, isVerified: number, name: string }
export interface IndustryStatsMap {
  [key: string]: { total: number, answered: number, isVerified: number, name: string }
}

export function mergeReportStats (industryStats: IndustryStatsMap, report: typeof reportSchema) {
  const isAllAnswered = report.totalFields === report.answeredFields
  const isVerified = report.isVerified
  const industry = report.company.industry
  if (!industryStats[industry]) {
    industryStats[industry] = { total: 0, answered: 0, isVerified: 0, name: industry }
  }
  industryStats[industry].total += 1
  industryStats[industry].answered += isAllAnswered ? 1 : 0
  industryStats[industry].isVerified += isVerified ? 1 : 0
}
