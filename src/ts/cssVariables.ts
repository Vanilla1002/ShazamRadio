function getCSSVariableValue(variableName: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  }
  
  const lightModePrimary = getCSSVariableValue('--light-mode-primary');
  const lightModeSecondary = getCSSVariableValue('--light-mode-Secondary');
  const lightModeAccent = getCSSVariableValue('--light-mode-Accent');
  
  const darkModePrimary = getCSSVariableValue('--dark-mode-primary');
  const darkModeSecondary = getCSSVariableValue('--dark-mode-Secondary');
  const darkModeAccent = getCSSVariableValue('--dark-mode-Accent');

  export {
    lightModePrimary,
    lightModeSecondary,
    lightModeAccent,
    darkModePrimary,
    darkModeSecondary,
    darkModeAccent
  }