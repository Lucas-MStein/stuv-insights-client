<!-- frontend/src/pages/InsightsPage.vue -->
<template>
  <main class="insights-page">
    <header class="page-header">
      <h1>StuV Instagram Insights</h1>
      <p class="page-subtitle">
        Kurzer Überblick über die wichtigsten Kennzahlen deines Accounts
      </p>
    </header>

    <!-- Loading-State -->
    <section v-if="loading" class="state state-loading">
      <div class="spinner" />
      <p>Daten werden geladen …</p>
    </section>

    <!-- Error-State -->
    <section v-else-if="error" class="state state-error">
      <p>Ups, da ist etwas schiefgelaufen.</p>
      <p class="state-error__detail">{{ error }}</p>
      <button class="btn btn-ghost" @click="loadInsights">Erneut versuchen</button>
    </section>

    <!-- Inhalt -->
    <section v-else class="content">
      <!-- KPI-Karten -->
      <section class="kpi-grid">
        <!-- Reichweite (heute) -->
        <article class="card">
          <header class="card-header">
            <h2>Reichweite (heute)</h2>
            <p class="card-subtitle">Anzahl der erreichten Accounts</p>
          </header>

          <p class="kpi-value">
            {{ reachToday ?? "–" }}
            <span
                v-if="reachDelta !== null"
                class="kpi-delta"
                :class="reachDelta >= 0 ? 'kpi-delta--up' : 'kpi-delta--down'"
            >
              <span v-if="reachDelta > 0">+{{ reachDelta }}</span>
              <span v-else>{{ reachDelta }}</span>
              <span class="kpi-delta-label">vs. gestern</span>
            </span>
          </p>
        </article>

        <!-- Profilaufrufe (gesamt) -->
        <article class="card">
          <header class="card-header">
            <h2>Profilaufrufe (gesamt)</h2>
            <p class="card-subtitle">Total Value aus der API</p>
          </header>

          <p class="kpi-value">
            {{ profileViewsTotal ?? "–" }}
          </p>
        </article>

        <!-- Inhaltsaufrufe (gesamt) -->
        <article class="card">
          <header class="card-header">
            <h2>Inhaltsaufrufe (gesamt)</h2>
            <p class="card-subtitle">Reels, Beiträge &amp; Stories</p>
          </header>

          <p class="kpi-value">
            {{ viewsTotal ?? "–" }}
          </p>
        </article>
      </section>

      <!-- Trend-Bereich (letzte Tage Reichweite) -->
      <section v-if="reachHistory.length" class="trend">
        <header class="trend-header">
          <h3>Reichweiten-Trend</h3>
          <p class="trend-subtitle">
            Letzte {{ reachHistory.length }} Tage
          </p>
        </header>

        <ul class="trend-list">
          <li v-for="item in reachHistory" :key="item.date" class="trend-row">
            <span class="trend-date">{{ item.date }}</span>
            <div class="trend-bar-wrapper">
              <div
                  class="trend-bar"
                  :style="{ '--value': item.normalized }"
              />
            </div>
            <span class="trend-value">{{ item.value }}</span>
          </li>
        </ul>
      </section>

      <!-- Raw JSON für Debug -->
      <details class="debug">
        <summary>Raw API-Antwort (Debug)</summary>
        <pre>{{ formattedJson }}</pre>
      </details>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";

const loading = ref(false);
const error = ref("");
const insights = ref(null);

async function loadInsights() {
  loading.value = true;
  error.value = "";
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/insights`);
    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    insights.value = data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadInsights();
});

// ------- Helper-Computed für die Daten -------

// Reach: komplette Values-Liste
const reachValues = computed(
    () => insights.value?.reach?.data?.[0]?.values ?? []
);

const reachToday = computed(() => {
  const last = reachValues.value.at(-1);
  return last ? last.value : null;
});

const reachYesterday = computed(() => {
  const prev = reachValues.value.at(-2);
  return prev ? prev.value : null;
});

const reachDelta = computed(() => {
  if (reachToday.value == null || reachYesterday.value == null) return null;
  return reachToday.value - reachYesterday.value;
});

// Profilaufrufe & Views (total_value)
const totalsData = computed(() => insights.value?.totals?.data ?? []);

const profileViewsTotal = computed(() => {
  const item = totalsData.value.find((d) => d.name === "profile_views");
  return item?.total_value?.value ?? null;
});

const viewsTotal = computed(() => {
  const item = totalsData.value.find((d) => d.name === "views");
  return item?.total_value?.value ?? null;
});

// Reichweiten-Historie (einfaches „Bar-Chart“)
const reachHistory = computed(() => {
  if (!reachValues.value.length) return [];

  // letzte max. 7 Tage
  const lastDays = reachValues.value.slice(-7);
  const max = Math.max(...lastDays.map((v) => v.value || 0)) || 1;

  return lastDays.map((v) => ({
    date: new Date(v.end_time).toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }),
    value: v.value,
    normalized: v.value / max, // 0–1 für die Balkenbreite
  }));
});

// JSON hübsch formatiert
const formattedJson = computed(() =>
    insights.value ? JSON.stringify(insights.value, null, 2) : "{}"
);
</script>

<style scoped>
.insights-page {
  min-height: 100vh;
  padding: 3rem 1.5rem 4rem;
  color: #e5e7eb;
  background: radial-gradient(circle at top left, #0f172a, #020617 55%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto 2rem;
}

.page-header h1 {
  font-size: clamp(2rem, 3vw, 2.4rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0 0 0.5rem;
}

.page-subtitle {
  margin: 0;
  color: #9ca3af;
  font-size: 0.95rem;
}

.content {
  width: 100%;
  max-width: 1120px;
}

/* --- States --- */

.state {
  width: 100%;
  max-width: 480px;
  margin-top: 3rem;
  padding: 1.75rem 1.5rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.15);
  text-align: center;
}

.state-loading p,
.state-error p {
  margin: 0.25rem 0;
}

.state-error__detail {
  font-size: 0.85rem;
  color: #fca5a5;
  word-break: break-word;
}

.spinner {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: 3px solid rgba(148, 163, 184, 0.3);
  border-top-color: #38bdf8;
  margin: 0 auto 0.5rem;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn {
  margin-top: 0.75rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-ghost {
  background: transparent;
  border-color: rgba(148, 163, 184, 0.4);
  color: #e5e7eb;
}

.btn-ghost:hover {
  border-color: #38bdf8;
}

/* --- KPI Grid --- */

.kpi-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

/* ab 768px zwei Spalten, ab 1024px drei */
@media (min-width: 768px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card {
  background: radial-gradient(circle at top left, #111827, #020617);
  border-radius: 1.25rem;
  padding: 1.5rem 1.6rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.7);
}

.card-header h2 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 600;
}

.card-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #9ca3af;
}

.kpi-value {
  margin-top: 1.1rem;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

.kpi-delta {
  font-size: 0.9rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid transparent;
}

.kpi-delta--up {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.35);
}

.kpi-delta--down {
  color: #f97373;
  border-color: rgba(248, 113, 113, 0.35);
}

.kpi-delta-label {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* --- Trend-Bereich --- */

.trend {
  margin-bottom: 2.5rem;
  padding: 1.5rem 1.6rem;
  border-radius: 1.25rem;
  background: radial-gradient(circle at top left, #020617, #020617);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.trend-header h3 {
  margin: 0 0 0.2rem;
  font-size: 1rem;
}

.trend-subtitle {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

.trend-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.trend-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.trend-date {
  color: #9ca3af;
}

.trend-bar-wrapper {
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  overflow: hidden;
}

.trend-bar {
  --value: 0.5;
  height: 6px;
  border-radius: inherit;
  background: linear-gradient(90deg, #38bdf8, #22c55e);
  width: calc(var(--value) * 100%);
  transition: width 0.3s ease;
}

.trend-value {
  text-align: right;
}

/* --- Debug --- */

.debug {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: #020617;
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-size: 0.85rem;
}

.debug summary {
  cursor: pointer;
  color: #9ca3af;
}

.debug pre {
  margin: 0.5rem 0 0;
  max-height: 320px;
  overflow: auto;
  font-size: 0.8rem;
}
</style>