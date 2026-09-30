# Leadership portraits — DROP-IN CHECKLIST

Replace the placeholder files in this folder with real photographs.

**File names must not change** — they are referenced from `src/data/founders.ts`.

| File | Person | Replace with |
| --- | --- | --- |
| `prince-k-bhagat.jpg` | Prince K Bhagat — Founder | Real portrait |
| `steve-jogi.jpg` | Steve Jogi — Co-Founder | Real portrait |

## Specs

- **Format:** JPEG (`.jpg`) — keep the same filename and extension
- **Orientation:** Portrait, **3:4 ratio** (900 × 1200 px is ideal)
- **Size:** Under 150 KB each (run through a compressor before committing)
- **Crop:** Head and shoulders, eyes in the upper third
- **Background:** Any — the card applies a dark gradient overlay for text legibility

## Also needed from you

**Steve Jogi's bio** is currently placeholder copy:
> "Bringing precision, passion and a global perspective to every experience we create."

This is flagged with `needsBio: true` in `src/data/founders.ts`. Replace it with a
real, specific write-up and remove the flag — the "Bio placeholder" note under his
card disappears automatically once the flag is gone.

## After replacing

Nothing else to do. `Portrait` (`src/components/ui/Portrait.tsx`) picks up the new
file automatically. If a photo ever fails to load, the component falls back to an
initials avatar, so a missing file degrades gracefully instead of showing a broken
image.
