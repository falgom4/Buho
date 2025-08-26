#!/usr/bin/env node

/**
 * Health Check Script para Buho Editor
 * Verifica que la aplicación esté funcionando correctamente
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, COLORS.GREEN);
    return true;
  } else {
    log(`❌ ${description}`, COLORS.RED);
    return false;
  }
}

function checkDependency(command, description) {
  try {
    execSync(command, { stdio: 'ignore' });
    log(`✅ ${description}`, COLORS.GREEN);
    return true;
  } catch (error) {
    log(`❌ ${description}`, COLORS.RED);
    return false;
  }
}

function checkNodeModules() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  let allInstalled = true;
  log(`\n${COLORS.BOLD}Verificando dependencias:${COLORS.RESET}`);
  
  Object.keys(dependencies).forEach(dep => {
    const depPath = path.join('node_modules', dep);
    if (fs.existsSync(depPath)) {
      log(`✅ ${dep}`, COLORS.GREEN);
    } else {
      log(`❌ ${dep}`, COLORS.RED);
      allInstalled = false;
    }
  });
  
  return allInstalled;
}

async function main() {
  log(`${COLORS.BOLD}🏔️ Buho Editor - Health Check${COLORS.RESET}\n`);
  
  let allChecksPass = true;
  
  // Verificar archivos principales
  log(`${COLORS.BOLD}Verificando archivos principales:${COLORS.RESET}`);
  allChecksPass &= checkFile('package.json', 'package.json existe');
  allChecksPass &= checkFile('src/App.tsx', 'App.tsx principal existe');
  allChecksPass &= checkFile('src/main.tsx', 'main.tsx punto de entrada existe');
  allChecksPass &= checkFile('index.html', 'index.html existe');
  allChecksPass &= checkFile('vite.config.ts', 'vite.config.ts existe');
  
  // Verificar estructura de componentes
  log(`\n${COLORS.BOLD}Verificando estructura de componentes:${COLORS.RESET}`);
  allChecksPass &= checkFile('src/components/Layout/AppHeader.tsx', 'AppHeader componente');
  allChecksPass &= checkFile('src/components/TourViewer/TourViewer.tsx', 'TourViewer componente');
  allChecksPass &= checkFile('src/components/ProjectManager/ProjectManager.tsx', 'ProjectManager componente');
  allChecksPass &= checkFile('src/components/WelcomeScreen/WelcomeScreen.tsx', 'WelcomeScreen componente');
  allChecksPass &= checkFile('src/components/Help/HelpCenter.tsx', 'HelpCenter componente');
  allChecksPass &= checkFile('src/components/Onboarding/GuidedTour.tsx', 'GuidedTour componente');
  
  // Verificar hooks
  log(`\n${COLORS.BOLD}Verificando hooks personalizados:${COLORS.RESET}`);
  allChecksPass &= checkFile('src/hooks/useResponsive.ts', 'useResponsive hook');
  allChecksPass &= checkFile('src/hooks/useKeyboardShortcuts.ts', 'useKeyboardShortcuts hook');
  allChecksPass &= checkFile('src/hooks/useSidePanels.ts', 'useSidePanels hook');
  allChecksPass &= checkFile('src/hooks/useGuidedTour.ts', 'useGuidedTour hook');
  
  // Verificar stores
  log(`\n${COLORS.BOLD}Verificando stores (Zustand):${COLORS.RESET}`);
  allChecksPass &= checkFile('src/stores/projectStore.ts', 'projectStore');
  allChecksPass &= checkFile('src/stores/tourStore.ts', 'tourStore');
  allChecksPass &= checkFile('src/stores/editorStore.ts', 'editorStore');
  allChecksPass &= checkFile('src/stores/routeEditorStore.ts', 'routeEditorStore');
  
  // Verificar tipos
  log(`\n${COLORS.BOLD}Verificando tipos TypeScript:${COLORS.RESET}`);
  allChecksPass &= checkFile('src/types/index.ts', 'Definiciones de tipos principales');
  
  // Verificar dependencias del sistema
  log(`\n${COLORS.BOLD}Verificando dependencias del sistema:${COLORS.RESET}`);
  allChecksPass &= checkDependency('node --version', 'Node.js está instalado');
  allChecksPass &= checkDependency('npm --version', 'npm está instalado');
  
  // Verificar node_modules
  allChecksPass &= checkNodeModules();
  
  // Intentar compilar TypeScript
  log(`\n${COLORS.BOLD}Verificando compilación TypeScript:${COLORS.RESET}`);
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log('✅ TypeScript compila sin errores', COLORS.GREEN);
  } catch (error) {
    log('❌ Errores de TypeScript encontrados', COLORS.RED);
    log(error.stdout?.toString() || error.message, COLORS.YELLOW);
    allChecksPass = false;
  }
  
  // Verificar que el build funcione
  log(`\n${COLORS.BOLD}Verificando build de producción:${COLORS.RESET}`);
  try {
    execSync('npm run build', { stdio: 'ignore' });
    log('✅ Build de producción exitoso', COLORS.GREEN);
    allChecksPass &= checkFile('dist/index.html', 'dist/index.html generado');
  } catch (error) {
    log('❌ Error en build de producción', COLORS.RED);
    allChecksPass = false;
  }
  
  // Resumen final
  log(`\n${COLORS.BOLD}═══════════════════════════════════════${COLORS.RESET}`);
  if (allChecksPass) {
    log(`🎉 ${COLORS.BOLD}¡Todas las verificaciones pasaron!${COLORS.RESET}`, COLORS.GREEN);
    log(`✨ Buho Editor está listo para usar.`, COLORS.GREEN);
    log(`\n🚀 Para iniciar la aplicación ejecuta: ${COLORS.BOLD}npm run dev${COLORS.RESET}`);
  } else {
    log(`⚠️  ${COLORS.BOLD}Algunas verificaciones fallaron${COLORS.RESET}`, COLORS.RED);
    log(`🔧 Por favor revisa los errores arriba y corrígelos.`, COLORS.YELLOW);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}