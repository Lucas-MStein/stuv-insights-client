// frontend/src/store/insightsStore.js
import { ref } from 'vue'

const loading = ref(false)
const error = ref(null)
const insights = ref(null)

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function fetchInsights() {
    loading.value = true
    error.value = null

    try {
        const res = await fetch(`${API_BASE_URL}/api/insights`)

        if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`)
        }

        const data = await res.json()
        insights.value = data
    } catch (err) {
        console.error('Error fetching insights:', err)
        error.value = err.message ?? 'Unbekannter Fehler'
    } finally {
        loading.value = false
    }
}

export function useInsightsStore() {
    return {
        loading,
        error,
        insights,
        fetchInsights,
    }
}