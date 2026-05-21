import { Marquee } from "@/components/magicui/marquee";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MarqueeSection() {
  const brands = [
    { name: "AgriTech Solutions", initials: "AT" },
    { name: "PlantCare Systems", initials: "PC" },
    { name: "GreenLeaf Research", initials: "GL" },
    { name: "FarmSense Analytics", initials: "FA" },
    { name: "BotanicalAI", initials: "BA" },
    { name: "HarvestHealth", initials: "HH" },
    { name: "CropVision Labs", initials: "CV" },
    { name: "EcoGrowth Institute", initials: "EG" },
    { name: "BioDynamics", initials: "BD" },
    { name: "TerraCrop Systems", initials: "TC" },
  ];

  return (
    <section className="py-16 bg-[#07090e] border-b border-white/5 overflow-hidden">
      <div className="container mx-auto mb-10 text-center px-6">
        <h2 className="text-3xl font-extrabold text-white font-urbanist">
          Trusted by Innovative Botanical Experts
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto font-urbanist">
          Integrating next-gen spectral mapping across crop research labs and home growers.
        </p>
      </div>

      <Marquee className="py-2" pauseOnHover speed={25}>
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="mx-4 flex items-center gap-3 px-5 py-3.5 bg-gray-900/40 border border-white/5 hover:border-emerald-500/20 shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-102"
          >
            <Avatar className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex-shrink-0">
              <AvatarFallback className="text-emerald-400 font-bold text-xs bg-emerald-500/10">
                {brand.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-200 font-urbanist">{brand.name}</span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
