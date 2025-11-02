import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/*
  Contacts App
  - Soft delete -> Recycle Bin
  - Photo upload (base64)
  - localStorage persistence
  - Sample contacts provided if none saved
*/

/* ---- storage keys and settings ---- */
const STORAGE_KEY_CONTACTS = "contacts_app_contacts_v1";
const STORAGE_KEY_TRASH = "contacts_app_trash_v1";
const TRASH_EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/* ---- utilities ---- */
function getSampleContacts() {
  const seed = [
    { id: 1, name: "Aisha Khan", email: "aisha.khan@example.com", country: "+91", phone: "9876543210", role: "Product", photo: "" },
    { id: 2, name: "Ravi Patel", email: "ravi.patel@example.com", country: "+91", phone: "9123456789", role: "Engineering", photo: "" },
    { id: 3, name: "Emily Johnson", email: "emily.johnson@example.com", country: "+1", phone: "5551234567", role: "Design", photo: "" },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(seed), 300));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhoneDigits(digits) {
  return /^[0-9]{6,15}$/.test(digits);
}

/* debounce hook (human-style name) */
function useDebounce(value, delay = 250) {
  const [stable, setStable] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setStable(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return stable;
}

/* ---- small SVG icon components ---- */
const IconAdd = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconBin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" />
    <path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.6" /></svg>
);
const IconPencil = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 21v-3.75L14.06 6.19l3.75 3.75L6.75 21H3z" fill="currentColor" /><path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" /></svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.4" /><path d="M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" stroke="currentColor" strokeWidth="1.4" /></svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" /></svg>
);

/* ---- presentational components ---- */

function TopBar({ onCreate, trashCount, onOpenTrash }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <div className="nav__logo">
            {/* swap image path as desired; kept small and simple */}
            <img src="/logo.jpg" alt="Tria logo" style={{ width: 44, height: 44, display: "block" }} />
          </div>
          <div>
            <div className="nav__title">Tria Contacts</div>
            <div className="nav__tag">Organize your people</div>
          </div>
        </div>

        <div className="nav__actions">
          <button className="btn btn--ghost" onClick={onOpenTrash} title="Open Recycle Bin">
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <IconBin />
              <span>Bin</span>
              {trashCount > 0 && <span className="trash-pill">{trashCount}</span>}
            </div>
          </button>

          <button className="btn btn--primary" onClick={onCreate}><IconAdd /> Add</button>
          <button className="btn btn--ghost">Account</button>
        </div>
      </div>
    </header>
  );
}

function SideNav({ activeTeam, setActiveTeam }) {
  const teams = ["All", "Product", "Engineering", "Design", "Marketing"];
  return (
    <aside className="sidebar">
      <div className="sidebar__card">
        <div className="sidebar__title">Quick Links</div>
        <ul className="sidebar__list">
          {teams.map((t) => (
            <li key={t}>
              <button className={`chip ${activeTeam === t ? "chip--active" : ""}`} onClick={() => setActiveTeam(t)}>{t}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar__card">
        <div className="sidebar__title">Tips</div>
        <p className="muted">Hover a contact to reveal actions. Use the search field to find people quickly.</p>
      </div>
    </aside>
  );
}

function ContactRow({ person, onEdit, onDelete }) {
  const initials = (person.name || "").split(" ").map(s => s[0]).slice(0, 2).join("");
  return (
    <div className="card">
      <div className="card__left">
        <div className="avatar">
          {person.photo ? <img src={person.photo} alt={person.name} className="avatar-img" /> : initials}
        </div>

        <div className="card__meta">
          <div className="card__name">{person.name}</div>
          <div className="card__email">{person.email}</div>
          <div className="card__role">{person.role || "—"}</div>
        </div>
      </div>

      <div className="card__middle">
        <div className="card__phone">{person.country} {person.phone}</div>
      </div>

      <div className="card__actions">
        <div className="card__float">
          <button className="icon" title="Edit" onClick={() => onEdit(person)}><IconPencil /></button>
          <button className="icon icon--danger" title="Delete" onClick={() => onDelete(person)}><IconTrash /></button>
        </div>
        <button className="btn btn--small">Message</button>
      </div>
    </div>
  );
}

/* modal wrapper that locks scrolling while open */
function Overlay({ children, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* add / edit form (supports photo upload -> base64) */
function ContactEditor({ initial = null, onCancel, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [country, setCountry] = useState(initial?.country || "+91");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [role, setRole] = useState(initial?.role || "");
  const [photo, setPhoto] = useState(initial?.photo || "");
  const ref = useRef(null);

  useEffect(() => { setTimeout(() => ref.current?.focus(), 60); }, [initial]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { alert("Name required"); return; }
    if (email && !validateEmail(email)) { alert("Invalid email"); return; }
    if (!validatePhoneDigits(phone)) { alert("Phone should be 6–15 digits"); return; }

    const payload = {
      ...initial,
      name: name.trim(),
      email: email.trim(),
      country,
      phone: phone.trim(),
      role,
      photo,
    };
    onSave(payload);
  }

  return (
    <form onSubmit={submit} className="form">
      <div className="form__head">
        <h3>{initial ? "Edit contact" : "Add contact"}</h3>
        <button type="button" className="btn--icon" onClick={onCancel} aria-label="Close"><IconX /></button>
      </div>

      <div className="form__body">
        <div className="photo-upload">
          {photo ? (
            <img src={photo} alt="Preview" className="photo-preview" onClick={() => setPhoto("")} title="Click to remove" />
          ) : (
            <label className="photo-label">
              <input type="file" accept="image/*" className="photo-input" onChange={handleFile} />
              <span>📷 Upload Profile Photo</span>
            </label>
          )}
        </div>

        <input className="input" ref={ref} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="form__row">
          <select className="input input--small" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="+91">+91 India</option>
            <option value="+1">+1 USA</option>
            <option value="+44">+44 UK</option>
            <option value="+61">+61 AUS</option>
          </select>
          <input className="input" placeholder="Phone digits only" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
        </div>
        <input className="input" placeholder="Role (Product / Eng / Design)" value={role} onChange={(e) => setRole(e.target.value)} />
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary">Save</button>
      </div>
    </form>
  );
}

/* delete confirmation dialog (soft delete) */
function ConfirmDelete({ person, onCancel, onConfirm }) {
  return (
    <div className="confirm">
      <h3>Delete contact?</h3>
      <p className="muted">Delete <strong>{person.name}</strong>? It will move to the Recycle Bin.</p>
      <div className="form__actions">
        <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn--danger" onClick={() => onConfirm(person)}>Delete</button>
      </div>
    </div>
  );
}

/* Recycle bin modal */
function RecycleBin({ items, onClose, onRestore, onPermanentDelete, onEmpty }) {
  return (
    <Overlay onClose={onClose}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Recycle Bin</h3>
          <button onClick={onClose} className="btn--icon" aria-label="Close"><IconX /></button>
        </div>

        <div style={{ marginTop: 12 }}>
          {items.length === 0 ? (
            <div className="muted">Bin is empty.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((t) => (
                <div key={t.id} className="card" style={{ alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                    <div className="avatar" style={{ opacity: 0.85 }}>{(t.name || "")[0]}</div>
                    <div>
                      <div className="card__name">{t.name}</div>
                      <div className="card__email">{t.email}</div>
                      <div className="muted" style={{ fontSize: 12 }}>Deleted {new Date(t.deletedAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    <button className="btn btn--small" onClick={() => onRestore(t)}>Restore</button>
                    <button className="btn btn--ghost" onClick={() => onPermanentDelete(t)}>Delete permanently</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
            <button className="btn btn--ghost" onClick={onEmpty}>Empty Bin</button>
          </div>
        )}
      </div>
    </Overlay>
  );
}

/* ---- Main application component (logic grouped and named clearly) ---- */
export default function App() {
  const [contacts, setContacts] = useState([]);
  const [trash, setTrash] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 220);
  const [activeTeam, setActiveTeam] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [deletingPerson, setDeletingPerson] = useState(null);
  const [showTrashModal, setShowTrashModal] = useState(false);

  /* load contacts and trash from storage (prune old trash) */
  useEffect(() => {
    try {
      const rawContacts = localStorage.getItem(STORAGE_KEY_CONTACTS);
      if (rawContacts) {
        setContacts(JSON.parse(rawContacts));
        setLoading(false);
      } else {
        getSampleList();
      }
    } catch {
      getSampleList();
    }

    // load trash and remove expired
    try {
      const rawTrash = localStorage.getItem(STORAGE_KEY_TRASH);
      if (rawTrash) {
        const parsed = JSON.parse(rawTrash);
        const now = Date.now();
        const kept = parsed.filter(item => !item.deletedAt || now - item.deletedAt < TRASH_EXPIRE_MS);
        setTrash(kept);
        localStorage.setItem(STORAGE_KEY_TRASH, JSON.stringify(kept));
      }
    } catch (e) {
      console.warn(e);
    }

    function getSampleList() {
      getSampleContacts().then((data) => { setContacts(data); setLoading(false); });
    }
  }, []);

  /* persist contacts / trash */
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(contacts)); } catch {} }, [contacts]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY_TRASH, JSON.stringify(trash)); } catch {} }, [trash]);

  /* filtered view */
  const visibleContacts = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    return contacts.filter(c => {
      const matchesQ = !q || c.name.toLowerCase().includes(q);
      const matchesTeam = activeTeam === "All" || (c.role || "").toLowerCase() === activeTeam.toLowerCase();
      return matchesQ && matchesTeam;
    });
  }, [contacts, debouncedSearch, activeTeam]);

  /* actions (clear names so intent is obvious) */
  function addContact(contact) { setContacts(prev => [{ id: Date.now(), ...contact }, ...prev]); }
  function updateContact(updated) { setContacts(prev => prev.map(c => (c.id === updated.id ? updated : c))); }

  function softDeleteContact(person) {
    const trashItem = { ...person, deletedAt: Date.now() };
    setContacts(prev => prev.filter(c => c.id !== person.id));
    setTrash(prev => [trashItem, ...prev]);
  }

  function restoreFromTrash(item) {
    const restored = { ...item };
    delete restored.deletedAt;
    restored.id = Date.now();
    setContacts(prev => [restored, ...prev]);
    setTrash(prev => prev.filter(t => t !== item));
  }

  function permanentlyDeleteFromTrash(item) {
    setTrash(prev => prev.filter(t => t !== item));
  }

  function emptyTrash() {
    if (!confirm("Empty the Recycle Bin? This permanently deletes all items.")) return;
    setTrash([]);
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEY_CONTACTS);
    localStorage.removeItem(STORAGE_KEY_TRASH);
    window.location.reload();
  }

  return (
    <div className="page">
      <TopBar onCreate={() => setShowAddModal(true)} trashCount={trash.length} onOpenTrash={() => setShowTrashModal(true)} />

      <div className="content">
        <div className="hero">
          <div>
            <h1>
              <img src="/contact.png" alt="contact icon" className="hero-img" />
              <span>Contacts that feel like home</span>
            </h1>
            <p className="muted">Fast search, beautiful cards, and quick actions — now with a Recycle Bin.</p>
          </div>
          <div>
            <button className="btn btn--secondary" onClick={() => setShowAddModal(true)}><IconAdd /> Add contact</button>
          </div>
        </div>

        <div className="layout">
          <SideNav activeTeam={activeTeam} setActiveTeam={setActiveTeam} />

          <main className="main">
            <div className="main__head">
              <div>
                <div className="h1">Your contacts</div>
                <div className="muted">Search, edit, restore — everything on one page.</div>
              </div>

              <div className="controls">
                <div className="searchbar">
                  <span className="search__icon"><IconSearch /></span>
                  <input className="search__input" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="main__meta">
                  <div className="muted">Showing <strong>{visibleContacts.length}</strong> of <strong>{contacts.length}</strong></div>
                  <div className="buttons">
                    <button className="btn btn--ghost" onClick={resetAll}>Reset</button>
                  </div>
                </div>
              </div>
            </div>

            <section className="cards">
              {loading ? <div className="muted">Loading...</div> : (
                visibleContacts.length ? visibleContacts.map(p => (
                  <div key={p.id} className="card__wrap">
                    <ContactRow person={p} onEdit={(x) => setEditingPerson(x)} onDelete={(x) => setDeletingPerson(x)} />
                  </div>
                )) : <div className="muted">No contacts found — add one!</div>
              )}
            </section>
          </main>
        </div>
      </div>

      <footer className="footer">
        <div>Made with ♥ · Tria UI practice · </div>
      </footer>

      {/* modals */}
      {showAddModal && (
        <Overlay onClose={() => setShowAddModal(false)}>
          <ContactEditor onCancel={() => setShowAddModal(false)} onSave={(d) => { addContact(d); setShowAddModal(false); }} />
        </Overlay>
      )}

      {editingPerson && (
        <Overlay onClose={() => setEditingPerson(null)}>
          <ContactEditor initial={editingPerson} onCancel={() => setEditingPerson(null)} onSave={(d) => { updateContact(d); setEditingPerson(null); }} />
        </Overlay>
      )}

      {deletingPerson && (
        <Overlay onClose={() => setDeletingPerson(null)}>
          <ConfirmDelete person={deletingPerson} onCancel={() => setDeletingPerson(null)} onConfirm={(p) => { softDeleteContact(p); setDeletingPerson(null); }} />
        </Overlay>
      )}

      {showTrashModal && (
        <RecycleBin
          items={trash}
          onClose={() => setShowTrashModal(false)}
          onRestore={(t) => restoreFromTrash(t)}
          onPermanentDelete={(t) => { if (confirm("Delete permanently?")) permanentlyDeleteFromTrash(t); }}
          onEmpty={emptyTrash}
        />
      )}
    </div>
  );
}
