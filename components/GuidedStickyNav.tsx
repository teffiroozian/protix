import Link from "next/link";
import Image from "next/image";

type GuidedStickyNavProps = {
  restaurantName: string;
  restaurantLogo: string;
  containerMaxWidth?: number; // lets you match your page width easily
};

export default function GuidedStickyNav({
  restaurantName,
  restaurantLogo,
  containerMaxWidth = 900,
}: GuidedStickyNavProps) {
  return (
    // Full-width sticky wrapper (both bars)
    <div style={{ position: "sticky", top: 0, zIndex: 60 }}>
      {/* ================================
          Sticky Bar #1: Restaurant Header Bar (full width)
         ================================ */}
      <div
        style={{
          width: "100%",
          background: "rgba(245,245,245,0.95)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Centered container */}
        <div
          style={{
            maxWidth: containerMaxWidth,
            margin: "0 auto",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Link href="/" style={{ textDecoration: "none", fontWeight: 700 }}>
            ←
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                position: "relative",
                width: 26,
                height: 26,
                borderRadius: 8,
                overflow: "hidden",
                background: "white",
                border: "1px solid rgba(0,0,0,0.08)",
                flex: "0 0 auto",
              }}
            >
              <Image
                src={restaurantLogo}
                alt={`${restaurantName} logo`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <div style={{ fontWeight: 800 }}>{restaurantName}</div>
          </div>
        </div>
      </div>

      {/* ================================
          Sticky Bar #2: Section Tabs Bar (full width)
         ================================ */}
      <div
        style={{
          width: "100%",
          background: "rgba(245,245,245,0.95)",
          backdropFilter: "blur(6px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Centered container */}
        <div
          style={{
            maxWidth: containerMaxWidth,
            margin: "0 auto",
            padding: "10px 16px 12px",
            display: "flex",
            gap: 10,
            overflowX: "auto",
          }}
        >
          {/* Section jump links */}
          <a
            href="#high-protein"
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              fontWeight: 800,
              whiteSpace: "nowrap",
              color: "black",
              background: "white",
            }}
          >
            High Protein
          </a>

          <a
            href="#best-protein-ratio"
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              fontWeight: 800,
              whiteSpace: "nowrap",
              color: "black",
              background: "white",
            }}
          >
            Best Protein Ratio
          </a>

          <a
            href="#lowest-calorie"
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              fontWeight: 800,
              whiteSpace: "nowrap",
              color: "black",
              background: "white",
            }}
          >
            Lowest Calorie
          </a>
        </div>
      </div>
    </div>
  );
}
