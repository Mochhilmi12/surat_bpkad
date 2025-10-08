import SuratStatsMetrics from "@/components/shared/SuratStatsMetrics";
import SuratTableInline from "@/components/surat/SuratTableInline";

export default async function HomePage() {
  return (
    <div className="wrapper space-y-6">

      <SuratStatsMetrics />

      <SuratTableInline />
    </div>
  );
}