# Team portraits — DROP-IN CHECKLIST

Replace the placeholder files in this folder with real photographs.

**File names must not change** — they are referenced from `src/data/team.ts`.

| File | Person | Status |
| --- | --- | --- |
| `matvei-michkov.jpg` | Matvei Michkov — Skydiving Instructor | ✅ Name confirmed |
| `havishadwaz.jpg` | Havishadwaz — Experience Curator | ✅ Name confirmed |
| `wind-tunnel-instructor.jpg` | **⚠️ Name not supplied yet** | ❌ Needs photo + name |
| `wind-expert.jpg` | **⚠️ Name not supplied yet** | ❌ Needs photo + name |
| `skydiving-instructor.jpg` | **⚠️ Name not supplied yet** | ❌ Needs photo + name |
| `skydiving-coach.jpg` | **⚠️ Name not supplied yet** | ❌ Needs photo + name |

## 🔴 Also needed: the four real names

Four team entries currently carry a **job title in the name field** because the real
person's name has not been supplied. They are flagged `needsName: true` in
`src/data/team.ts` and display `TODO — name needed` on the site, with a visible
"Name placeholder" note.

| `id` | Current role (correct) | Real name needed |
| --- | --- | --- |
| `tunnel-instructor` | Wind Tunnel Instructor | **?** |
| `wind-expert` | Wind Tunnel Expert | **?** |
| `jump-coach` | Skydiving Instructor | **?** |
| `safety-coach` | Skydiving Coach | **?** |

**To update each one:** replace `name: "TODO — name needed"` with the real name and
delete the `needsName: true` line. The placeholder note disappears automatically.

## Specs

- **Format:** JPEG (`.jpg`) — keep the same filename and extension
- **Orientation:** Portrait, **3:4 ratio** (900 × 1200 px is ideal)
- **Size:** Under 150 KB each (compress before committing)
- **Crop:** Head and shoulders, eyes in the upper third

## After replacing

Nothing else to do. `Portrait` (`src/components/ui/Portrait.tsx`) picks up the new
files automatically, and falls back to an initials avatar if one fails to load.
