# Cert Prep — tracker de estudio para certificaciones

App personal para registrar el avance hacia una certificación técnica. Incluye temario
con checklist, pesos por dominio, barras de progreso, fechas límite (con sugerencias),
racha, mapa de calor de estudio, quizzes con banco de preguntas e historial de
calificaciones, recursos por tema y generación de podcast (NotebookLM). Sincroniza entre
dispositivos con login de Google.

Configurada actualmente para **Claude Certified Architect – Foundations (CCA-F)**, pero
es **reutilizable para cualquier certificación** (ver "Clonar para otra certificación").

> Estética estilo Apple: minimalista, responsive, tema claro.

## Clonar para otra certificación

Toda la parte específica vive en **dos archivos**:

1. **`src/config.ts`** — identidad y reglas: nombre de la app, nombre de la
   certificación, idioma del podcast, umbral del quiz (`quizReadyThreshold`), si aprobar
   el quiz es requisito para completar temas (`requireQuizToComplete`) y nº de preguntas
   por intento (`quizSize`).
2. **`src/data/syllabus.ts`** — el array `SYLLABUS`: dominios (con `weight` %,
   `suggestedDeadline`), `topics` (cada uno con sus `resources`) y el banco de `quiz`.

Ningún componente tiene texto de marca hardcodeado; todos leen de `config.ts`. Para una
nueva cert: edita esos dos archivos, opcionalmente cambia el favicon en `public/`, y
listo. (Recomendado: crea un nuevo proyecto Firebase para no mezclar datos.)

## Stack

- **React + Vite + TypeScript + Tailwind CSS**
- **Firebase** — Google Sign-In + Firestore (sync en vivo)
- **Vercel** — deploy continuo

## Desarrollo local

```bash
cd web
npm install
npm run dev
```

Sin configurar Firebase, la app arranca en **modo local**: el botón "Entrar (modo local)"
guarda tu progreso en `localStorage` de ese dispositivo. Útil para probar la UI.

## Configurar Firebase (sync real entre dispositivos)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
2. **Authentication** → Sign-in method → habilita **Google**.
3. **Firestore Database** → crea la base de datos (modo producción).
4. Project settings → *Your apps* → **Web app** → copia la config.
5. Copia `.env.example` a `.env` y rellena los valores `VITE_FIREBASE_*`.
6. Reglas de seguridad sugeridas (cada usuario solo accede a su documento):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

7. `npm run dev` y entra con Google.

## Deploy en Vercel

1. Importa el repo en [Vercel](https://vercel.com/).
2. **Root Directory:** `web`.
3. Framework: Vite (build `npm run build`, output `dist`). Ya incluido en `vercel.json`.
4. Añade las variables `VITE_FIREBASE_*` en *Settings → Environment Variables*.
5. En Firebase → Authentication → Settings → **Authorized domains**, agrega el dominio
   de Vercel (p. ej. `tu-proyecto.vercel.app`).

## Editar el temario

El contenido (dominios, temas y quizzes) vive en `src/data/syllabus.ts`. Edítalo a tu
gusto; Firestore solo guarda tu **progreso**, no el contenido del temario.

## Modelo de datos (Firestore `users/{uid}`)

| Campo      | Forma                                                        |
| ---------- | ------------------------------------------------------------ |
| `topics`   | `{ [topicId]: { done, courseLinks: [{title,url}] } }`        |
| `domains`  | `{ [domainId]: { deadline: "yyyy-mm-dd" \| null } }`         |
| `studyLog` | `{ [yyyy-mm-dd]: number }` (alimenta racha y heatmap)        |
| `quizzes`  | `{ [domainId]: { bestScore, total, lastAttempt } }`          |
