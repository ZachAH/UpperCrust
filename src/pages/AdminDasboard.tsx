import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  const [activeCategory, setActiveCategory] = useState("signature_pizzas");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const categories = ["signature_pizzas", "pizzas", "appetizers", "hoagies", "burgers_chicken", "salads", "desserts_drinks"];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "menu", activeCategory, "items"), orderBy("order", "asc"));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [activeCategory]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileRef = ref(storage, `images/pizzas/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      setEditingItem({ ...editingItem, imageURL: url });
    } catch (error) { alert("Upload failed"); } finally { setUploading(false); }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    // 1. Create a clean copy of the item data
    const dataToSave = { ...editingItem };

    // 2. Data Cleaning: If not a signature pizza, remove the imageURL field
    // This prevents non-pizza items from having empty image properties
    if (activeCategory !== "signature_pizzas") {
      delete dataToSave.imageURL;
    }

    try {
      if (isAddingNew) {
        // 3. Add to the collection based on the CURRENT active category
        await addDoc(collection(db, "menu", activeCategory, "items"), {
          ...dataToSave,
          order: items.length + 1,
          available: editingItem.available ?? true
        });
      } else {
        // 4. Update the existing document in the CURRENT category
        await updateDoc(doc(db, "menu", activeCategory, "items", editingItem.id), dataToSave);
      }

      // UI Updates
      setIsModalOpen(false);
      setShowSavedMessage(true);
      fetchItems(); // Refresh the list for the current category
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error) {
      console.error("Save Error:", error);
      alert("Save failed");
    }
  };

  const toggleAvailability = async (item: any) => {
    await updateDoc(doc(db, "menu", activeCategory, "items", item.id), { available: !item.available });
    fetchItems();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      await deleteDoc(doc(db, "menu", activeCategory, "items", id));
      fetchItems();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white overflow-hidden">

      {/* SIDEBAR (Desktop) / TOP NAV (Mobile) */}
      {/* Added pt-8 for top padding */}
      <aside className="w-full md:w-72 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-4 md:p-6 pt-8 md:pt-10 flex flex-col shrink-0">
        <div className="flex items-center justify-between md:block mb-6 md:mb-10">
          <h2 className="text-xl font-black text-red-600 uppercase italic tracking-tighter">Upper Crust Admin</h2>
          <button onClick={() => signOut(auth)} className="md:hidden text-[10px] font-bold text-zinc-500 border border-zinc-800 px-2 py-1 rounded">LOGOUT</button>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-y-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap md:whitespace-normal text-left px-4 py-2.5 rounded-xl transition-all text-xs md:text-sm font-bold shrink-0 ${activeCategory === cat ? "bg-red-600 text-white shadow-lg" : "bg-zinc-800/50 md:bg-transparent text-zinc-500 hover:text-zinc-200"
                }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </nav>

        <button onClick={() => signOut(auth)} className="hidden md:block mt-auto p-3 text-xs text-zinc-600 hover:text-white border border-zinc-800 rounded-xl transition font-bold">LOGOUT</button>
      </aside>

      {/* MAIN CONTENT */}
      {/* Added pt-12 for top padding */}
      <main className="flex-1 p-4 md:p-10 pt-12 md:pt-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12">
          <div>
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-1">Live Menu</p>
            <h1 className="text-3xl md:text-5xl font-black capitalize tracking-tighter">{activeCategory.replace("_", " ")}</h1>
          </div>
          <button
            onClick={() => { setIsAddingNew(true); setEditingItem({ name: "", price: "", desc: "", available: true }); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-2xl font-black transition shadow-xl uppercase text-xs tracking-tighter"
          >
            + Add New Item
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-zinc-600 font-bold animate-pulse italic">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className={`bg-zinc-900/50 border ${item.available ? 'border-zinc-800' : 'border-red-900/40'} p-4 md:p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-all`}>
                <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                  {/* Conditional Rendering for Image display - only for signature pizzas */}
                  {activeCategory === "signature_pizzas" && (
                    <div className="relative shrink-0">
                      <img src={item.imageURL || 'https://via.placeholder.com/150'} className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl ${!item.available && 'grayscale contrast-50'}`} alt="" />
                      {!item.available && <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center rounded-2xl font-black text-[8px] text-white uppercase tracking-tighter">Sold Out</div>}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg md:text-xl truncate">{item.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-red-500 font-black text-base md:text-lg">{item.price}</p>
                      <button onClick={() => toggleAvailability(item)} className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${item.available ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                        {item.available ? 'Available' : 'Sold Out'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => { setIsAddingNew(false); setEditingItem(item); setIsModalOpen(true); }} className="flex-1 sm:flex-none bg-zinc-800 hover:bg-zinc-700 px-6 py-2.5 rounded-2xl text-xs font-black transition">EDIT</button>
                  <button onClick={() => handleDelete(item.id, item.name)} className="flex-1 sm:flex-none bg-red-950/20 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-2xl text-xs font-black transition uppercase">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MOBILE TOAST */}
        {showSavedMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-12 md:bottom-12 bg-green-600 text-white px-6 md:px-10 py-3 md:py-5 rounded-2xl md:rounded-3xl shadow-2xl z-[60] font-black uppercase tracking-widest text-[10px] md:text-sm">
            ✅ Changes Live
          </div>
        )}

        {/* RESPONSIVE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <form onSubmit={handleSave} className="bg-zinc-900 border-t sm:border border-zinc-800 p-6 md:p-10 rounded-t-[32px] sm:rounded-[40px] w-full max-w-lg space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{isAddingNew ? "New Menu Item" : "Update Item"}</h2>

              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Available for order</p>
                <button type="button" onClick={() => setEditingItem({ ...editingItem, available: !editingItem.available })} className={`w-12 h-7 rounded-full transition-colors relative ${editingItem?.available ? 'bg-green-600' : 'bg-red-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${editingItem?.available ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase ml-1">Name</label>
                    <input required className="w-full bg-zinc-800 border-zinc-700 p-3 rounded-xl outline-none focus:ring-1 focus:ring-red-600 font-bold text-sm" value={editingItem?.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase ml-1">Price</label>
                    <input required className="w-full bg-zinc-800 border-zinc-700 p-3 rounded-xl outline-none focus:ring-1 focus:ring-red-600 font-bold text-sm" value={editingItem?.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-zinc-500 font-bold uppercase ml-1">Description</label>
                  <textarea className="w-full bg-zinc-800 border-zinc-700 p-3 rounded-xl outline-none focus:ring-1 focus:ring-red-600 font-bold text-sm h-24 resize-none" value={editingItem?.desc || ""} onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })} />
                </div>

                {/* IMAGE UPLOAD ONLY FOR SIGNATURE PIZZAS */}
                {activeCategory === "signature_pizzas" && (
                  <div className="space-y-2">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase ml-1">Image Upload</label>
                    <input type="file" onChange={handleImageChange} className="text-[10px] w-full file:bg-zinc-700 file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1" />
                    {uploading && <p className="text-red-500 text-[9px] animate-pulse">Uploading...</p>}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" className="bg-red-600 p-4 rounded-2xl font-black uppercase tracking-widest text-xs">Confirm</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-800 p-4 rounded-2xl font-black uppercase tracking-widest text-xs">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}