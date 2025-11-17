// frontend/src/store/insightsStore.js
import { defineStore } from 'pinia'

export const useInsightsStore = defineStore('insights', {
    state: () => ({
        data: null,
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchInsights() {
            this.isLoading = true
            this.error = null

            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
                const res = await fetch(`${baseUrl}/api/insights`)

                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`)
                }

                const json = await res.json()
                this.data = json
            } catch (err) {
                console.error('Fehler beim Laden der Insights:', err)
                this.error = err instanceof Error ? err.message : String(err)
            } finally {
                this.isLoading = false
            }
        },
    },
})