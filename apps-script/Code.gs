/**
 * AI u poslovanju · Women on Boards Montenegro
 * Google Apps Script backend za kviz (index.html) i live rezultate (rezultati.html).
 *
 * Postavljanje:
 * 1. Napravite novi Google Sheet (npr. "WoB kviz 20.10.2026").
 * 2. Extensions → Apps Script → obrišite postojeći kod i zalijepite ovaj fajl.
 * 3. Deploy → New deployment → tip "Web app"
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Odobrite pristup, kopirajte Web app URL (završava se sa /exec)
 *    i zalijepite ga u config.js (SCRIPT_URL).
 * 5. Svaka izmjena ovog koda traži novi deployment (Manage deployments → Edit → New version).
 */

const SHEET_NAME = 'Odgovori';
const HEADERS = ['Vrijeme', 'Sekcija', 'Uređaj', 'Ime', 'Odgovor 1', 'Odgovor 2', 'Odgovor 3', 'Bodovi'];
const SEKCIJE = ['anketa', 'alati', 'vjezba', 'kviz'];
const MAX_LEN = 2000;

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

// Tekst koji počinje sa = + - @ Sheets bi tumačio kao formulu; zato ga "neutrališemo".
function clean_(v) {
  let s = String(v == null ? '' : v).slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (SEKCIJE.indexOf(d.sekcija) === -1) return json_({ ok: false, error: 'nepoznata sekcija' });
    const o = Array.isArray(d.odgovori) ? d.odgovori : [];
    getSheet_().appendRow([
      new Date(),
      d.sekcija,
      clean_(d.uredjaj).slice(0, 40),
      clean_(d.ime).slice(0, 60),
      clean_(o[0]), clean_(o[1]), clean_(o[2]),
      typeof d.bodovi === 'number' ? d.bodovi : ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  const sh = getSheet_();
  const last = sh.getLastRow();
  if (last < 2) return json_({ rows: [] });
  const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const rows = values.map(function (r) {
    return {
      t: r[0] instanceof Date ? r[0].toISOString() : String(r[0]),
      s: r[1], d: r[2], i: r[3],
      a: [r[4], r[5], r[6]].map(function (x) { return String(x).replace(/^'/, ''); }),
      b: r[7] === '' ? null : Number(r[7])
    };
  });
  return json_({ rows: rows, updated: new Date().toISOString() });
}
