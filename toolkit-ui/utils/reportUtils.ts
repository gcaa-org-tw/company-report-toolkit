import { Report } from '~/libs/feathers/services/report/report.shared'

export function toPhysicalPageIndex (logicalPageIndex: number, report: Report) {
  const physicalWithoutLayout = logicalPageIndex - (report.pageOffset || 0)
  if (!report.is2Pages) {
    return physicalWithoutLayout
  }
  if (physicalWithoutLayout === 1) {
    return 1
  }
  // [2, 3] => 2, [4, 5] => 3, [6, 7] => 4
  return physicalWithoutLayout / 2 + 1
}

export function toLogicalPageIndex (physicalPageIndex: number, report: Report) {
  const logicalWithoutLayout = physicalPageIndex + (report.pageOffset || 0)
  if (!report.is2Pages) {
    return logicalWithoutLayout
  }
  if (physicalPageIndex === 1) {
    return logicalWithoutLayout
  }
  // 2 => [2, 3], 3 => [4, 5], 4 => [6, 7]
  return (physicalPageIndex - 1) * 2 + (report.pageOffset || 0)
}
