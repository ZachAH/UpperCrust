import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  // --- STATE ---
  const [view, setView] = useState<"menu" | "website" | "menu-page" | "hours">("menu");
  const [activeCategory, setActiveCategory] = useState("signature_pizzas");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Home Landing Page State
  const [siteContent, setSiteContent] = useState<any>({
    heroTitle: "",
    heroSubtitle: "",
    heroImageURL: "",
    LaunchModal: "",
    LaunchModalImage: "",
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

  // Hours State
  const [hoursContent, setHoursContent] = useState<any>({
    "Monday::": "",
    "Tuesday::": "",
    "Wednesday::": "",
    "Thursday": "",
    "Friday": "",
    "Saturday": "",
    "Sunday::": "",
    "heading": ""
  });

  const categories = ["signature_pizzas", "appetizers", "hoagies", "burgers_chicken", "salads", "desserts_drinks"];

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
      } else if (view === "hours") {
        const docSnap = await getDoc(doc(db, "site_content", "hours"));
        if (docSnap.exists()) setHoursContent(docSnap.data());
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeCategory, view]);

  const toggleAvailability = async (item: any) => {
    const newStatus = !item.available;
    try {
      await updateDoc(doc(db, "menu", activeCategory, "items", item.id), { available: newStatus });
      setItems(items.map(i => i.id === item.id ? { ...i, available: newStatus } : i));
      triggerNotify();
    } catch (error) { alert("Failed to update availability"); }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, target: "menu-item" | "hero" | "menu-page" | "launch-modal") => {
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
      if (target === "launch-modal") setSiteContent({ ...siteContent, LaunchModalImage: url });
      if (target === "menu-page") setMenuPageContent({ ...menuPageContent, menuImageURL: url });

      triggerNotify();
    } catch (error) { alert("Upload failed."); } finally { setUploading(false); }
  };

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

  const handleUpdateGlobalContent = async (e: FormEvent) => {
    e.preventDefault();
    let docName = view === "website" ? "homepage" : view === "menu-page" ? "menu-page" : "hours";
    let data = view === "website" ? siteContent : view === "menu-page" ? menuPageContent : hoursContent;
    try {
      await updateDoc(doc(db, "site_content", docName), data);
      triggerNotify();
    } catch (error) { alert("Failed to update content."); }
  };

  // Prevent Enter key from submitting form when in textarea
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'TEXTAREA') {
      e.stopPropagation();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      await deleteDoc(doc(db, "menu", activeCategory, "items", id));
      fetchData();
      triggerNotify();
    }
  };

  const triggerNotify = () => { setShowSavedMessage(true); setTimeout(() => setShowSavedMessage(false), 3000); };

  const getGroupedItems = () => {
    if (!["hoagies", "burgers_chicken", "desserts_drinks"].includes(activeCategory)) return { "All Items": items };
    return items.reduce((acc: any, item: any) => {
      const sub = item.subcategory || "Other";
      if (!acc[sub]) acc[sub] = [];
      acc[sub].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans overflow-hidden relative">
      
      {/* MOBILE HEADER - HAMBURGER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 z-50">
        <h2 className="text-sm font-black text-red-600 uppercase italic tracking-tighter">Upper Crust Admin</h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-zinc-800 rounded-lg">
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
        <h2 className="hidden md:block text-xl font-black text-red-600 uppercase italic mb-10 tracking-tighter">Upper Crust Admin</h2>

        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar pt-16 md:pt-0">
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase mb-4">Menu Categories</p>
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setView("menu"); setActiveCategory(cat); setIsSidebarOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase mb-1 transition-all ${view === "menu" && activeCategory === cat ? "bg-red-600 text-white" : "text-zinc-500 hover:bg-zinc-800"}`}>
                {cat.replace("_", " & ")}
              </button>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-zinc-600 font-black uppercase mb-4">Site & Hours</p>
            <button onClick={() => { setView("website"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase mb-1 ${view === "website" ? "bg-blue-600" : "text-zinc-500 hover:bg-zinc-800"}`}>Home Page</button>
            <button onClick={() => { setView("menu-page"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase mb-1 ${view === "menu-page" ? "bg-yellow-600" : "text-zinc-500 hover:bg-zinc-800"}`}>Menu Layout & BYO</button>
            <button onClick={() => { setView("hours"); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase ${view === "hours" ? "bg-orange-600" : "text-zinc-500 hover:bg-zinc-800"}`}>Store Hours</button>
          </div>
        </nav>
        
        {/* LOGOUT BUTTON - NOW INSIDE SIDEBAR FLEXBOX */}
        <div className="mt-auto pt-6 border-t border-zinc-800">
          <button onClick={() => signOut(auth)} className="w-full p-4 text-[10px] text-red-500 bg-zinc-950 border border-zinc-800 rounded-2xl font-black uppercase hover:bg-red-600 hover:text-white transition-all">
            LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto bg-black pt-28 md:pt-16">
        {loading ? (
          <div className="h-full flex items-center justify-center font-black text-zinc-800 uppercase animate-pulse">Gathering Data...</div>
        ) : (
          <div className="max-w-4xl mx-auto">

            {/* VIEW: MENU ITEMS */}
            {view === "menu" && (
              <section>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter">{activeCategory.replace("_", " ")}</h1>
                  <button onClick={() => { setIsAddingNew(true); setEditingItem({ name: "", price: "", desc: "", subcategory: "Hoagies", available: true }); setIsModalOpen(true); }} className="bg-white text-black px-8 py-3.5 rounded-2xl font-black uppercase text-xs w-full md:w-auto">+ Add Item</button>
                </div>
                {Object.keys(getGroupedItems()).map((subcat) => (
                  <div key={subcat} className="mb-12">
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">{subcat}</h2>
                    <div className="grid gap-3">
                      {getGroupedItems()[subcat].map((item: any) => (
                        <div key={item.id} className={`bg-zinc-900/40 border p-5 rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${item.available ? "border-zinc-800" : "border-red-900/50 opacity-60"}`}>
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 shrink-0">
                              <img src={item.imageURL || ""} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h3 className="font-bold text-zinc-100 text-sm">{item.name}</h3>
                              <span className="text-red-500 font-black text-xs">{item.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button onClick={() => toggleAvailability(item)} className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${item.available ? "border-green-500/50 text-green-500 hover:bg-green-500/10" : "border-red-500 text-red-500 bg-red-500/10"}`}>
                              {item.available ? "In Stock" : "Sold Out"}
                            </button>
                            <button onClick={() => { setIsAddingNew(false); setEditingItem(item); setIsModalOpen(true); }} className="bg-zinc-800 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-700">EDIT</button>
                            <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-zinc-600 hover:text-red-600">🗑️</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* VIEW: MENU LAYOUT PAGE */}
            {view === "menu-page" && (
              <div className="max-w-2xl text-left">
                <h1 className="text-4xl font-black mb-10 italic uppercase text-yellow-500">Menu Header & BYO</h1>
                <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/50 p-6 md:p-10 rounded-[40px] border border-zinc-800">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Menu Header Image</label>
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                      <img src={menuPageContent.menuImageURL || ""} className="w-full md:w-24 h-32 md:h-16 rounded-lg object-cover bg-zinc-950" />
                      <div className="space-y-1 w-full">
                         <input type="file" onChange={(e) => handleImageUpload(e, "menu-page")} className="text-[10px] block w-full" />
                         <p className="text-[9px] text-zinc-600 italic">Recommended: Wide landscape photo</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Menu Headline</label>
                    <textarea 
                      className="w-full bg-zinc-800 p-4 rounded-xl font-bold text-yellow-500 outline-none h-16" 
                      value={menuPageContent.menuTitle} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, menuTitle: e.target.value })} 
                    />
                    <textarea 
                      className="w-full bg-zinc-800 p-4 rounded-xl text-xs h-20 outline-none" 
                      value={menuPageContent.menuSubtitle} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, menuSubtitle: e.target.value })} 
                    />
                  </div>

                  <div className="p-6 bg-zinc-800 rounded-3xl border border-zinc-700 space-y-4">
                    <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest italic">Build Your Own Section</p>
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl font-bold text-sm h-16 outline-none" 
                      value={menuPageContent.buildTitle} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, buildTitle: e.target.value })} 
                      placeholder="BYO Title" 
                    />
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl text-xs h-20 outline-none" 
                      value={menuPageContent.buildSubtitle} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, buildSubtitle: e.target.value })} 
                      placeholder="BYO Subtitle"
                    />
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl text-xs h-16 outline-none" 
                      value={menuPageContent.buildPricing} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricing: e.target.value })} 
                      placeholder="Pricing (Black)" 
                    />
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl text-xs h-16 outline-none" 
                      value={menuPageContent.buildPricingSubtext} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricingSubtext: e.target.value })} 
                      placeholder="Pricing Subtext (Gray)" 
                    />
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl text-xs text-red-500 font-bold h-16 outline-none" 
                      value={menuPageContent.BuildPricingRedText} 
                      onChange={(e) => setMenuPageContent({ ...menuPageContent, BuildPricingRedText: e.target.value })} 
                      placeholder="Subtext (Red)" 
                    />
                  </div>

                  <button type="submit" className="w-full bg-yellow-600 p-5 rounded-2xl font-black uppercase text-xs tracking-widest">Save Menu Layout</button>
                </form>
              </div>
            )}

            {/* VIEW: WEBSITE */}
            {view === "website" && (
              <div className="max-w-2xl text-left">
                <h1 className="text-4xl font-black mb-10 italic uppercase text-blue-500">Home Landing Page</h1>
                <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/50 p-6 md:p-10 rounded-[40px] border border-zinc-800">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-500">Hero Main Title</label>
                    <textarea 
                      className="w-full bg-zinc-800 p-4 rounded-xl font-bold text-sm h-16 outline-none" 
                      value={siteContent.heroTitle} 
                      onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })} 
                    />
                    <label className="text-[10px] font-black uppercase text-zinc-500">Hero Subtitle</label>
                    <textarea 
                      className="w-full bg-zinc-800 p-4 rounded-xl text-sm h-28" 
                      value={siteContent.heroSubtitle} 
                      onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })} 
                    />
                  </div>
                  <div className="p-6 bg-zinc-800 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-left">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Popup Modal</p>
                      <button type="button" onClick={() => setSiteContent({ ...siteContent, showModal: !siteContent.showModal })} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase transition-all ${siteContent.showModal ? "bg-green-600" : "bg-zinc-600"}`}>
                        {siteContent.showModal ? "Active" : "Hidden"}
                      </button>
                    </div>
                    <textarea 
                      className="w-full bg-zinc-900 p-4 rounded-xl text-xs italic h-20" 
                      value={siteContent.LaunchModal} 
                      onChange={(e) => setSiteContent({ ...siteContent, LaunchModal: e.target.value })} 
                    />
                    <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl">
                      <img src={siteContent.LaunchModalImage || ""} className="w-12 h-12 rounded object-cover" />
                      <input type="file" onChange={(e) => handleImageUpload(e, "launch-modal")} className="text-[10px]" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 p-5 rounded-2xl font-black uppercase text-xs tracking-widest">Publish Changes</button>
                </form>
              </div>
            )}

            {/* VIEW: HOURS */}
            {view === "hours" && (
              <div className="max-w-2xl text-left">
                <h1 className="text-4xl font-black mb-10 italic uppercase text-orange-500">Store Hours</h1>
                <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/50 p-6 md:p-10 rounded-[40px] border border-zinc-800">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-500">Heading Text</label>
                    <textarea 
                      className="w-full bg-zinc-800 p-4 rounded-xl text-sm h-20 mt-2" 
                      value={hoursContent.heading} 
                      onChange={(e) => setHoursContent({ ...hoursContent, heading: e.target.value })} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(hoursContent).filter(k => k !== 'heading').map((day) => (
                      <div key={day}>
                        <label className="text-[10px] font-black uppercase text-zinc-500">{day.replace("::", "")}</label>
                        <input className="w-full bg-zinc-800 p-4 rounded-xl font-bold text-sm mt-2" value={hoursContent[day]} onChange={(e) => setHoursContent({ ...hoursContent, [day]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="w-full bg-orange-600 p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Update Hours</button>
                </form>
              </div>
            )}
          </div>
        )}

        {showSavedMessage && <div className="fixed bottom-12 right-12 bg-green-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] shadow-2xl animate-bounce z-50">✅ Published to Live Site</div>}

        {/* MODAL: ADD/EDIT MENU ITEM */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
            <form onSubmit={handleSaveMenu} className="bg-zinc-900 border border-zinc-800 p-6 md:p-10 rounded-[40px] w-full max-w-lg space-y-5 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">{isAddingNew ? "New Item" : "Edit Item"}</h2>
              <div className="space-y-4">
                <input required className="w-full bg-zinc-800 p-4 rounded-xl font-bold outline-none" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} placeholder="Item Name" />
                <input required className="w-full bg-zinc-800 p-4 rounded-xl font-bold text-red-500 outline-none" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} placeholder="Price" />
                <textarea 
                  className="w-full bg-zinc-800 p-4 rounded-xl text-sm h-24 outline-none resize-none" 
                  value={editingItem?.desc || ""} 
                  onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })} 
                  placeholder="Description..." 
                />
                <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <img src={editingItem?.imageURL || ""} className="w-12 h-12 rounded-lg object-cover" />
                  <input type="file" onChange={(e) => handleImageUpload(e, "menu-item")} className="text-[10px] w-full" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" disabled={uploading} className="flex-1 bg-red-600 p-4 rounded-xl font-black uppercase text-xs">Confirm</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 p-4 rounded-xl font-black uppercase text-xs">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}