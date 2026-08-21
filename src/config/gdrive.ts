/**
 * Google Drive integration for documentary videos.
 *
 * The documentary video clips total ~279 MB, which exceeds
 * GitHub's recommended file-size limits. They are hosted on
 * Google Drive and referenced here by file ID.
 *
 * Folder: https://drive.google.com/drive/folders/1xJPv33uQ5P9MCHCra9s-qrQNCNu3KVp4
 */

/** Google Drive folder ID containing all documentary videos. */
export const DOCUMENTARY_FOLDER_ID = "1xJPv33uQ5P9MCHCra9s-qrQNCNu3KVp4";

/**
 * Ordered list of Google Drive file IDs for the documentary reel.
 * Order matches the original local files in `/public/resources/documentry/`.
 *
 * | File name                          | Size     |
 * | ---------------------------------- | -------- |
 * | OUTSKYZ_HQ_Part_1_00.mp4           | 28.9 MB  |
 * | OUTSKYZ_HQ_Part_1_01.mp4           | 29.1 MB  |
 * | OUTSKYZ_HQ_Part_1_02.mp4           | 19.3 MB  |
 * | OUTSKYZ_AdventureCut_HQ_Part_2.mp4 | 59.7 MB  |
 * | OUTSKYZ_AdventureCut_HQ_Part_3.mp4 | 71.7 MB  |
 * | OUTSKYZ_AdventureCut_HQ_Part_4.mp4 | 104.9 MB |
 */
export const DOCUMENTARY_FILE_IDS = [
  "16gNWxruU28h3F-3J_aJ0KDWlbmdv9xfe", // OUTSKYZ_HQ_Part_1_00.mp4
  "1JtVrIjJP62j6TbprQVlnbGRwnUDrkio5", // OUTSKYZ_HQ_Part_1_01.mp4
  "1e4wcJApLpnwBhqiU_z6RGHXtzs2KQkLB", // OUTSKYZ_HQ_Part_1_02.mp4
  "1tkY1E47dJCPbigkRnNGKIL36MY4CAXSf", // OUTSKYZ_AdventureCut_HQ_Part_2.mp4
  "1dp6qbifvEy9w0TRrCW2lwymiAfZz0R7W", // OUTSKYZ_AdventureCut_HQ_Part_3.mp4
  "1pWcwDvtTgiEnBW4DlpWfPnzppYED5td2", // OUTSKYZ_AdventureCut_HQ_Part_4.mp4
] as const;

/**
 * Returns a same-origin proxy URL for a Google Drive file.
 *
 * Every documentary clip is proxied through `/api/drive/:id` rather than
 * linked directly to Google. Google's raw file responses carry a
 * `Cross-Origin-Resource-Policy: same-site` header and `Content-Disposition`
 * handling that browsers refuse to stream inline from another origin, and
 * files over 100 MB return a virus-scan HTML page instead of the file.
 * The proxy strips those concerns and streams bytes to the `<video>` tag
 * on the same origin, with seekable range requests.
 */
export function getDocumentaryUrl(fileId: string): string {
  return `/api/drive/${fileId}`;
}
