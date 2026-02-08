import EducationLayout from "@/components/EducationLayout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function EducationArizona() {
  return (
    <>
      <SEO
        pageTitle="Arizona Campus – AeThex Education"
        description="AeThex Education is planning a physical campus in Arizona, run by the Foundation, built by AeThex Corp, and tested by AeThex Labs."
      />
      <EducationLayout>
        <section className="bg-gradient-to-br from-orange-100 via-orange-50 to-orange-200 py-20 min-h-[60vh] flex items-center justify-center">
          <div className="max-w-2xl mx-auto text-center space-y-8 px-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-orange-700 mb-4">AeThex Education: Arizona Campus</h1>
            <p className="text-lg text-orange-900 mb-6">
              <span className="font-semibold">Coming Soon:</span> AeThex Education is exploring a physical campus in Arizona!<br />
              <span className="block mt-2">Run by the <span className="text-orange-600 font-bold">AeThex Foundation</span>, built by <span className="text-orange-600 font-bold">AeThex Corp</span>, and tested by <span className="text-orange-600 font-bold">AeThex Labs</span>.</span>
            </p>
            <p className="text-base text-orange-800 mb-8">
              Our vision: a real-world hub for game development, metaverse building, and hands-on learning. Connect with mentors, join workshops, and help shape the future of immersive education in Arizona and beyond.
            </p>
            <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold px-8 py-3 rounded shadow hover:from-orange-600 hover:to-orange-800 transition">
              <a href="/enroll">Get Notified</a>
            </Button>
          </div>
        </section>
      </EducationLayout>
    </>
  );
}
