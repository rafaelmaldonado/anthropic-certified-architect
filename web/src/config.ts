// ─────────────────────────────────────────────────────────────────────────────
//  CERTIFICATION CONFIG
//
//  This file + `data/syllabus.ts` is EVERYTHING you need to edit to reuse the app
//  for another certification. There is no hardcoded branding text in the
//  components; they all read from here.
//
//  To clone for another certification:
//    1. Edit CERT (below) with the name, description, and thresholds.
//    2. Rewrite `src/data/syllabus.ts` with the domains/topics/quizzes.
//    3. (Optional) Adjust the suggested-deadline plan on each domain.
// ─────────────────────────────────────────────────────────────────────────────

export interface CertConfig {
  /** Short name, shown in the top bar and login (e.g. "Architect Prep"). */
  appName: string
  /** Full certification name. */
  certName: string
  /** Subtitle phrase on login/dashboard. */
  tagline: string
  /** Language of the generated podcast (free text, embedded in the prompt). */
  podcastLanguage: string
  /** Quiz threshold (%) to consider a domain "ready"/completable. */
  quizReadyThreshold: number
  /** If true, passing the quiz is REQUIRED to check off the domain's topics. */
  requireQuizToComplete: boolean
  /** Number of questions shown per quiz attempt. */
  quizSize: number
}

export const CERT: CertConfig = {
  appName: 'Architect Prep',
  certName: 'Claude Certified Architect – Foundations',
  tagline: 'Your progress toward the Claude Certified Architect certification.',
  podcastLanguage: 'English',
  quizReadyThreshold: 80,
  requireQuizToComplete: true,
  quizSize: 6,
}
