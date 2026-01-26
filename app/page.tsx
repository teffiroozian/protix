import Link from "next/link";
import Image from "next/image";
import restaurants from "./data/index.json";

export default function Home() {
    return (
        <main style={{ maxWidth: 1000, margin: "48px auto", padding: 16 }}>
            <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
                High Protein Fast Food Finder
            </h1>
            <p style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>
                Pick a restaurant to see the best high-protein options.
            </p>

            <section
                style={{
                    marginTop: 28,
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 18,
                }}
            >
                {restaurants.map((r) => (
                    <Link
                        key={r.id}
                        href={`/restaurant/${r.id}`}
                        style={{ textDecoration: "none" }}
                    >
                        <article
                            style={{
                                borderRadius: 18,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.04)",
                            }}
                        >
                            {/* Cover image */}
                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: 190,
                                    overflow: "hidden",
                                    borderRadius: 18,
                                }}
                            >
                                <Image
                                    src={r.cover}
                                    alt={`${r.name} cover`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            {/* Bottom bar with logo + name */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "14px 16px",
                                    background: "rgba(0,0,0,0.55)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        background: "rgba(255,255,255,0.08)",
                                        flex: "0 0 auto",
                                    }}
                                >
                                    <Image
                                        src={r.logo}
                                        alt={`${r.name} logo`}
                                        width={28}
                                        height={28}
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                <div
                                    style={{
                                        color: "white",
                                        fontSize: 18,
                                        fontWeight: 700,
                                    }}
                                >
                                    {r.name}
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </section>
        </main>
    );
}
