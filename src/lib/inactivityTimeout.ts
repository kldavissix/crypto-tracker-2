let inactivityTimeout: NodeJS.Timeout

const startInactivityTimeout = (onTimeout: () => void): void => {
  clearInactivityTimeout()
  inactivityTimeout = setTimeout(() => {
    onTimeout()
  }, Number(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT))
}

const clearInactivityTimeout = (): void => {
  if (inactivityTimeout) {
    clearTimeout(inactivityTimeout)
  }
}

const resetInactivityTimeout = (onTimeout: () => void): void => {
  clearInactivityTimeout()
  startInactivityTimeout(onTimeout)
}

export {
  startInactivityTimeout,
  resetInactivityTimeout,
  clearInactivityTimeout,
}
