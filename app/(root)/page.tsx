import SuratStatsMetrics from "@/components/shared/SuratStatsMetrics";
import SuratTableInline from "@/components/surat/SuratTableInline";

export default async function HomePage() {
  return (
    <div className="wrapper flex flex-col gap-6 py-6 sm:py-8">

      <SuratStatsMetrics />

      <SuratTableInline />
    </div>
  );
}
