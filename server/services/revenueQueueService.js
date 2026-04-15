import { getPaymentsSnapshot } from './commerceService.js'
import { getLeadSnapshot, updateLeadStage } from './analyticsService.js'

function summarizeByKey(items, key) {
  return items.reduce((summary, item) => {
    const value = item[key] ?? 'unknown'
    summary[value] = (summary[value] ?? 0) + 1
    return summary
  }, {})
}

export async function getRevenueQueueSnapshot() {
  const [leads, payments] = await Promise.all([getLeadSnapshot(200), getPaymentsSnapshot()])
  const completedPayments = payments.filter((entry) => entry.status === 'completed')

  return {
    leads,
    payments: payments.slice(0, 200),
    totals: {
      openLeads: leads.filter((lead) => lead.status !== 'closed').length,
      completedPayments: completedPayments.length,
      revenue: completedPayments.reduce((sum, entry) => sum + (entry.amountCents ?? 0), 0) / 100
    },
    breakdowns: {
      leadStages: summarizeByKey(leads, 'stage'),
      leadStatuses: summarizeByKey(leads, 'status'),
      paymentStatuses: summarizeByKey(payments, 'status')
    }
  }
}

export { updateLeadStage }
