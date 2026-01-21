import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  // --- STATE ---
  const [view, setView] = useState<"menu" | "website">("menu");
  const [activeCategory, setActiveCategory] = useState("signature_pizzas");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Website Content State - Matches Firestore Screenshot exactly
  const [siteContent, setSiteContent] = useState<any>({
    heroTitle: "",
    heroSubtitle: "",
    LaunchModal: "",
    heroImageURL: "",
    showModal: true,
  });

  const categories = ["signature_pizzas", "pizzas", "appetizers", "hoagies", "burgers_chicken", "salads", "desserts_drinks"];

  // --- DATA FETCHING ---
  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "menu", activeCategory, "items"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchSiteContent = async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, "site_content", "homepage"));
      if (docSnap.exists()) setSiteContent(docSnap.data());
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (view === "menu") fetchItems();
    else fetchSiteContent();
  }, [activeCategory, view]);

  // --- HANDLERS ---
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Categorize storage paths for organization
      const path = view === "menu"
        ? `images/pizzas/${Date.now()}_${file.name}`
        : `images/hero/${Date.now()}_${file.name}`;

      const fileRef = ref(storage, path);
      const uploadResult = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadResult.ref);

      if (view === "menu") {
        setEditingItem({ ...editingItem, imageURL: url });
      } else {
        // Matches field name in Screenshot
        setSiteContent({ ...siteContent, heroImageURL: url });
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveMenu = async (e: FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...editingItem };
    if (activeCategory !== "signature_pizzas") delete dataToSave.imageURL;

    try {
      if (isAddingNew) {
        await addDoc(collection(db, "menu", activeCategory, "items"), {
          ...dataToSave,
          order: items.length + 1,
          available: editingItem.available ?? true
        });
      } else {
        await updateDoc(doc(db, "menu", activeCategory, "items", editingItem.id), dataToSave);
      }
      closeAndNotify();
      fetchItems();
    } catch (error) { alert("Save failed"); }
  };

  const handleSaveWebsite = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Updates document in site_content/homepage
      await updateDoc(doc(db, "site_content", "homepage"), siteContent);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "menu", activeCategory, "items", id));
        fetchItems();
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3000);
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete item.");
      }
    }
  };

  const closeAndNotify = () => {
    setIsModalOpen(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const toggleAvailability = async (item: any) => {
    const newStatus = !item.available;
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, available: newStatus } : i));
    await updateDoc(doc(db, "menu", activeCategory, "items", item.id), { available: newStatus });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 pt-10 flex flex-col shrink-0 overflow-y-auto">
        <h2 className="text-xl font-black text-red-600 uppercase italic mb-10">Upper Crust Admin</h2>

        <nav className="space-y-8">
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Menu Categories</p>
            <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setView("menu"); setActiveCategory(cat); }}
                  className={`text-left px-4 py-2.5 rounded-xl transition-all text-xs font-bold whitespace-nowrap ${view === "menu" && activeCategory === cat ? "bg-red-600 text-white" : "text-zinc-500 hover:text-white"}`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Website Content</p>
            <button
              onClick={() => setView("website")}
              className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-xs font-bold ${view === "website" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"}`}
            >
              Hero & Launch Popup
            </button>
          </div>
        </nav>

        <button onClick={() => signOut(auth)} className="mt-auto p-3 text-xs text-zinc-600 border border-zinc-800 rounded-xl font-bold">LOGOUT</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-16 pb-28 overflow-y-auto">
        {view === "menu" ? (
          /* MENU VIEW */
          <>
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Live Menu</p>
                <h1 className="text-4xl font-black capitalize tracking-tighter">{activeCategory.replace("_", " ")}</h1>
              </div>
              <button onClick={() => { setIsAddingNew(true); setEditingItem({ name: "", price: "", desc: "", available: true }); setIsModalOpen(true); }} className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs">
                + Add Item
              </button>
            </div>

            {loading ? <div className="animate-pulse font-bold italic text-zinc-600">Loading Menu...</div> : (
              <div className="grid gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full">
                      {activeCategory === "signature_pizzas" && <img src={item.imageURL || 'https://via.placeholder.com/150'} className="w-16 h-16 object-cover rounded-xl" alt="" />}
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <div className="flex gap-3 items-center">
                          <span className="text-red-500 font-black">{item.price}</span>
                          <button onClick={() => toggleAvailability(item)} className={`text-[8px] font-black uppercase px-2 py-1 rounded border ${item.available ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                            {item.available ? 'Available' : 'Sold Out'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => { setIsAddingNew(false); setEditingItem(item); setIsModalOpen(true); }} className="flex-1 bg-zinc-800 px-6 py-2 rounded-xl text-xs font-black">EDIT</button>
                      <button onClick={() => handleDelete(item.id, item.name)} className="flex-1 text-red-500 text-xs font-black">DELETE</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* WEBSITE VIEW - Mapping verified against Firestore site_content/homepage screenshot */
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">Site Content</h1>
            <form onSubmit={handleSaveWebsite} className="space-y-6 bg-zinc-900 p-8 rounded-[40px] border border-zinc-800">

              {/* LAUNCH MODAL TOGGLE */}
              <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white">Launch Popup Visibility</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">Status: {siteContent.showModal ? "Shown" : "Hidden"}</p>
                </div>
                <button type="button" onClick={() => setSiteContent({ ...siteContent, showModal: !siteContent.showModal })} className={`w-14 h-8 rounded-full relative transition-colors ${siteContent.showModal ? 'bg-green-600' : 'bg-zinc-700'}`}>
                  <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${siteContent.showModal ? 'left-7' : 'left-2'}`} />
                </button>
              </div>

              <div className="space-y-4">
                {/* HERO IMAGE UPLOADER */}
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] text-zinc-500 font-black uppercase">
                      Hero Background Image
                    </label>
                    {/* Added Recommendation Text */}
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
                      Recommended: 1920x1080px (Under 1MB)
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-4">
                    <img
                      src={siteContent.heroImageURL || '/pizza-hero.webp'}
                      className="w-20 h-20 object-cover rounded-xl border border-zinc-800 bg-zinc-900"
                      alt="Current Hero"
                    />
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-[10px] w-full file:bg-zinc-800 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-2 file:mr-4 file:hover:bg-zinc-700 cursor-pointer"
                      />
                      {uploading && (
                        <p className="text-red-500 text-[9px] animate-pulse mt-1 font-bold italic">
                          Processing Upload...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-black uppercase ml-1">Launch Popup Message</label>
                  <input className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm" value={siteContent.LaunchModal || ""} onChange={(e) => setSiteContent({ ...siteContent, LaunchModal: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-black uppercase ml-1">Hero Headline</label>
                  <input className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm" value={siteContent.heroTitle || ""} onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-black uppercase ml-1">Hero Subtext</label>
                  <textarea className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold text-sm h-32 resize-none" value={siteContent.heroSubtitle || ""} onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-900/20">
                Update Live Website
              </button>
            </form>
          </div>
        )}

        {showSavedMessage && <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-5 rounded-3xl shadow-2xl z-[60] font-black uppercase text-sm animate-bounce-once">✅ Changes Live</div>}

        {/* MENU MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <form onSubmit={handleSaveMenu} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black italic uppercase">{isAddingNew ? "New Menu Item" : "Update Item"}</h2>

              <div className="space-y-4">
                <input required placeholder="Name" className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                <input required placeholder="Price" className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} />

                {["hoagies", "burgers_chicken", "desserts_drinks"].includes(activeCategory) && (
                  <select className="w-full bg-zinc-800 p-4 rounded-2xl font-bold outline-none" value={editingItem?.subcategory || ""} onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}>
                    <option value="">Select Sub-Section</option>
                    {activeCategory === "hoagies" && <><option value="Hoagies">Hoagies</option><option value="Pasta">Pasta</option></>}
                    {activeCategory === "burgers_chicken" && <><option value="Burgers">Burgers</option><option value="Chicken Sandwiches">Chicken Sandwiches</option></>}
                    {activeCategory === "desserts_drinks" && <><option value="Desserts">Desserts</option><option value="Drinks">Drinks</option></>}
                  </select>
                )}

                <textarea placeholder="Description" className="w-full bg-zinc-800 p-4 rounded-2xl outline-none font-bold h-24" value={editingItem?.desc || ""} onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })} />

                {activeCategory === "signature_pizzas" && (
                  <input type="file" onChange={handleImageChange} className="text-xs file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-2" />
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-red-600 p-4 rounded-2xl font-black uppercase">Confirm</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 p-4 rounded-2xl font-black uppercase">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}