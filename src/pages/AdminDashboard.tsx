import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  // --- STATE ---
  const [view, setView] = useState<"menu" | "website" | "menu-page">("menu");
  const [activeCategory, setActiveCategory] = useState("signature_pizzas");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Home Landing Page State
  const [siteContent, setSiteContent] = useState<any>({
    heroTitle: "",
    heroSubtitle: "",
    heroImageURL: "",
    LaunchModal: "",
    showModal: false
  });

  // Menu Layout Page State
  const [menuPageContent, setMenuPageContent] = useState<any>({
    menuTitle: "",
    menuSubtitle: "",
    menuImageURL: "",
    buildTitle: "",
    buildSubtitle: "",
    buildPricing: "",
    buildPricingSubtext: "",
    BuildPricingRedText: ""
  });

  const categories = ["signature_pizzas", "appetizers", "hoagies", "burgers_chicken", "salads", "desserts_drinks"];

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (view === "menu") {
        const q = query(collection(db, "menu", activeCategory, "items"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (view === "website") {
        const docSnap = await getDoc(doc(db, "site_content", "homepage"));
        if (docSnap.exists()) setSiteContent(docSnap.data());
      } else if (view === "menu-page") {
        const docSnap = await getDoc(doc(db, "site_content", "menu-page"));
        if (docSnap.exists()) setMenuPageContent(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeCategory, view]);

  // --- LOGIC: GROUPING (RESTORES HOAGIES vs PASTA) ---
  const getGroupedItems = () => {
    if (!["hoagies", "burgers_chicken", "desserts_drinks"].includes(activeCategory)) {
      return { "All Items": items };
    }
    return items.reduce((acc: any, item: any) => {
      const sub = item.subcategory || "Other";
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(item);
      return acc;
    }, {});
  };

  // --- IMAGE UPLOADER ---
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, target: "menu-item" | "hero" | "menu-page") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const folder = target === "menu-item" ? activeCategory : "site_assets";
      const path = `images/${folder}/${Date.now()}_${file.name}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      if (target === "menu-item") setEditingItem({ ...editingItem, imageURL: url });
      if (target === "hero") setSiteContent({ ...siteContent, heroImageURL: url });
      if (target === "menu-page") setMenuPageContent({ ...menuPageContent, menuImageURL: url });
      
      triggerNotify();
    } catch (error) {
      alert("Upload failed. Please check your storage permissions.");
    } finally {
      setUploading(false);
    }
  };

  // --- SAVE HANDLERS ---
  const handleSaveMenu = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isAddingNew) {
        await addDoc(collection(db, "menu", activeCategory, "items"), { 
          ...editingItem, 
          order: items.length + 1,
          available: editingItem.available ?? true 
        });
      } else {
        await updateDoc(doc(db, "menu", activeCategory, "items", editingItem.id), editingItem);
      }
      setIsModalOpen(false);
      triggerNotify();
      fetchData();
    } catch (error) { alert("Save failed."); }
  };

  const handleUpdateWebsite = async (e: FormEvent) => {
    e.preventDefault();
    const docName = view === "website" ? "homepage" : "menu-page";
    const data = view === "website" ? siteContent : menuPageContent;
    try {
      await updateDoc(doc(db, "site_content", docName), data);
      triggerNotify();
    } catch (error) { alert("Failed to update content."); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      await deleteDoc(doc(db, "menu", activeCategory, "items", id));
      fetchData();
      triggerNotify();
    }
  };

  const triggerNotify = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const groupedItems = getGroupedItems();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col shrink-0">
        <h2 className="text-xl font-black text-red-600 uppercase italic mb-10 tracking-tighter">Upper Crust Admin</h2>
        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Live Menu Items</p>
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setView("menu"); setActiveCategory(cat); }} 
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase mb-1 transition-all ${view === "menu" && activeCategory === cat ? "bg-red-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}>
                {cat === "hoagies" ? "Hoagies & Pasta" : cat.replace("_", " & ")}
              </button>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-4">Global Content</p>
            <button onClick={() => setView("menu-page")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase mb-2 ${view === "menu-page" ? "bg-yellow-600 text-white" : "text-zinc-500 hover:text-white"}`}>Menu Layout & BYO</button>
            <button onClick={() => setView("website")} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase ${view === "website" ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white"}`}>Home Landing Page</button>
          </div>
        </nav>
        <button onClick={() => signOut(auth)} className="mt-6 p-4 text-[10px] text-zinc-600 border border-zinc-800 rounded-2xl font-black uppercase hover:bg-zinc-800 transition-colors">LOGOUT</button>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto bg-black scroll-smooth">
        {loading ? (
           <div className="h-full flex items-center justify-center font-black text-zinc-800 uppercase tracking-widest animate-pulse">Gathering Data...</div>
        ) : (
          <>
            {/* VIEW: MENU ITEMS */}
            {view === "menu" && (
              <section>
                <div className="flex justify-between items-end mb-12">
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter">
                    {activeCategory === "hoagies" ? "Hoagies & Pasta" : activeCategory.replace("_", " & ")}
                  </h1>
                  <button onClick={() => { setIsAddingNew(true); setEditingItem({ name: "", price: "", desc: "", subcategory: "Hoagies", available: true }); setIsModalOpen(true); }} className="bg-white text-black px-8 py-3.5 rounded-2xl font-black uppercase text-xs hover:scale-105 transition-transform">
                    + Add Item
                  </button>
                </div>

                {Object.keys(groupedItems).map((subcat) => (
                  <div key={subcat} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">{subcat}</h2>
                      <div className="h-px bg-zinc-800 flex-1" />
                    </div>
                    <div className="grid gap-3">
                      {groupedItems[subcat].map((item: any) => (
                        <div key={item.id} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-[28px] flex justify-between items-center hover:border-zinc-700 transition-all">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700">
                               <img src={item.imageURL || ""} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h3 className="font-bold text-zinc-100">{item.name}</h3>
                              <span className="text-red-500 font-black text-sm">{item.price}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setIsAddingNew(false); setEditingItem(item); setIsModalOpen(true); }} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase">EDIT</button>
                             <button onClick={() => handleDelete(item.id, item.name)} className="px-4 text-zinc-600 hover:text-red-600 transition-colors"><svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* VIEW: HOME LANDING PAGE (RESTORED) */}
            {view === "website" && (
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">Home Landing Page</h1>
                <form onSubmit={handleUpdateWebsite} className="space-y-8 bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-800">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Hero Main Title</label>
                    <input className="w-full bg-zinc-800 p-4 rounded-2xl font-bold" value={siteContent.heroTitle} onChange={(e) => setSiteContent({...siteContent, heroTitle: e.target.value})} />
                    
                    <label className="text-[10px] font-black uppercase text-zinc-500">Hero Subtitle</label>
                    <textarea className="w-full bg-zinc-800 p-4 rounded-2xl text-sm h-32 leading-relaxed" value={siteContent.heroSubtitle} onChange={(e) => setSiteContent({...siteContent, heroSubtitle: e.target.value})} />
                  </div>

                  <div className="p-6 bg-zinc-800/80 rounded-3xl border border-zinc-700 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Announcement Pop-Up</p>
                      <button type="button" onClick={() => setSiteContent({...siteContent, showModal: !siteContent.showModal})} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-colors ${siteContent.showModal ? "bg-green-600 text-white" : "bg-zinc-600 text-zinc-300"}`}>
                        {siteContent.showModal ? "Modal Active" : "Modal Hidden"}
                      </button>
                    </div>
                    <input className="w-full bg-zinc-900 p-4 rounded-xl text-sm italic" value={siteContent.LaunchModal} onChange={(e) => setSiteContent({...siteContent, LaunchModal: e.target.value})} placeholder="Message in the pop-up..." />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Hero Backdrop Image</label>
                    <div className="flex items-center gap-6 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <img src={siteContent.heroImageURL} className="w-24 h-24 rounded-xl object-cover" />
                        <input type="file" onChange={(e) => handleImageUpload(e, "hero")} className="text-[10px]" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Update Landing Page</button>
                </form>
              </div>
            )}

            {/* VIEW: MENU LAYOUT PAGE */}
            {view === "menu-page" && (
              <div className="max-w-2xl">
                <h1 className="text-4xl font-black mb-10 italic uppercase tracking-tighter">Menu Header & BYO</h1>
                <form onSubmit={handleUpdateWebsite} className="space-y-8 bg-zinc-900/50 p-8 rounded-[40px] border border-zinc-800">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Menu Headline</label>
                    <input className="w-full bg-zinc-800 p-4 rounded-2xl font-bold text-yellow-500" value={menuPageContent.menuTitle} onChange={(e) => setMenuPageContent({...menuPageContent, menuTitle: e.target.value})} />
                    <textarea className="w-full bg-zinc-800 p-4 rounded-2xl text-sm h-20" value={menuPageContent.menuSubtitle} onChange={(e) => setMenuPageContent({...menuPageContent, menuSubtitle: e.target.value})} placeholder="Intro text..." />
                  </div>

                  <div className="p-8 bg-zinc-800 rounded-[32px] border border-zinc-700 space-y-5">
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Build Your Own Section</p>
                    <input className="w-full bg-zinc-900 p-4 rounded-xl font-bold" value={menuPageContent.buildTitle} onChange={(e) => setMenuPageContent({...menuPageContent, buildTitle: e.target.value})} placeholder="BYO Section Title" />
                    <input className="w-full bg-zinc-900 p-4 rounded-xl text-xs" value={menuPageContent.buildPricing} onChange={(e) => setMenuPageContent({...menuPageContent, buildPricing: e.target.value})} placeholder="Pricing list..." />
                    <input className="w-full bg-zinc-900 p-4 rounded-xl text-xs" value={menuPageContent.buildPricingSubtext} onChange={(e) => setMenuPageContent({...menuPageContent, buildPricingSubtext: e.target.value})} placeholder="Topping pricing subtext..." />
                    <input className="w-full bg-zinc-900 p-4 rounded-xl text-xs text-red-500 italic font-bold" value={menuPageContent.BuildPricingRedText} onChange={(e) => setMenuPageContent({...menuPageContent, BuildPricingRedText: e.target.value})} placeholder="Red warning text (GF)..." />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Menu Prep Photo</label>
                    <div className="flex items-center gap-6 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                        <img src={menuPageContent.menuImageURL} className="w-32 h-20 rounded-xl object-cover" />
                        <input type="file" onChange={(e) => handleImageUpload(e, "menu-page")} className="text-[10px]" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Save Menu Layout</button>
                </form>
              </div>
            )}
          </>
        )}

        {showSavedMessage && <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs shadow-2xl animate-bounce">✅ Changes Published</div>}

        {/* MODAL: ADD/EDIT MENU ITEM */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <form onSubmit={handleSaveMenu} className="bg-zinc-900 border border-zinc-800 p-10 rounded-[40px] w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">{isAddingNew ? "New Menu Item" : "Update Item"}</h2>
              <div className="space-y-4">
                <input required className="w-full bg-zinc-800 p-4 rounded-2xl font-bold outline-none" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} placeholder="Item Name" />
                <input required className="w-full bg-zinc-800 p-4 rounded-2xl font-bold text-red-500 outline-none" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} placeholder="Price (e.g. $14.99)" />
                
                {activeCategory === "hoagies" && (
                  <select required className="w-full bg-zinc-800 p-4 rounded-2xl font-bold text-sm outline-none" value={editingItem?.subcategory || ""} onChange={(e) => setEditingItem({ ...editingItem, subcategory: e.target.value })}>
                    <option value="Hoagies">Hoagies</option>
                    <option value="Pasta">Pasta</option>
                  </select>
                )}

                <textarea className="w-full bg-zinc-800 p-4 rounded-2xl text-sm h-24 outline-none resize-none" value={editingItem?.desc || ""} onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })} placeholder="Ingredients / Description..." />
                
                <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                    <img src={editingItem?.imageURL || ""} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Upload Photo</p>
                        <input type="file" onChange={(e) => handleImageUpload(e, "menu-item")} className="text-[10px] file:bg-zinc-800 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1" />
                    </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={uploading} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 p-4 rounded-2xl font-black uppercase text-xs transition-all">Confirm</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 p-4 rounded-2xl font-black uppercase text-xs transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}