import "server-only";

import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import * as React from "react";

import type { ScanResult } from "./types";

const COLORS = {
  brand: "#1DB954",
  charcoal: "#2C3038",
  stone: "#5A6170",
  stoneLight: "#8A919C",
  stoneBg: "#F8F9FA",
  border: "#E5E7EB",
  amber: "#D97706",
  red: "#DC2626",
  white: "#FFFFFF",
  ink: "#0B0D0F",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 10,
    color: COLORS.charcoal,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 14,
    marginBottom: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.brand,
    color: COLORS.ink,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    textAlign: "center",
  },
  brandText: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  smallMeta: { fontSize: 8, color: COLORS.stone },

  heroBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    gap: 24,
  },
  scoreCol: { width: 140, alignItems: "center" },
  scoreNumber: { fontSize: 56, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  scoreGrade: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.white,
  },
  scoreLabel: { marginTop: 8, fontSize: 8, color: COLORS.stoneLight, textAlign: "center" },

  heroBody: { flex: 1 },
  heroEyebrow: {
    fontSize: 8,
    color: COLORS.brand,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  heroDomain: { fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  heroVerdict: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLORS.charcoal,
    marginTop: 10,
    lineHeight: 1.4,
  },
  heroStatsRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  heroStat: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: COLORS.stoneBg,
  },
  heroStatLabel: { fontSize: 7, color: COLORS.stoneLight, fontFamily: "Helvetica-Bold" },
  heroStatValue: {
    marginTop: 3,
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.charcoal,
  },
  heroStatHelp: { marginTop: 1, fontSize: 7, color: COLORS.stoneLight },

  sectionLabel: {
    fontSize: 8,
    color: COLORS.brand,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  sectionTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },

  categoryGrid: { marginTop: 14, gap: 10 },
  categoryRow: {
    flexDirection: "row",
    gap: 10,
  },
  categoryBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  categoryScore: { fontSize: 18, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  categorySummary: {
    fontSize: 8,
    color: COLORS.stone,
    marginTop: 4,
    lineHeight: 1.4,
  },
  findingsBlock: { marginTop: 8, gap: 4 },
  findingRow: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  findingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
  },
  findingText: { fontSize: 8, color: COLORS.charcoal, flex: 1, lineHeight: 1.4 },
  findingDetail: { fontSize: 7, color: COLORS.stoneLight, marginTop: 1 },

  recBlock: { marginTop: 8 },
  recItem: {
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brand,
    paddingLeft: 10,
    marginBottom: 10,
  },
  recBadgeRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    borderRadius: 2,
  },
  recTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.charcoal },
  recSummary: { fontSize: 8, color: COLORS.stone, marginTop: 3, lineHeight: 1.4 },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: COLORS.stoneLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
});

function ringColorForScore(score: number) {
  if (score >= 65) return COLORS.brand;
  if (score >= 50) return COLORS.amber;
  return COLORS.red;
}

function findingDotColor(status: "pass" | "warn" | "fail") {
  if (status === "pass") return COLORS.brand;
  if (status === "warn") return COLORS.amber;
  return COLORS.red;
}

function priorityColor(p: string) {
  if (p === "CRITICAL") return { bg: "#FEE2E2", fg: COLORS.red };
  if (p === "HIGH") return { bg: "#FEF3C7", fg: COLORS.amber };
  if (p === "MEDIUM") return { bg: "#E8F8EE", fg: COLORS.brand };
  return { bg: "#F0F1F3", fg: COLORS.stone };
}

function ReportDocument({ result }: { result: ScanResult }) {
  const okCategories = result.categories.filter((c) => c.availability === "ok");
  const lockedCategories = result.categories.filter(
    (c) => c.availability === "skipped",
  );
  const ringColor = ringColorForScore(result.overallScore);
  const kb = Math.round(result.meta.pageSizeBytes / 1024);
  const criticalCount = result.recommendations.filter(
    (r) => r.priority === "CRITICAL" || r.priority === "HIGH",
  ).length;

  // Group categories into rows of 2 for grid layout
  const rows: typeof okCategories[] = [];
  for (let i = 0; i < okCategories.length; i += 2) {
    rows.push(okCategories.slice(i, i + 2));
  }

  return (
    <Document
      title={`A3 Brands GSC Audit - ${result.domain}`}
      author="A3 Brands"
      subject="GSC SEO Audit"
    >
      {/* Cover + summary */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoBox}>A3</Text>
            <Text style={styles.brandText}>A3 Brands</Text>
          </View>
          <Text style={styles.smallMeta}>
            GSC INTELLIGENCE AUDIT · {new Date(result.scannedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </Text>
        </View>

        <View style={styles.heroBox}>
          <View style={styles.scoreCol}>
            <Text style={styles.scoreNumber}>{result.overallScore}</Text>
            <Text style={{ ...styles.scoreGrade, backgroundColor: ringColor }}>
              GRADE {result.grade}
            </Text>
            <Text style={styles.scoreLabel}>
              {okCategories.length}-CATEGORY SEO SCORE
            </Text>
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.heroEyebrow}>AUDIT SUBJECT</Text>
            <Text style={styles.heroDomain}>{result.domain}</Text>
            <Text style={{ fontSize: 8, color: COLORS.stoneLight, marginTop: 1 }}>
              {result.url}
            </Text>
            <Text style={styles.heroVerdict}>{result.shortVerdict}</Text>

            <View style={styles.heroStatsRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>HTTP STATUS</Text>
                <Text style={styles.heroStatValue}>{result.meta.httpStatus}</Text>
                <Text style={styles.heroStatHelp}>
                  {result.meta.fetchMs} ms fetch
                </Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>PAGE WEIGHT</Text>
                <Text style={styles.heroStatValue}>{kb.toLocaleString()} KB</Text>
                <Text style={styles.heroStatHelp}>
                  {result.meta.schemaCount} schema block(s)
                </Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatLabel}>PRIORITY ACTIONS</Text>
                <Text style={styles.heroStatValue}>{criticalCount}</Text>
                <Text style={styles.heroStatHelp}>critical + high</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CATEGORY BREAKDOWN</Text>
        <Text style={styles.sectionTitle}>What we checked on {result.domain}</Text>

        <View style={styles.categoryGrid}>
          {rows.map((row, i) => (
            <View key={i} style={styles.categoryRow}>
              {row.map((cat) => {
                const tone =
                  cat.score >= 80
                    ? COLORS.brand
                    : cat.score >= 60
                      ? COLORS.amber
                      : COLORS.red;
                return (
                  <View key={cat.id} style={styles.categoryBox}>
                    <View style={styles.categoryHeader}>
                      <View>
                        <Text style={{ fontSize: 7, color: COLORS.stoneLight, fontFamily: "Helvetica-Bold" }}>
                          {cat.id.toUpperCase()}
                        </Text>
                        <Text style={styles.categoryName}>{cat.name}</Text>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={{ ...styles.categoryScore, color: tone }}>
                          {cat.score}
                        </Text>
                        <Text style={{ fontSize: 7, color: COLORS.stoneLight }}>/ 100</Text>
                      </View>
                    </View>
                    <Text style={styles.categorySummary}>{cat.summary}</Text>

                    <View style={styles.findingsBlock}>
                      {cat.findings.slice(0, 6).map((f, fi) => (
                        <View key={fi} style={styles.findingRow}>
                          <View
                            style={{
                              ...styles.findingDot,
                              backgroundColor: findingDotColor(f.status),
                            }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.findingText}>{f.label}</Text>
                            {f.detail ? (
                              <Text style={styles.findingDetail}>{f.detail}</Text>
                            ) : null}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              })}
              {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>
            A3 Brands · GSC Intelligence Platform · Confidential audit for{" "}
            {result.domain}
          </Text>
          <Text>1 / 2</Text>
        </View>
      </Page>

      {/* Recommendations + locked */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoBox}>A3</Text>
            <Text style={styles.brandText}>A3 Brands</Text>
          </View>
          <Text style={styles.smallMeta}>{result.domain.toUpperCase()}</Text>
        </View>

        <Text style={styles.sectionLabel}>RECOMMENDATIONS</Text>
        <Text style={styles.sectionTitle}>Ship these to lift {result.domain}</Text>
        <Text style={{ fontSize: 8, color: COLORS.stone, marginTop: 4, marginBottom: 12 }}>
          Every recommendation is derived from a finding on the previous page -
          no fabricated impact estimates.
        </Text>

        <View style={styles.recBlock}>
          {result.recommendations.slice(0, 8).map((rec) => {
            const c = priorityColor(rec.priority);
            return (
              <View key={rec.id} style={styles.recItem}>
                <View style={styles.recBadgeRow}>
                  <Text
                    style={{
                      ...styles.badge,
                      backgroundColor: c.bg,
                      color: c.fg,
                    }}
                  >
                    {rec.priority}
                  </Text>
                  <Text
                    style={{
                      ...styles.badge,
                      backgroundColor: COLORS.stoneBg,
                      color: COLORS.stone,
                    }}
                  >
                    {rec.category}
                  </Text>
                </View>
                <Text style={styles.recTitle}>{rec.title}</Text>
                <Text style={styles.recSummary}>{rec.summary}</Text>
                {rec.estimatedClicksGain || rec.effortHours ? (
                  <Text
                    style={{
                      ...styles.recSummary,
                      marginTop: 4,
                      color: COLORS.brand,
                      fontFamily: "Helvetica-Bold",
                      fontSize: 8,
                    }}
                  >
                    {rec.estimatedClicksGain
                      ? `+${rec.estimatedClicksGain.toLocaleString()} clicks/mo (est)`
                      : ""}
                    {rec.estimatedClicksGain && rec.effortHours ? "  ·  " : ""}
                    {rec.effortHours ? `${rec.effortHours}h effort` : ""}
                    {rec.confidence
                      ? `  ·  ${Math.round(rec.confidence * 100)}% confidence`
                      : ""}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>

        {lockedCategories.length > 0 ? (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionLabel}>UNLOCKABLE WITH GSC + GBP</Text>
            <Text style={styles.sectionTitle}>
              Two more categories unlock with API access
            </Text>
            <View style={{ marginTop: 8, gap: 6 }}>
              {lockedCategories.map((cat) => (
                <View
                  key={cat.id}
                  style={{
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    borderStyle: "dashed",
                    borderRadius: 6,
                    padding: 10,
                  }}
                >
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={{ fontSize: 8, color: COLORS.stone, marginTop: 3, lineHeight: 1.4 }}>
                    {cat.summary}
                  </Text>
                  {cat.reason ? (
                    <Text
                      style={{
                        fontSize: 7,
                        color: COLORS.stoneLight,
                        marginTop: 4,
                        lineHeight: 1.4,
                      }}
                    >
                      {cat.reason}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text>
            A3 Brands · Audit method: {result.source === "pagespeed" ? "Google PageSpeed Insights API" : "Direct HTTP fetch + HTML parse"}
          </Text>
          <Text>2 / 2</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateReportPdf(result: ScanResult): Promise<Buffer> {
  return renderToBuffer(<ReportDocument result={result} />);
}
