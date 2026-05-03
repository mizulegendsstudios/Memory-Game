# 🗺️ Roadmap – Memory Game Project

Este documento reúne **ideas, mejoras, bugs, debilidades y propuestas de modularización** para el proyecto.  
El objetivo es mantener un registro vivo de la evolución del juego.

---

## 🚀 Features (Ideas futuras)
- [ ] **Modo VS IA** con distintos niveles de dificultad (random, memoria parcial, memoria perfecta).
- [ ] **Grid dinámico**: opciones 3x3, 4x4, 6x6, 8x8.
- [ ] **Selección de idioma** (EN/ES inicialmente, extensible a más).
- [ ] **Temas de cartas**: frutas/comida, animales/naturaleza, banderas, caras de emojis.
- [ ] **Sistema de estrellas** en modo solo (1–3 ⭐ según velocidad).
- [ ] **Responsive design**: ajuste automático a landscape/portrait.
- [ ] **Pantalla de menú inicial** para elegir opciones antes de jugar.
- [ ] **Animaciones adicionales** (transiciones suaves al voltear cartas, efectos de victoria).

---

## 🐞 Bugs conocidos
- [ ] En algunos navegadores, el sonido puede no reproducirse hasta que el usuario interactúe (limitación de Web Audio API).
- [ ] El temporizador no se reinicia correctamente si se refresca la página sin usar el botón de restart.
- [ ] Posible duplicación de emojis en el set inicial (ejemplo: 🎭 aparece dos veces).

---

## ⚠️ Debilidades técnicas
- Dependencia directa del DOM en `memory-game.js` (difícil de testear).
- Lógica de juego y renderizado mezcladas en la misma clase.
- Falta de separación entre **estado del juego** y **UI**.
- No hay persistencia de configuración (idioma, tema, grid) en `localStorage`.

---

## 🔒 Mejoras en seguridad
- Validar inputs del usuario al elegir opciones (grid size, idioma, tema).
- Evitar inyecciones en textos dinámicos (ej. traducciones o emojis externos).
- Revisar compatibilidad con navegadores móviles y permisos de audio.

---

## 🧩 Modularización propuesta
- **memory-game.js (módulo raíz)** → coordina todo.
- **modules/grid.js** → genera tableros dinámicos.
- **modules/theme.js** → gestiona sets de emojis/temas.
- **modules/language.js** → traducciones y textos.
- **modules/ai.js** → lógica de la IA.
- **modules/stars.js** → cálculo de estrellas.
- **modules/responsive.js** → ajustes al viewport.

---

## 📅 Roadmap de implementación
1. **Fase 1:** Grid dinámico + temas de cartas.  
2. **Fase 2:** Idiomas + responsive design.  
3. **Fase 3:** Sistema de estrellas + pantalla de menú inicial.  
4. **Fase 4:** Modo VS IA + animaciones avanzadas.  
5. **Fase 5:** Refactorización modular completa y persistencia en `localStorage`.

---

## 📌 Notas
Este archivo debe actualizarse con cada sprint o iteración.  
El README principal solo incluirá un **resumen breve**, mientras que aquí se documenta el detalle técnico y creativo.
