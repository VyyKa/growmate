import type { AdoptionListItem } from "../types/apiResponse/adoptionResponse"

const TRIAL_STORAGE_KEY = "growmate_trial_adoptions"

export const saveTrialAdoption = (adoption: AdoptionListItem) => {
    const existing = getTrialAdoptions()
    const updated = [adoption, ...existing]
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify(updated))
}

export const getTrialAdoptions = (): AdoptionListItem[] => {
    const stored = localStorage.getItem(TRIAL_STORAGE_KEY)
    if (!stored) return []
    try {
        return JSON.parse(stored) as AdoptionListItem[]
    } catch {
        return []
    }
}

export const hasUsedTrial = (): boolean => {
    const adoptions = getTrialAdoptions()
    return adoptions.length > 0
}
