// Module handling Add Station modal logic and integration with Radio Garden API
// Provides function initAddStationModal(onAdded) returning openAddStationModal()

interface StoredUserStation {
  displayName: string;
  link: string;
  imageData?: string;
}

const USER_STATIONS_KEY = 'sr_userStations_v1';

function loadUserStations(): Record<string, StoredUserStation> {
  try {
    const raw = localStorage.getItem(USER_STATIONS_KEY);
    return raw ? JSON.parse(raw) as Record<string, StoredUserStation> : {};
  } catch { return {}; }
}
function saveUserStations(map: Record<string, StoredUserStation>) {
  localStorage.setItem(USER_STATIONS_KEY, JSON.stringify(map));
}
function slugifyId(s: string): string {
  return (s || 'user-station')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-');
}
function ensureUniqueId(baseIds: Set<string>, userMap: Record<string, StoredUserStation>, id: string): string {
  if (!baseIds.has(id) && !(id in userMap)) return id;
  let i = 2;
  while (baseIds.has(`${id}-${i}`) || `${id}-${i}` in userMap) i++;
  return `${id}-${i}`;
}

async function fetchRadioGardenId(identifier: string): Promise<string | null> {
  try {
    // Hit dedicated backend endpoint that returns just { id }
    const resp = await fetch(`/radio_garden/get_id?q=${encodeURIComponent(identifier)}`);
    if (!resp.ok) return null;
    const data = await resp.json();
    return typeof data?.id === 'string' ? data.id : null;
  } catch { /* ignore network / parse errors */ }
  return null;
}

export function initAddStationModal(onAdded: () => void, getBaseIds: () => Set<string>) {
  let overlay: HTMLElement | null = null;
  let identifierInput: HTMLInputElement | null = null;
  let displayNameInput: HTMLInputElement | null = null;
  let imageInput: HTMLInputElement | null = null;
  let imagePreview: HTMLElement | null = null;
  let saveBtn: HTMLButtonElement | null = null;
  let cancelBtn: HTMLButtonElement | null = null;
  let msgArea: HTMLElement | null = null;
  let tempImageData: string | null = null;

  function buildModal() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
  <div class="modal-card" role="dialog" aria-modal="true" dir="rtl" lang="he">
        <h3 class="modal-title">הוספת תחנה</h3>
        <div class="modal-field">
          <label class="modal-label" id="station-identifier-label" for="station-identifier">
            מזהה תחנה (לועזית) *
            <button type="button" class="link-btn" id="identifier-help" aria-expanded="false" aria-controls="identifier-help-text" style="margin-inline-start:6px;">מה זה?</button>
          </label>
          <input id="station-identifier" class="modal-input" placeholder="example.fm או example-fm" autocomplete="off" dir="ltr" lang="en" />
          <div id="identifier-help-text" class="modal-help" style="display:none;">
            <span class="modal-help-title">איך משיגים מזהה תחנה?</span>
            <ol class="help-steps" dir="rtl">
              <li>פתחו את האתר <a href="https://radio.garden" target="_blank" rel="noopener" dir="ltr">radio.garden</a>.</li>
              <li>חפשו את שם התחנה באנגלית (לדוגמה: <code dir="ltr">Radio Plus</code>).</li>
              <li>העתיקו את שם התחנה כפי שמופיע – ניתן לכלול רווחים, נקודה (<code dir="ltr">.</code>), מקף (<code dir="ltr">-</code>) וקו תחתון (<code dir="ltr">_</code>).</li>
            </ol>
            דוגמאות תקינות: <code dir="ltr">Radio Plus</code>, <code dir="ltr">example.fm</code>, <code dir="ltr">my_station-1</code>
          </div>
        </div>
        <div class="modal-field">
          <label class="modal-label" for="station-display">שם תצוגה *</label>
          <input id="station-display" class="modal-input" placeholder="שם בעברית" autocomplete="off" />
        </div>
        <div class="modal-field">
          <span class="modal-label">תמונה (אופציונלי)</span>
          <div class="image-picker">
            <div class="image-preview" id="station-image-preview"><span style="font-size:12px;opacity:0.6;">אין</span></div>
            <button type="button" class="link-btn" id="pick-image-btn">בחר תמונה</button>
            <input type="file" accept="image/*" id="station-image-input" style="display:none" />
          </div>
        </div>
        <div class="modal-field" style="margin-top:4px;">
          <small id="add-station-msg" style="display:block;min-height:18px;font-size:13px;color:#666;"></small>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="cancel-add-station">ביטול</button>
          <button type="button" class="btn btn-primary" id="save-add-station">הוספה</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    identifierInput = overlay.querySelector('#station-identifier') as HTMLInputElement;
    displayNameInput = overlay.querySelector('#station-display') as HTMLInputElement;
    imageInput = overlay.querySelector('#station-image-input') as HTMLInputElement;
    imagePreview = overlay.querySelector('#station-image-preview') as HTMLElement;
    saveBtn = overlay.querySelector('#save-add-station') as HTMLButtonElement;
    cancelBtn = overlay.querySelector('#cancel-add-station') as HTMLButtonElement;
    msgArea = overlay.querySelector('#add-station-msg') as HTMLElement;
  const pickBtn = overlay.querySelector('#pick-image-btn') as HTMLButtonElement;
  const idHelpBtn = overlay.querySelector('#identifier-help') as HTMLButtonElement;
  const idHelpBox = overlay.querySelector('#identifier-help-text') as HTMLDivElement;
  const idLabel = overlay.querySelector('#station-identifier-label') as HTMLLabelElement;

    pickBtn.addEventListener('click', () => imageInput?.click());
    imageInput?.addEventListener('change', handleImagePick);
    saveBtn?.addEventListener('click', handleSave);
    cancelBtn?.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    function toggleIdHelp() {
      if (!idHelpBox || !idHelpBtn) return;
      const isOpen = idHelpBox.style.display !== 'none';
      idHelpBox.style.display = isOpen ? 'none' : 'block';
      idHelpBtn.setAttribute('aria-expanded', String(!isOpen));
    }
    idHelpBtn?.addEventListener('click', (e) => { e.preventDefault(); toggleIdHelp(); });
    // Also allow clicking the label text to open help (but keep focusing input default)
    idLabel?.addEventListener('click', (e) => {
      // If the click was on the button itself, it is already handled
      if ((e.target as HTMLElement)?.id === 'identifier-help') return;
      toggleIdHelp();
    });
  }

  function handleImagePick(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      tempImageData = reader.result as string;
      if (imagePreview) {
        imagePreview.innerHTML = '';
        const img = document.createElement('img');
        img.src = tempImageData;
        imagePreview.appendChild(img);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!identifierInput || !displayNameInput || !msgArea) return;
  // Allow spaces; only trim ends and lowercase like Python script
  const identifierRaw = (identifierInput.value || '').trim().toLowerCase();
    const displayName = (displayNameInput.value || '').trim();
    msgArea.style.color = '#666';
    if (!identifierRaw || !displayName) {
      msgArea.textContent = 'יש למלא מזהה ושם תצוגה.';
      return;
    }
    // Permit spaces and dot in identifier for lookup; restrict other chars
    if (!/^[a-z0-9-_. ]+$/.test(identifierRaw)) {
      msgArea.textContent = 'מזהה לא חוקי (אותיות באנגלית, מספרים, מקף, קו תחתון, נקודה, רווח).';
      return;
    }
    msgArea.textContent = 'מחפש תחנה...';

    const radioId = await fetchRadioGardenId(identifierRaw);
    if (!radioId) {
      msgArea.style.color = '#c00';
      msgArea.textContent = 'לא נמצא מזהה מתאים. נסה מזהה אחר.';
      return;
    }
    const streamLink = `https://radio.garden/api/ara/content/listen/${radioId}/channel.mp3`;

    // Save
    const existing = loadUserStations();
    const baseIds = getBaseIds();
    let id = slugifyId(identifierRaw);
    id = ensureUniqueId(baseIds, existing, id);
    existing[id] = { displayName, link: streamLink, imageData: tempImageData || undefined };
    saveUserStations(existing);

    msgArea.style.color = '#0a84ff';
    msgArea.textContent = 'נשמר!';

    onAdded();
    setTimeout(close, 400); // brief success feedback
  }

  function close() { overlay?.classList.remove('show'); }

  function open() {
    buildModal();
    tempImageData = null;
    if (imagePreview) imagePreview.innerHTML = '<span style="font-size:12px;opacity:0.6;">אין</span>';
    if (identifierInput) identifierInput.value = '';
    if (displayNameInput) displayNameInput.value = '';
    if (msgArea) msgArea.textContent = '';
    overlay?.classList.add('show');
    identifierInput?.focus();
  }

  return open;
}
