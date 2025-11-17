<template>
  <main class="page">
    <h1 class="page-title">StuV Instagram Insights</h1>

    <section class="cards">
      <article class="card" v-if="reachToday !== null">
        <h2>Reichweite (heute)</h2>
        <p class="value">{{ reachToday }}</p>
        <p class="hint">Anzahl der erreichten Accounts</p>
      </article>

      <article class="card" v-if="profileViews !== null">
        <h2>Profilaufrufe (gesamt)</h2>
        <p class="value">{{ profileViews }}</p>
        <p class="hint">Total Value aus der API</p>
      </article>

      <article class="card" v-if="views !== null">
        <h2>Inhaltsaufrufe (gesamt)</h2>
        <p class="value">{{ views }}</p>
        <p class="hint">Reels, Beiträge & Stories</p>
      </article>
    </section>

    <section class="state">
      <p v-if="loading">Lade Insights…</p>
      <p v-else-if="error" class="error">Fehler: {{ error }}</p>
    </section>

    <section class="raw-json" v-if="insights">
      <h2>Raw API-Antwort (Debug)</h2>
      <pre>{{ insights }}</pre>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useInsightsStore } from '../store/insightsStore'

const { loading, error, insights, fetchInsights } = useInsightsStore()

onMounted(() => {
  fetchInsights()
})

// Hilfs-Computed: Daten aus dem JSON ziehen
const reachToday = computed(() => {
  const reachData = insights.value?.reach?.data?.[0]?.values
  if (!reachData || !reachData.length) return null
  // letztes Element = aktuellster Tag
  return reachData[reachData.length - 1].value ?? null
})

const profileViews = computed(() => {
  const items = insights.value?.totals?.data ?? []
  const pv = items.find((i) => i.name === 'profile_views')
  return pv?.total_value?.value ?? null
})

const views = computed(() => {
  const items = insights.value?.totals?.data ?? []
  const v = items.find((i) => i.name === 'views')
  return v?.total_value?.value ?? null
})
</script>

<style scoped>
.page {
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
  sans-serif;
  background: #0f172a;
  color: #e5e7eb;
  min-height: 100vh;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.cards {
  display: grid;
  gap: 1.5rem;
}

.card {
  background: #111827;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.card h2 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.value {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.25rem 0 0.5rem;
}

.hint {
  font-size: 0.85rem;
  color: #9ca3af;
}

.state {
  margin-top: 1.5rem;
}

.error {
  color: #fca5a5;
}

.raw-json {
  margin-top: 2rem;
  background: #020617;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.8rem;
  overflow: auto;
}
</style>