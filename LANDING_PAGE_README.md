# Landing Page e Navigazione Isometrica - Implementazione

## ✅ Funzionalità Implementate

### 1. Landing Page Iniziale
- **Design minimale**: Sfondo con gradiente grigio chiaro (neutro e pulito)
- **Due brand placeholders**: "LOGO BRAND A" e "LOGO BRAND B" posizionati orizzontalmente al centro
- **Effetti interattivi**: 
  - Hover con ingrandimento (1.08x scale) e sollevamento (-8px translateY)
  - Cambio opacità con overlay gradiente
  - Transizioni fluide con cubic-bezier easing
  - Ombra dinamica che si intensifica al passaggio del mouse

### 2. Logica di Navigazione
- **Transizione fluida**: Fade-out di 800ms della landing page al click su un logo
- **Caricamento scene**: 
  - Click su "Brand A" → Carica Building Isometrico A
  - Click su "Brand B" → Carica Building Isometrico B
- **Fade-in del container 3D**: Dopo il fade-out della landing page, il container 3D diventa visibile

### 3. Camera Isometrica
- **PerspectiveCamera con FOV 30°**: Simula prospettiva isometrica
- **Posizione camera**: (15, 15, 15) per vista diagonale ottimale
- **OrbitControls configurati**:
  - `maxPolarAngle = Math.PI / 2.2` → Previene discesa sotto il pavimento
  - `minDistance = 10`, `maxDistance = 40` → Limiti di zoom
  - `enableDamping = true` → Movimento fluido e naturale
  - Pan disabilitato per mantenere focus sul building

### 4. Placeholder Buildings (Geometrie Bianche)

#### Building A - Torre Moderna Multi-Livello
- **Base**: Cubo 4x1x4 (fondamenta larghe)
- **Torre principale**: Cubo 3x6x3 (corpo centrale)
- **Sezione superiore**: Cubo 2x2x2 (coronamento)
- **Dettagli decorativi**: 3 piccoli cubi (0.5x0.5x0.5) disposti radialmente

#### Building B - Complesso Orizzontale Connesso
- **Ala sinistra**: Cubo 2x4x3
- **Torre centrale**: Cubo 3x7x3 (elemento più alto)
- **Ala destra**: Cubo 2x4x3
- **Connettore superiore**: Cubo 6x0.5x2 (ponte tra le ali)
- **Elementi decorativi**: 4 piccoli cubi disposti simmetricamente

#### Caratteristiche comuni:
- Materiale: MeshStandardMaterial bianco (0xffffff)
- Proprietà: roughness: 0.3, metalness: 0.1
- Cast shadows e receive shadows abilitati
- Pavimento grigio (30x30) con shadows

### 5. Sistema di Illuminazione
- **Ambient Light**: Intensità 0.6 per illuminazione base uniforme
- **Directional Light**: 
  - Intensità 0.8 con ombre (PCFSoftShadowMap)
  - Shadow map size: 2048x2048 per qualità superiore
  - Camera shadow frustum: 20x20 unità

### 6. Pulsante "Torna alla Home"
- **Posizione**: Top-left (30px, 30px)
- **Design**: 
  - Sfondo bianco semi-trasparente (0.95 opacity)
  - Border-radius 12px per look moderno
  - Box-shadow per effetto floating
  - Hover con sollevamento e ombra aumentata
- **Funzionalità**:
  - Fade-out del container 3D (800ms)
  - Ritorno alla landing page con fade-in
  - Reset completo della scena 3D
  - Visibile solo quando in vista 3D

### 7. Responsive Design
- **Desktop**: Layout orizzontale dei brand logo (gap: 60px)
- **Mobile** (< 768px): 
  - Layout verticale (flex-direction: column)
  - Logo ridimensionati a 280x280px
  - Font-size ridotto per brand text

## 🎨 Stile Visivo

- **Color Palette**:
  - Background landing: Gradiente #f5f5f5 → #e8e8e8
  - Brand cards: Bianco puro (#ffffff)
  - Text: Grigio scuro (#333)
  - 3D background: Grigio chiaro (#f0f0f0)

- **Animazioni**:
  - Tutte le transizioni usano easing smooth
  - Durata standard: 0.4s per hover, 0.8s per navigazione
  - GSAP ready per future animazioni complesse

## 🔧 Struttura Tecnica

### File Modificato
- `frontend/index.html` - Completamente ristrutturato

### Dipendenze
- Three.js (three.module.js)
- OrbitControls.js
- GSAP 3.12.2 (per future animazioni)

### Architettura
```javascript
// State Management
let camera, renderer, controls;
let currentScene = null;
let sceneA = null;  // Lazy-loaded
let sceneB = null;  // Lazy-loaded
let currentBrand = null;

// Funzioni principali
- createBuildingA() → Genera scena A
- createBuildingB() → Genera scena B
- show3DScene(brand) → Gestisce transizione landing → 3D
- returnToLanding() → Gestisce transizione 3D → landing
- animate() → Loop di rendering principale
```

## 🚀 Come Testare

1. Apri `frontend/index.html` in un browser moderno
2. Dovresti vedere la landing page con i due brand logo
3. Passa il mouse sopra i logo per vedere gli effetti hover
4. Clicca su "LOGO BRAND A" per vedere il Building A
5. Clicca su "← Torna alla Home" per tornare alla landing
6. Clicca su "LOGO BRAND B" per vedere il Building B
7. Usa il mouse per ruotare la camera attorno al building (non può andare sotto il pavimento)
8. Usa lo scroll del mouse per zoom in/out (limitato tra 10 e 40 unità)

## 📝 Note per il Futuro

### Prossimi Step Suggeriti:
1. **Sostituire placeholder con modelli GLB reali**:
   ```javascript
   const loader = new GLTFLoader();
   loader.load('building-a.glb', (gltf) => {
     scene.add(gltf.scene);
   });
   ```

2. **Aggiungere loghi reali**: Sostituire i testi "LOGO BRAND A/B" con immagini SVG/PNG

3. **Animazioni avanzate**: 
   - Intro animata dei brand logo
   - Transizione 3D più elaborata (rotazione camera durante switch)
   - Micro-interazioni sui building elements

4. **Ottimizzazioni**:
   - Preload dei modelli 3D in background
   - Frustum culling per performance
   - LOD (Level of Detail) per mobile

5. **Features aggiuntive**:
   - Suoni ambiente/click
   - Particelle atmosferiche nella scena 3D
   - Info tooltip sui building elements
   - Modalità fullscreen

## 🎯 Risultato

Un'esperienza utente fluida e moderna che permette di navigare tra due brand distinti attraverso una landing page elegante e due ambienti 3D isometrici interattivi, con transizioni smooth e controlli intuitivi.
