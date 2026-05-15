import FleetPlanner from '@/components/admin/FleetPlanner'
import { PageHeader } from '@/components/admin/Ui'

export default function PartnerFleetPage() {
  return (
    <>
      <PageHeader title="Fleet planning" subtitle="Check availability and assign your pending requests." />
      <FleetPlanner canManageFleet={false} />
    </>
  )
}
