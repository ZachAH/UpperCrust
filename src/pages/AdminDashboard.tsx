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
    "Sunday:": "",
    "Monday:": "",
    "Tuesday:": "",
    "Wednesday:": "",
    "Thursday:": "",
    "Friday:": "",
    "Saturday:": "",
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

  useEffect(() => { 
    fetchData(); 
    setIsSidebarOpen(false); // Close mobile sidebar when switching views
  }, [activeCategory, view]);

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

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'TEXTAREA') {
      e.stopPropagation();
      return;
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

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      {/* MOBILE HEADER - REMOVED NAVIGATION ITEMS */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black uppercase italic tracking-tighter text-red-600">UC Admin</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="bg-zinc-800 active:scale-95 transition-all px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-zinc-700 shadow-lg"
        >
          {isSidebarOpen ? "Close" : "Menu"}
        </button>
      </header>

      <div className="flex min-h-screen">
        {/* SIDEBAR NAVIGATION - FIXED & SLIDING OVERLAY FOR MOBILE */}
        <aside className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-zinc-950 border-r border-zinc-800 p-8 flex flex-col gap-3 transition-transform duration-300 ease-in-out shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-10 hidden lg:block">
            UC <span className="text-red-600">Admin</span>
          </h1>

          <nav className="space-y-3 flex-1">
            <button onClick={() => setView("menu")} className={`w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-left ${view === "menu" ? "bg-red-600 shadow-lg shadow-red-900/20" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"}`}>Menu Editor</button>
            <button onClick={() => setView("menu-page")} className={`w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-left ${view === "menu-page" ? "bg-yellow-600 shadow-lg shadow-yellow-900/20" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"}`}>Menu Layout</button>
            <button onClick={() => setView("website")} className={`w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-left ${view === "website" ? "bg-blue-600 shadow-lg shadow-blue-900/20" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"}`}>Website Content</button>
            <button onClick={() => setView("hours")} className={`w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-left ${view === "hours" ? "bg-orange-600 shadow-lg shadow-orange-900/20" : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"}`}>Store Hours</button>
          </nav>
          
          <button onClick={() => signOut(auth)} className="bg-zinc-900 border border-zinc-800 hover:bg-red-950/30 hover:border-red-900/50 w-full p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all text-zinc-400 mt-auto">Sign Out</button>
        </aside>

        {/* Backdrop for mobile sidebar - prevents clicks on content while menu is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[65] lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT AREA - ADJUSTED FOR NAV REMOVAL */}
        <main className="flex-1 lg:ml-72 min-h-screen">
          {loading ? (
            <div className="flex items-center justify-center h-screen text-yellow-500 uppercase font-black tracking-widest animate-pulse">Initializing...</div>
          ) : (
            <div className="p-6 md:p-12 lg:p-16 mt-16 lg:mt-0 max-w-6xl mx-auto">
              {/* VIEW: MENU ITEMS */}
              {view === "menu" && (
                <div className="animate-fadeInUp">
                  <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-red-500">Menu Items</h1>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Update your digital inventory</p>
                    </div>
                    <button onClick={() => { setEditingItem({}); setIsAddingNew(true); setIsModalOpen(true); }} className="w-full md:w-auto bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl active:scale-95">+ Add New Item</button>
                  </header>

                  <div className="flex gap-2 mb-10 pb-4 overflow-x-auto no-scrollbar border-b border-zinc-900">
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-5 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all border ${activeCategory === cat ? "bg-red-600 border-red-500" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>
                        {cat.replace("_", " ")}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="bg-zinc-950 border border-zinc-900 p-5 md:p-6 rounded-[32px] flex flex-col md:flex-row items-start md:items-center gap-6 transition-all hover:bg-zinc-900/30">
                        <div className="relative shrink-0">
                          {item.imageURL ? (
                            <img src={item.imageURL} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-zinc-800 shadow-xl" />
                          ) : (
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-600 uppercase">No Img</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-yellow-400 uppercase tracking-tight text-xl mb-1">{item.name}</h3>
                          <p className="text-zinc-500 text-xs italic line-clamp-2 mb-2 leading-relaxed">{item.desc}</p>
                          <span className="text-red-500 font-black text-sm tracking-tighter">{item.price}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-zinc-900">
                          <button onClick={() => toggleAvailability(item)} className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${item.available ?? true ? "bg-green-600/10 border-green-600/50 text-green-500" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}>
                            {item.available ?? true ? "Live" : "Hidden"}
                          </button>
                          <button onClick={() => { setEditingItem(item); setIsAddingNew(false); setIsModalOpen(true); }} className="flex-1 md:flex-none bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-[9px] font-black uppercase transition-all">Edit</button>
                          <button onClick={() => handleDelete(item.id, item.name)} className="bg-red-950/20 border border-red-900/30 text-red-500 px-4 py-3 rounded-xl text-[9px] font-black uppercase transition-all">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW: MENU PAGE LAYOUT */}
              {view === "menu-page" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-4xl lg:text-5xl font-black mb-10 italic uppercase text-yellow-500 tracking-tighter">Menu Layout</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/20 p-6 md:p-10 rounded-[48px] border border-zinc-900">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Menu Heading</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl font-bold text-yellow-500 outline-none h-24 resize-none focus:border-yellow-600/50 transition-colors" value={menuPageContent.menuTitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, menuTitle: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Menu Subtitle</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-sm h-32 outline-none resize-none focus:border-zinc-600 transition-colors leading-relaxed" value={menuPageContent.menuSubtitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, menuSubtitle: e.target.value })} />
                      </div>
                    </div>

                    <div className="p-6 md:p-8 bg-zinc-950 rounded-[32px] border border-zinc-800 space-y-6">
                      <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] italic">Build Your Own Section</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Section Title</label>
                          <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-sm h-20 outline-none resize-none" value={menuPageContent.buildTitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildTitle: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Base Pricing</label>
                            <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs h-20 outline-none resize-none" value={menuPageContent.buildPricing} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricing: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Additional Fees</label>
                            <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs h-20 outline-none resize-none" value={menuPageContent.buildPricingSubtext} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricingSubtext: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1">Red Accent Text</label>
                          <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs text-red-500 font-bold h-24 outline-none resize-none" value={menuPageContent.BuildPricingRedText} onChange={(e) => setMenuPageContent({ ...menuPageContent, BuildPricingRedText: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 p-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]">Save Menu Layout</button>
                  </form>
                </div>
              )}

              {/* VIEW: WEBSITE */}
              {view === "website" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-4xl lg:text-5xl font-black mb-10 italic uppercase text-blue-500 tracking-tighter">Home Page</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/20 p-6 md:p-10 rounded-[48px] border border-zinc-900">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Hero Title</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl font-bold text-sm h-24 outline-none" value={siteContent.heroTitle} onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Hero Subtitle</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-sm h-40 leading-relaxed" value={siteContent.heroSubtitle} onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })} />
                      </div>
                    </div>

                    <div className="p-6 md:p-8 bg-zinc-950 rounded-[32px] border border-zinc-800 space-y-6">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Promo Modal</p>
                        <button type="button" onClick={() => setSiteContent({ ...siteContent, showModal: !siteContent.showModal })} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all border ${siteContent.showModal ? "bg-green-600 border-green-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}>
                          {siteContent.showModal ? "Active" : "Hidden"}
                        </button>
                      </div>
                      <textarea className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-xs italic h-32 outline-none" value={siteContent.LaunchModal} onChange={(e) => setSiteContent({ ...siteContent, LaunchModal: e.target.value })} placeholder="Enter promo text..." />
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                        <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                          {siteContent.LaunchModalImage && <img src={siteContent.LaunchModalImage} className="w-full h-full object-cover" />}
                        </div>
                        <div className="w-full">
                          <label className="text-[9px] font-black text-zinc-500 uppercase block mb-3">Upload Promo Image</label>
                          <input type="file" onChange={(e) => handleImageUpload(e, "launch-modal")} className="text-[10px] block w-full file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-zinc-800 file:text-white" />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all">Publish Home Content</button>
                  </form>
                </div>
              )}

              {/* VIEW: HOURS */}
              {view === "hours" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-4xl lg:text-5xl font-black mb-10 italic uppercase text-orange-500 tracking-tighter">Store Hours</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-8 bg-zinc-900/20 p-6 md:p-10 rounded-[48px] border border-zinc-900">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">Section Heading</label>
                      <textarea className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-sm h-24 outline-none focus:border-orange-500/50 transition-colors" value={hoursContent.heading} onChange={(e) => setHoursContent({ ...hoursContent, heading: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(hoursContent).filter(k => k !== 'heading').map((day) => (
                        <div key={day} className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest ml-1">{day.replace(":", "")}</label>
                          <input className="w-full bg-zinc-950 border border-zinc-800 p-5 rounded-xl font-bold text-sm outline-none focus:border-zinc-700" value={hoursContent[day]} onChange={(e) => setHoursContent({ ...hoursContent, [day]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 p-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all">Update Live Hours</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ITEM MODAL - STICKY TO BOTTOM ON MOBILE */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 z-[100] animate-fadeIn">
            <form onSubmit={handleSaveMenu} className="bg-zinc-950 border-t md:border border-zinc-800 p-8 md:p-12 rounded-t-[40px] md:rounded-[48px] w-full max-w-xl space-y-6 overflow-y-auto max-h-[95vh] shadow-2xl animate-popup">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{isAddingNew ? "New Item" : "Edit Item"}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-900 w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 border border-zinc-800">×</button>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Dish Name</label>
                  <input required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold outline-none focus:border-red-600 text-[16px]" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Price</label>
                  <input required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-red-500 outline-none text-[16px]" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} />
                </div>
                
                <div className="space-y-1 relative">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Description</label>
                  <textarea 
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm h-32 outline-none resize-none focus:border-red-600" 
                    value={editingItem?.desc || ""} 
                    onChange={(e) => {
                      if (e.target.value.length <= 185) setEditingItem({ ...editingItem, desc: e.target.value });
                    }}
                    maxLength={185}
                  />
                  <span className="absolute bottom-3 right-4 text-[9px] font-black text-zinc-600">{editingItem?.desc?.length || 0}/185</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Image Asset</label>
                  <div className="flex items-center gap-6 bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                      {editingItem?.imageURL && <img src={editingItem?.imageURL} className="w-full h-full object-cover" />}
                    </div>
                    <input type="file" onChange={(e) => handleImageUpload(e, "menu-item")} className="text-[10px] w-full file:bg-zinc-800 file:text-white file:rounded-lg file:border-0" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 pb-4">
                <button type="submit" disabled={uploading} className="flex-[2] bg-red-600 hover:bg-red-700 p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all">
                  {uploading ? "Uploading..." : "Save Item"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 p-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* PUBLISH TOAST */}
        {showSavedMessage && (
          <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-12 md:w-auto bg-green-600 text-white px-10 py-5 rounded-[28px] font-black uppercase text-[10px] shadow-2xl animate-bounce-once z-[100] flex items-center justify-center gap-3">
            <span>✅ Live Site Updated Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}