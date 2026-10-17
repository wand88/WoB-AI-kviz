# AI u poslovanju · kviz i rezultati uživo

Radionica Women on Boards Montenegro, 20. 10. 2026.

| Fajl | Čemu služi |
|---|---|
| `index.html` | Stranica za polaznice (telefon): anketa, pitanje o alatima, Vježba 1, kviz |
| `rezultati.html` | Ekran za predavača: rezultati uživo, QR kod za svaku sekciju, live tabela, CSV |
| `qr.html` | Sva četiri QR koda na jednoj stranici (za štampu ili prikaz) |
| `config.js` | Jedno podešavanje: URL Google Apps Script-a |
| `apps-script/Code.gs` | Kod za Google Sheet (prima odgovore i vraća ih stranici sa rezultatima) |
| `qr-kodovi/` | QR kodovi kao PNG, za `https://wand88.github.io/WoB-AI-kviz/` |

## 1. GitHub Pages

1. Napravite javni repozitorijum **`WoB-AI-kviz`** (ako izaberete drugo ime, PNG QR kodovi neće važiti; `qr.html` i `rezultati.html` uvijek prave tačne kodove).
2. Postavite sve fajlove u root repozitorijuma.
3. Settings → Pages → Branch `main`, folder `/ (root)` → Save.
4. Adresa: `https://wand88.github.io/WoB-AI-kviz/`

## 2. Google Sheet sa live tabelom

1. Napravite novi Google Sheet, npr. „WoB kviz 20.10.2026“.
2. Extensions → Apps Script → zalijepite sadržaj `apps-script/Code.gs` → Save.
3. Deploy → New deployment → Select type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize access → kopirajte **Web app URL** (završava se sa `/exec`).
5. U `config.js` upišite: `SCRIPT_URL: "https://script.google.com/macros/s/…/exec"` i push-ujte na GitHub.
6. Prvi odgovor automatski pravi list **Odgovori** sa kolonama:
   Vrijeme · Sekcija · Uređaj · Ime · Odgovor 1 · Odgovor 2 · Odgovor 3 · Bodovi

Svaka izmjena u `Code.gs` traži novu verziju: Deploy → Manage deployments → Edit → Version: New version.

## 3. Proba prije treninga

- Dok je `SCRIPT_URL` prazan, stranice rade u **DEMO režimu** (odgovori ostaju samo u vašem pregledaču; na stranici piše DEMO).
- Poslije povezivanja: pošaljite po jedan odgovor u svakoj sekciji sa telefona i provjerite da se pojavljuju u Sheet-u i na `rezultati.html`.
- Prije 20. 10. obrišite probne redove u Sheet-u (ostavite red sa zaglavljem).

## Kako radi

- Svaki QR kod vodi direktno na svoju sekciju: `#anketa`, `#alati`, `#vjezba`, `#kviz`.
- Ako polaznica pošalje ponovo, na ekranu rezultata računa se njen posljednji odgovor (u Sheet-u ostaju svi).
- Kviz: tačan odgovor je B na sva tri pitanja; polaznica odmah vidi bodove i objašnjenja.
- `rezultati.html` se osvježava na 4 sekunde (podešava se u `config.js`).
- Ime je opciono. Tekst koji počinje sa `=`, `+`, `-` ili `@` upisuje se kao običan tekst, ne kao formula.
