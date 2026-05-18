/**
 * Realistic seed data for A3 Brands GSC Intelligence Platform.
 * Run with: npm run db:seed
 */
import { PrismaClient, Role, DealershipTier, Brand, KeywordIntent, InsightCategory, InsightPriority, InsightStatus, LeadStatus, LeadSource, NotificationType, ReportType, ReportStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ALL_BRANDS: Brand[] = [
  Brand.FORD,
  Brand.TOYOTA,
  Brand.CHEVROLET,
  Brand.HONDA,
  Brand.JEEP,
  Brand.BMW,
];

const CITIES: Array<{ city: string; state: string; lat: number; lng: number }> = [
  { city: "Dallas", state: "TX", lat: 32.7767, lng: -96.797 },
  { city: "Plano", state: "TX", lat: 33.0198, lng: -96.6989 },
  { city: "Frisco", state: "TX", lat: 33.1507, lng: -96.8236 },
  { city: "Austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { city: "Houston", state: "TX", lat: 29.7604, lng: -95.3698 },
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

async function main() {
  console.log("Seeding A3 Brands GSC Intelligence Platform…");

  // Clean slate
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.technicalIssue.deleteMany();
  await prisma.localRanking.deleteMany();
  await prisma.reviewSnapshot.deleteMany();
  await prisma.gSCMetric.deleteMany();
  await prisma.keyword.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.sEOReport.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.dealershipMember.deleteMany();
  await prisma.dealership.deleteMany();
  await prisma.dealerGroup.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Dealer group
  const group = await prisma.dealerGroup.create({
    data: {
      name: "A3 Brands Auto Group",
      slug: "lonestar-auto-group",
      websiteUrl: "https://lonestarauto.example",
      marketArea: "Dallas-Fort Worth Metroplex",
      principalDealerName: "Charles Rourke",
      contactEmail: "ops@lonestarauto.example",
    },
  });

  // Users
  const passwordHash = await bcrypt.hash("Demo!2026", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Charles Rourke",
      email: "principal@lonestarford.com",
      passwordHash,
      role: Role.ADMIN,
      title: "Principal Dealer",
      dealerGroupId: group.id,
    },
  });

  const marketing = await prisma.user.create({
    data: {
      name: "Priya Desai",
      email: "marketing@lonestarford.com",
      passwordHash,
      role: Role.MARKETING_DIRECTOR,
      title: "Marketing Director",
      dealerGroupId: group.id,
    },
  });

  const gm = await prisma.user.create({
    data: {
      name: "Marcus Hill",
      email: "gm@lonestarford.com",
      passwordHash,
      role: Role.GENERAL_MANAGER,
      title: "General Manager",
      dealerGroupId: group.id,
    },
  });

  // Dealerships
  const dealershipSeeds: Array<{
    name: string;
    brand: Brand;
    tier: DealershipTier;
    city: (typeof CITIES)[number];
  }> = [
    { name: "A3 Brands Ford of Plano", brand: Brand.FORD, tier: DealershipTier.FLAGSHIP, city: CITIES[1]! },
    { name: "A3 Brands Toyota of Frisco", brand: Brand.TOYOTA, tier: DealershipTier.STANDARD, city: CITIES[2]! },
    { name: "A3 Brands Honda Dallas", brand: Brand.HONDA, tier: DealershipTier.STANDARD, city: CITIES[0]! },
    { name: "A3 Brands Chevrolet Austin", brand: Brand.CHEVROLET, tier: DealershipTier.STANDARD, city: CITIES[3]! },
    { name: "A3 Brands BMW Houston", brand: Brand.BMW, tier: DealershipTier.FLAGSHIP, city: CITIES[4]! },
  ];

  const dealerships = [];
  for (const seed of dealershipSeeds) {
    const slug = seed.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const d = await prisma.dealership.create({
      data: {
        name: seed.name,
        slug,
        brand: seed.brand,
        tier: seed.tier,
        websiteUrl: `https://${slug}.example`,
        gbpUrl: `https://www.google.com/maps/place/${slug}`,
        gscPropertyId: `sc-domain:${slug}.example`,
        city: seed.city.city,
        state: seed.city.state,
        country: "US",
        latitude: seed.city.lat,
        longitude: seed.city.lng,
        addressLine1: `${rand(100, 9999)} ${pick(["Preston Rd", "Plano Pkwy", "Stemmons Fwy", "Mockingbird Ln", "Westheimer Rd"])}`,
        postalCode: `${rand(75000, 78999)}`,
        dealerGroupId: group.id,
        seoHealthScore: rand(62, 92),
        leadOpportunityScore: rand(55, 95),
        localVisibilityScore: rand(60, 95),
        competitorRank: rand(1, 6),
        lastScannedAt: new Date(),
      },
    });
    dealerships.push(d);

    // Membership
    await prisma.dealershipMember.create({
      data: { userId: admin.id, dealershipId: d.id, role: Role.ADMIN },
    });
    await prisma.dealershipMember.create({
      data: { userId: marketing.id, dealershipId: d.id, role: Role.MARKETING_DIRECTOR },
    });
    if (d.name.includes("Plano")) {
      await prisma.dealershipMember.create({
        data: { userId: gm.id, dealershipId: d.id, role: Role.GENERAL_MANAGER },
      });
    }
  }

  // ---- GSC Metrics: 90 days of time-series per dealership ----
  const today = new Date();
  for (const d of dealerships) {
    const metrics = [];
    for (let daysAgo = 89; daysAgo >= 0; daysAgo--) {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      date.setUTCHours(0, 0, 0, 0);

      const seasonal = 1 + Math.sin(daysAgo / 18) * 0.18;
      const growth = 1 + (89 - daysAgo) * 0.003;
      const baseClicks = (d.tier === "FLAGSHIP" ? 320 : 180) * seasonal * growth;
      const noise = randFloat(0.85, 1.15);
      const clicks = Math.floor(baseClicks * noise);
      const impressions = Math.floor(clicks * randFloat(18, 26));
      const ctr = (clicks / impressions) * 100;

      metrics.push({
        dealershipId: d.id,
        date,
        device: null,
        country: "USA",
        clicks,
        impressions,
        ctr: Number(ctr.toFixed(2)),
        position: randFloat(4.2, 9.5, 2),
      });
    }
    await prisma.gSCMetric.createMany({ data: metrics });
  }

  // ---- Keywords per dealership ----
  const keywordTemplates: Array<{ q: (b: string, city: string) => string; intent: KeywordIntent; branded: boolean }> = [
    { q: (b, c) => `${b.toLowerCase()} dealer near me`, intent: KeywordIntent.LOCAL, branded: true },
    { q: (b, c) => `${b.toLowerCase()} dealership ${c.toLowerCase()}`, intent: KeywordIntent.LOCAL, branded: true },
    { q: (b, c) => `new ${b.toLowerCase()} for sale ${c.toLowerCase()}`, intent: KeywordIntent.TRANSACTIONAL, branded: true },
    { q: (b, c) => `${b.toLowerCase()} lease deals ${c.toLowerCase()}`, intent: KeywordIntent.COMMERCIAL, branded: true },
    { q: (b, c) => `used ${b.toLowerCase()} ${c.toLowerCase()}`, intent: KeywordIntent.COMMERCIAL, branded: false },
    { q: (b, c) => `${b.toLowerCase()} service center ${c.toLowerCase()}`, intent: KeywordIntent.SERVICE, branded: true },
    { q: (b, c) => `${b.toLowerCase()} oil change ${c.toLowerCase()}`, intent: KeywordIntent.SERVICE, branded: false },
    { q: (b) => `${b.toLowerCase()} f-150 inventory`, intent: KeywordIntent.INVENTORY, branded: true },
    { q: (b) => `2026 ${b.toLowerCase()} models`, intent: KeywordIntent.INFORMATIONAL, branded: true },
    { q: (b, c) => `best ${b.toLowerCase()} dealer ${c.toLowerCase()}`, intent: KeywordIntent.COMMERCIAL, branded: true },
  ];

  for (const d of dealerships) {
    const data = keywordTemplates.map((tpl) => {
      const query = tpl.q(d.brand.toString(), d.city);
      const position = randFloat(2.5, 22.5, 1);
      const impressions = rand(800, 14000);
      const ctr = position < 4 ? randFloat(8, 22) : position < 10 ? randFloat(2, 6) : randFloat(0.4, 1.6);
      const clicks = Math.floor((ctr / 100) * impressions);
      return {
        dealershipId: d.id,
        query,
        intent: tpl.intent,
        isBranded: tpl.branded,
        searchVolume: rand(500, 22000),
        difficulty: rand(28, 78),
        cpcCents: rand(120, 1400),
        currentPosition: position,
        previousPosition: position + randFloat(-3, 3, 1),
        bestPosition: position - randFloat(0, 4, 1),
        clicks,
        impressions,
        ctr: Number(ctr.toFixed(2)),
        url: `${d.websiteUrl}/${tpl.intent.toLowerCase()}`,
        tags: tpl.branded ? ["branded"] : ["non-branded"],
      };
    });
    await prisma.keyword.createMany({ data });
  }

  // ---- Competitors ----
  for (const d of dealerships) {
    const competitorNames = [
      "AutoNation Ford",
      "Group 1 Toyota",
      "Sonic Automotive Honda",
      "Lithia Chevrolet",
      "Penske BMW",
      "Sewell Automotive",
    ];
    const data = competitorNames.slice(0, 4).map((name, i) => ({
      dealershipId: d.id,
      name,
      domain: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`,
      brand: d.brand,
      city: d.city,
      state: d.state,
      distanceMiles: randFloat(0.8, 12, 1),
      visibilityScore: rand(45, 92),
      sharedKeywords: rand(40, 220),
      outrankedBy: rand(8, 60),
      averagePosition: randFloat(3.5, 12, 1),
      estimatedTraffic: rand(4000, 38000),
    }));
    await prisma.competitor.createMany({ data });
  }

  // ---- AI Insights ----
  const insightTemplates: Array<Omit<Parameters<typeof prisma.aIInsight.create>[0]["data"], "dealershipId">> = [
    {
      title: "Competitors outrank you for Ford lease keywords",
      summary:
        "AutoNation Ford holds positions 1-3 for 14 lease-intent queries in your market, while you average position 8.4. Lease landing pages lack pricing schema and don't target city-specific queries.",
      rationale: "Page authority gap of 11 points + missing localized H1 tags + no monthly payment schema.",
      category: InsightCategory.COMPETITIVE,
      priority: InsightPriority.HIGH,
      estimatedClicksGain: 1240,
      estimatedRevenueGainUsd: 68000,
      effortHours: 18,
      confidence: 0.82,
      actions: [
        { label: "Generate optimized lease pages", href: "#", kind: "primary" },
        { label: "View competitor gap report", href: "#", kind: "secondary" },
      ],
    },
    {
      title: "Improve metadata on service pages",
      summary:
        "32 service-related URLs are missing meta descriptions or have descriptions over 165 characters. Title tags do not include the dealership city, hurting local CTR.",
      category: InsightCategory.SERVICE_PAGE,
      priority: InsightPriority.MEDIUM,
      estimatedClicksGain: 380,
      estimatedRevenueGainUsd: 21000,
      effortHours: 6,
      confidence: 0.91,
      actions: [
        { label: "Auto-rewrite with AI", href: "#", kind: "primary" },
      ],
    },
    {
      title: "Add local inventory schema",
      summary:
        "Your vehicle detail pages are missing Vehicle and Offer schema markup. Competitors with these schemas earn 2.3x more rich-result impressions in your market.",
      category: InsightCategory.SCHEMA,
      priority: InsightPriority.CRITICAL,
      estimatedClicksGain: 2100,
      estimatedRevenueGainUsd: 142000,
      effortHours: 14,
      confidence: 0.88,
      actions: [
        { label: "Install schema package", href: "#", kind: "primary" },
      ],
    },
    {
      title: "Optimize mobile page speed",
      summary:
        "Largest Contentful Paint on inventory pages averages 4.1s on mobile (target ≤2.5s). Hero images aren't using next-gen formats and CSS is render-blocking.",
      category: InsightCategory.PERFORMANCE,
      priority: InsightPriority.HIGH,
      estimatedClicksGain: 620,
      effortHours: 9,
      confidence: 0.93,
      actions: [{ label: "Run lighthouse audit", href: "#", kind: "primary" }],
    },
    {
      title: "Create city-specific landing pages",
      summary:
        "You rank for 6 surrounding cities (Frisco, Allen, McKinney, Wylie, Murphy, Lucas) but have no dedicated landing pages. Building these can capture an additional ~9,400 monthly impressions.",
      category: InsightCategory.LOCAL_SEO,
      priority: InsightPriority.MEDIUM,
      estimatedClicksGain: 940,
      estimatedRevenueGainUsd: 52000,
      effortHours: 22,
      confidence: 0.79,
      actions: [
        { label: "Generate city pages with AI", href: "#", kind: "primary" },
      ],
    },
    {
      title: "Google Business Profile photos are stale",
      summary:
        "Last photo upload was 47 days ago. Profiles with weekly photo updates see 35% more direction requests and calls.",
      category: InsightCategory.GOOGLE_BUSINESS,
      priority: InsightPriority.LOW,
      effortHours: 1,
      confidence: 0.97,
      actions: [{ label: "Schedule photo refresh", href: "#", kind: "primary" }],
    },
  ];

  for (const d of dealerships) {
    for (const tpl of insightTemplates) {
      await prisma.aIInsight.create({
        data: {
          ...tpl,
          dealershipId: d.id,
          status: pick([InsightStatus.NEW, InsightStatus.NEW, InsightStatus.NEW, InsightStatus.IN_PROGRESS]),
        },
      });
    }
  }

  // ---- Local rankings (map pack samples) ----
  for (const d of dealerships) {
    const queries = [
      `${d.brand.toLowerCase()} dealer`,
      `${d.brand.toLowerCase()} dealership near me`,
      `new ${d.brand.toLowerCase()}`,
      `used ${d.brand.toLowerCase()}`,
      `${d.brand.toLowerCase()} service`,
    ];
    const data = [];
    for (const q of queries) {
      for (let grid = 0; grid < 9; grid++) {
        const position = rand(1, 18);
        data.push({
          dealershipId: d.id,
          query: q,
          city: d.city,
          state: d.state,
          position,
          inMapPack: position <= 3,
          gridLat: (d.latitude ?? 0) + (Math.floor(grid / 3) - 1) * 0.08,
          gridLng: (d.longitude ?? 0) + ((grid % 3) - 1) * 0.08,
        });
      }
    }
    await prisma.localRanking.createMany({ data });
  }

  // ---- Review snapshots ----
  for (const d of dealerships) {
    await prisma.reviewSnapshot.create({
      data: {
        dealershipId: d.id,
        totalReviews: rand(450, 2400),
        averageRating: randFloat(4.1, 4.8, 2),
        newReviews30d: rand(12, 84),
        responseRate: randFloat(62, 96, 1),
        sentimentPositive: randFloat(0.62, 0.84, 2),
        sentimentNeutral: randFloat(0.08, 0.18, 2),
        sentimentNegative: randFloat(0.05, 0.18, 2),
      },
    });
  }

  // ---- Technical issues ----
  for (const d of dealerships) {
    const issues = [
      { title: "12 pages missing H1 tag", category: InsightCategory.TECHNICAL, severity: InsightPriority.MEDIUM },
      { title: "Broken canonical on /inventory/*", category: InsightCategory.TECHNICAL, severity: InsightPriority.HIGH },
      { title: "Mobile viewport meta missing on 3 pages", category: InsightCategory.PERFORMANCE, severity: InsightPriority.LOW },
      { title: "Duplicate title tags across service pages", category: InsightCategory.CONTENT, severity: InsightPriority.MEDIUM },
    ];
    const data = issues.map((it) => ({
      dealershipId: d.id,
      url: `${d.websiteUrl}/inventory/`,
      title: it.title,
      description: "Detected during latest crawl. Address to improve crawl efficiency and ranking signals.",
      category: it.category,
      severity: it.severity,
    }));
    await prisma.technicalIssue.createMany({ data });
  }

  // ---- Sample reports ----
  for (const d of dealerships) {
    await prisma.sEOReport.create({
      data: {
        dealershipId: d.id,
        type: ReportType.MONTHLY_FULL,
        status: ReportStatus.READY,
        title: `${d.name} - Monthly SEO Report (April 2026)`,
        periodStart: new Date("2026-04-01"),
        periodEnd: new Date("2026-04-30"),
        summary:
          "Clicks +18% MoM; CTR improved 0.4pp; map-pack appearances rose 22%. Top opportunity: deploy Vehicle schema sitewide.",
        requestedById: marketing.id,
        completedAt: new Date(),
      },
    });
  }

  // ---- Sample leads ----
  const leadSeeds = [
    { name: "Daniela Pierce", email: "d.pierce@autodealer.example", source: LeadSource.GSC_SCAN, status: LeadStatus.NEW, scanScore: 64, message: "Need help fixing our inventory pages." },
    { name: "Brett Allgood", email: "brett@premierford.example", source: LeadSource.DEMO_REQUEST, status: LeadStatus.DEMO_SCHEDULED, message: "20-rooftop group, looking for executive reporting." },
    { name: "Hannah Ortega", email: "h.ortega@toyotaworld.example", source: LeadSource.WEBSITE_FORM, status: LeadStatus.QUALIFIED, message: "Want to discuss local SEO across 6 stores." },
  ];
  for (const lead of leadSeeds) {
    await prisma.lead.create({
      data: {
        ...lead,
        dealerGroupId: group.id,
        ownerId: marketing.id,
        estimatedValue: rand(6000, 48000),
      },
    });
  }

  // ---- Notifications ----
  for (const user of [admin, marketing, gm]) {
    await prisma.notification.createMany({
      data: [
        { userId: user.id, type: NotificationType.AI_INSIGHT, title: "3 new high-priority AI insights", body: "Review your recommendation queue.", href: "/insights" },
        { userId: user.id, type: NotificationType.RANKING_GAIN, title: "A3 Brands Ford of Plano jumped to position 2", body: "‘ford f-150 plano’ now ranks #2 (was #7).", href: "/keywords" },
        { userId: user.id, type: NotificationType.REPORT_READY, title: "Monthly SEO report ready", body: "April 2026 report has been generated.", href: "/reports" },
      ],
    });
  }

  console.log("Seed complete.");
  console.log("Login emails (password Demo!2026):");
  console.log("  - principal@lonestarford.com (Admin)");
  console.log("  - marketing@lonestarford.com (Marketing Director)");
  console.log("  - gm@lonestarford.com (General Manager)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
