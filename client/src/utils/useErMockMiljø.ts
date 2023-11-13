export function useErMockMiljø(): boolean {
  const erLokaltEllerLabs = window.appSettings.USE_MSW === true
  return erLokaltEllerLabs
}
