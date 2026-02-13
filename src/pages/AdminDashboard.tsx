import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc, getDoc, deleteField } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, "menu", activeCategory, "items", itemId));
      triggerNotify();
      fetchData();
    } catch (error) { alert("Failed to delete item."); }
  };

  const handleDeleteImage = async () => {
    if (!editingItem?.imageURL) return;

    if (!confirm("Remove this image permanently?")) return;

    try {
      // 1️⃣ Get storage path from URL
      const decodedURL = decodeURIComponent(editingItem.imageURL);
      const pathStart = decodedURL.indexOf("/o/") + 3;
      const pathEnd = decodedURL.indexOf("?");
      const filePath = decodedURL.substring(pathStart, pathEnd);

      // 2️⃣ Delete from Storage
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);

      // 3️⃣ Remove from Firestore (if editing existing item)
      if (!isAddingNew && editingItem.id) {
        await updateDoc(
          doc(db, "menu", activeCategory, "items", editingItem.id),
          { imageURL: deleteField() }
        );
      }

      // 4️⃣ Update editing state
      setEditingItem({ ...editingItem, imageURL: "" });

      triggerNotify();
    } catch (error) {
      console.error(error);
      alert("Failed to fully remove image.");
    }
  };

  const handleClearField = async (fieldName: string) => {
    if (!confirm(`Clear ${fieldName}?`)) return;
    try {
      let docName = view === "menu-page" ? "menu-page" : "homepage";
      await updateDoc(doc(db, "site_content", docName), { [fieldName]: deleteField() });
      if (view === "menu-page") setMenuPageContent({ ...menuPageContent, [fieldName]: "" });
      else setSiteContent({ ...siteContent, [fieldName]: "" });
      triggerNotify();
    } catch (error) { alert("Failed to clear field."); }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  };

  const triggerNotify = () => {
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 4000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/admin/login";
  };

  const categoryDisplayNames: Record<string, string> = {
    signature_pizzas: "Signature Pizzas",
    appetizers: "Appetizers",
    hoagies: "Hoagies",
    burgers_chicken: "Burgers & Chicken",
    salads: "Salads",
    desserts_drinks: "Desserts & Drinks"
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* MOBILE HEADER */}
      <header className="lg:hidden sticky top-0 z-50 bg-black border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black italic uppercase text-red-600 tracking-tighter">UC Admin</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="px-4 py-2 bg-zinc-900 rounded-xl font-bold text-xs uppercase border border-zinc-700">
            Menu
          </button>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR - DESKTOP AND MOBILE */}
        <aside className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-screen w-72 bg-zinc-950 border-r border-zinc-800 z-40
          transform transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="pt-20 lg:pt-6 p-6 space-y-8 h-full flex flex-col">
            {/* Logo */}
            <div>
              <h1 className="text-3xl font-black italic uppercase text-red-600 tracking-tighter mb-1">UC ADMIN</h1>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider">Update Your Digital Inventory</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-3 flex-1">
              <button onClick={() => setView("menu")} className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase text-xs tracking-wider transition-all ${view === "menu" ? "bg-red-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                📋 Menu Items
              </button>
              <button onClick={() => setView("menu-page")} className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase text-xs tracking-wider transition-all ${view === "menu-page" ? "bg-yellow-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                📄 Menu Page
              </button>
              <button onClick={() => setView("website")} className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase text-xs tracking-wider transition-all ${view === "website" ? "bg-blue-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                🏠 Home Page
              </button>
              <button onClick={() => setView("hours")} className={`w-full text-left px-5 py-4 rounded-2xl font-black uppercase text-xs tracking-wider transition-all ${view === "hours" ? "bg-orange-600 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800"}`}>
                🕒 Store Hours
              </button>
            </nav>

            {/* Logout */}
            <button onClick={handleLogout} className="w-full px-5 py-4 bg-zinc-900 hover:bg-zinc-800 rounded-2xl font-black uppercase text-xs tracking-wider transition-all text-white border border-zinc-700">
              🚪 Log Out
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 z-30 lg:hidden" />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8 lg:p-12 min-h-screen">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-2xl font-black italic text-white animate-pulse">Loading...</div>
            </div>
          ) : (
            <div>
              {/* VIEW: MENU ITEMS */}
              {view === "menu" && (
                <div className="max-w-5xl">
                  {/* Header Section */}
                  <div className="mb-6 md:mb-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 italic uppercase text-red-600 tracking-tighter">Menu Items</h1>
                    <p className="text-xs md:text-sm text-white uppercase tracking-wider mb-6 md:mb-8">Update Your Digital Inventory</p>
                    
                    {/* Add New Button */}
                    <button onClick={() => { setIsAddingNew(true); setEditingItem({}); setIsModalOpen(true); }} className="w-full md:w-auto px-6 md:px-10 py-4 md:py-5 bg-red-600 hover:bg-red-700 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm tracking-wider shadow-xl transition-all">
                      + Add New Item
                    </button>
                  </div>

                  {/* Category Tabs */}
                  <div className="mb-6 md:mb-10 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-2 md:gap-3 min-w-max md:flex-wrap md:min-w-0">
                      {categories.map((cat) => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-wider transition-all whitespace-nowrap ${activeCategory === cat ? "bg-red-600 text-white border border-red-500" : "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800"}`}>
                          {categoryDisplayNames[cat]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items Grid */}
                  <div className="space-y-4 md:space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl md:rounded-3xl p-4 md:p-6 hover:border-zinc-700 transition-all">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                          {/* Image */}
                          <div className="w-full md:w-24 h-32 md:h-24 rounded-xl md:rounded-2xl bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                            {item.imageURL && <img src={item.imageURL} className="w-full h-full object-cover" alt={item.name} />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-black uppercase text-yellow-500 mb-2">{item.name}</h3>
                            <p className="text-xs md:text-sm text-white mb-2 line-clamp-2">{item.desc}</p>
                            <p className="text-base md:text-lg font-black text-red-600">{item.price}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2 md:gap-3 shrink-0">
                            <button onClick={() => toggleAvailability(item)} className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase transition-all border ${item.available ? "bg-green-600 border-green-500 text-white" : "bg-zinc-800 border-zinc-700 text-white"}`}>
                              {item.available ? "Live" : "Hidden"}
                            </button>
                            <button onClick={() => { setIsAddingNew(false); setEditingItem(item); setIsModalOpen(true); }} className="flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase border border-zinc-700 text-white">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="px-4 md:px-6 py-2 md:py-3 bg-zinc-900 hover:bg-red-900/50 rounded-xl md:rounded-2xl text-red-500 font-black text-[10px] md:text-xs border border-zinc-800 hover:border-red-900 uppercase">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW: MENU PAGE */}
              {view === "menu-page" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-10 italic uppercase text-yellow-600 tracking-tighter">Menu Page Layout</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-6 md:space-y-8 bg-zinc-900/20 p-4 md:p-6 lg:p-10 rounded-3xl md:rounded-[48px] border border-zinc-900">
                    
                    {/* Hero Section */}
                    <div className="p-4 md:p-6 lg:p-8 bg-zinc-950 rounded-2xl md:rounded-[32px] border border-zinc-800 space-y-4 md:space-y-6">
                      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">Menu Hero</p>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Main Title</label>
                        <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl font-bold text-sm h-20 md:h-24 outline-none text-white" value={menuPageContent.menuTitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, menuTitle: e.target.value })} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Subtitle</label>
                        <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl text-sm h-28 md:h-32 leading-relaxed outline-none text-white" value={menuPageContent.menuSubtitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, menuSubtitle: e.target.value })} />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-zinc-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-zinc-800">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                          {menuPageContent.menuImageURL && <img src={menuPageContent.menuImageURL} className="w-full h-full object-cover" alt="Menu" />}
                        </div>
                        <div className="w-full">
                          <label className="text-[9px] font-black text-white uppercase block mb-3">Upload Image</label>
                          <input type="file" onChange={(e) => handleImageUpload(e, "menu-page")} className="text-[10px] block w-full file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-zinc-800 file:text-white" />
                        </div>
                        <button type="button" onClick={() => handleClearField("menuImageURL")} className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg text-red-500 text-[9px] font-black uppercase border border-zinc-700">
                          Clear
                        </button>
                      </div>
                    </div>

                    {/* Build Section */}
                    <div className="p-4 md:p-6 lg:p-8 bg-zinc-950 rounded-2xl md:rounded-[32px] border border-zinc-800 space-y-4 md:space-y-6">
                      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">Build Your Own</p>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Build Title</label>
                        <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl font-bold text-sm h-20 md:h-24 outline-none text-white" value={menuPageContent.buildTitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildTitle: e.target.value })} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Build Subtitle</label>
                        <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl text-sm h-28 md:h-32 leading-relaxed outline-none text-white" value={menuPageContent.buildSubtitle} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildSubtitle: e.target.value })} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Pricing</label>
                          <input className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-sm outline-none text-white" value={menuPageContent.buildPricing} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricing: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Subtext</label>
                          <input className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm outline-none text-white" value={menuPageContent.buildPricingSubtext} onChange={(e) => setMenuPageContent({ ...menuPageContent, buildPricingSubtext: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Red Accent</label>
                          <input className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-red-500 text-sm outline-none" value={menuPageContent.BuildPricingRedText} onChange={(e) => setMenuPageContent({ ...menuPageContent, BuildPricingRedText: e.target.value })} />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 p-5 md:p-6 rounded-2xl md:rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]">Save Menu Layout</button>
                  </form>
                </div>
              )}

              {/* VIEW: WEBSITE */}
              {view === "website" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-10 italic uppercase text-blue-500 tracking-tighter">Home Page</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-6 md:space-y-8 bg-zinc-900/20 p-4 md:p-6 lg:p-10 rounded-3xl md:rounded-[48px] border border-zinc-900">
                    <div className="space-y-4 md:space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Hero Title</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl font-bold text-sm h-20 md:h-24 outline-none text-white" value={siteContent.heroTitle} onChange={(e) => setSiteContent({ ...siteContent, heroTitle: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Hero Subtitle</label>
                        <textarea className="w-full bg-zinc-950 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl text-sm h-32 md:h-40 leading-relaxed text-white" value={siteContent.heroSubtitle} onChange={(e) => setSiteContent({ ...siteContent, heroSubtitle: e.target.value })} />
                      </div>
                    </div>

                    <div className="p-4 md:p-6 lg:p-8 bg-zinc-950 rounded-2xl md:rounded-[32px] border border-zinc-800 space-y-4 md:space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Promo Modal</p>
                        <button type="button" onClick={() => setSiteContent({ ...siteContent, showModal: !siteContent.showModal })} className={`w-full sm:w-auto px-5 py-2 rounded-full text-[9px] font-black uppercase transition-all border ${siteContent.showModal ? "bg-green-600 border-green-500 text-white" : "bg-zinc-800 border-zinc-700 text-white"}`}>
                          {siteContent.showModal ? "Active" : "Hidden"}
                        </button>
                      </div>
                      <textarea className="w-full bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl text-xs italic h-28 md:h-32 outline-none text-white" value={siteContent.LaunchModal} onChange={(e) => setSiteContent({ ...siteContent, LaunchModal: e.target.value })} placeholder="Enter promo text..." />

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-zinc-900 p-4 md:p-6 rounded-xl md:rounded-2xl border border-zinc-800">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                          {siteContent.LaunchModalImage && <img src={siteContent.LaunchModalImage} className="w-full h-full object-cover" alt="Promo" />}
                        </div>
                        <div className="w-full">
                          <label className="text-[9px] font-black text-white uppercase block mb-3">Upload Promo Image</label>
                          <input type="file" onChange={(e) => handleImageUpload(e, "launch-modal")} className="text-[10px] block w-full file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-zinc-800 file:text-white" />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-5 md:p-6 rounded-2xl md:rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all">Publish Home Content</button>
                  </form>
                </div>
              )}

              {/* VIEW: HOURS */}
              {view === "hours" && (
                <div className="max-w-4xl animate-fadeInUp">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-10 italic uppercase text-orange-500 tracking-tighter">Store Hours</h1>
                  <form onSubmit={handleUpdateGlobalContent} onKeyDown={handleFormKeyDown} className="space-y-6 md:space-y-8 bg-zinc-900/20 p-4 md:p-6 lg:p-10 rounded-3xl md:rounded-[48px] border border-zinc-900">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">Section Heading</label>
                      <textarea className="w-full bg-zinc-950 border border-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl text-sm h-20 md:h-24 outline-none focus:border-orange-500/50 transition-colors text-white" value={hoursContent.heading} onChange={(e) => setHoursContent({ ...hoursContent, heading: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.keys(hoursContent).filter(k => k !== 'heading').map((day) => (
                        <div key={day} className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-white tracking-widest ml-1">{day.replace(":", "")}</label>
                          <input className="w-full bg-zinc-950 border border-zinc-800 p-4 md:p-5 rounded-xl font-bold text-sm outline-none focus:border-zinc-700 text-white" value={hoursContent[day]} onChange={(e) => setHoursContent({ ...hoursContent, [day]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 p-5 md:p-6 rounded-2xl md:rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all">Update Live Hours</button>
                  </form>
                </div>
              )}
            </div>
          )}
        </main>

        {/* ITEM MODAL - STICKY TO BOTTOM ON MOBILE */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 z-[100] animate-fadeIn">
            <form onSubmit={handleSaveMenu} className="bg-zinc-950 border-t md:border border-zinc-800 p-6 md:p-8 lg:p-12 rounded-t-3xl md:rounded-[48px] w-full max-w-xl space-y-5 md:space-y-6 overflow-y-auto max-h-[95vh] shadow-2xl animate-popup">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{isAddingNew ? "New Item" : "Edit Item"}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-900 w-10 h-10 rounded-full flex items-center justify-center text-white border border-zinc-800 text-xl">×</button>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white uppercase ml-1">Dish Name</label>
                  <input required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold outline-none focus:border-red-600 text-[16px] text-white" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-white uppercase ml-1">Price</label>
                  <input required className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-bold text-red-500 outline-none text-[16px]" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[9px] font-black text-white uppercase ml-1">Description</label>
                  <textarea
                    className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm h-28 md:h-32 outline-none resize-none focus:border-red-600 text-white"
                    value={editingItem?.desc || ""}
                    onChange={(e) => {
                      if (e.target.value.length <= 185) setEditingItem({ ...editingItem, desc: e.target.value });
                    }}
                    maxLength={185}
                  />
                  <span className="absolute bottom-3 right-4 text-[9px] font-black text-zinc-600">{editingItem?.desc?.length || 0}/185</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase ml-1">Image Asset</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700 shadow-inner">
                      {editingItem?.imageURL && <img src={editingItem?.imageURL} className="w-full h-full object-cover" alt="Item" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input type="file" onChange={(e) => handleImageUpload(e, "menu-item")} className="text-[10px] w-full file:bg-zinc-800 file:text-white file:rounded-lg file:border-0 file:px-4 file:py-2" />
                      {editingItem?.imageURL && (
                        <button 
                          type="button" 
                          onClick={handleDeleteImage} 
                          className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-red-400 text-[10px] font-black uppercase border border-red-900/50 transition-all"
                        >
                          🗑️ Delete Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 pb-2 md:pb-4">
                <button type="submit" disabled={uploading} className="flex-[2] bg-red-600 hover:bg-red-700 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all">
                  {uploading ? "Uploading..." : "Save Item"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 p-4 md:p-5 rounded-xl md:rounded-2xl font-black uppercase text-xs tracking-widest transition-all text-white">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* PUBLISH TOAST */}
        {showSavedMessage && (
          <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 lg:right-12 md:w-auto bg-green-600 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[28px] font-black uppercase text-[10px] shadow-2xl animate-bounce-once z-[100] flex items-center justify-center gap-3">
            <span>✅ Live Site Updated Successfully</span>
          </div>
        )}
      </div>
    </div>
  );
}