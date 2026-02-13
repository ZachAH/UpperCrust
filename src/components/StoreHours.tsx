import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// Updated to match the exact keys with Sunday first
interface HoursData {
  "Sunday::": string;
  "Monday::": string;
  "Tuesday::": string;
  "Wednesday::": string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  heading: string;
}

export default function StoreHours() {
  const [hoursData, setHoursData] = useState<HoursData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        // Path matches your screenshot: site_content -> hours
        const docRef = doc(db, "site_content", "hours");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHoursData(docSnap.data() as HoursData);
        }
      } catch (error) {
        console.error("Error fetching hours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  if (loading) return <div className="py-20 text-center text-white bg-black">Loading...</div>;

  // Mapping the clean UI labels to the specific Firestore keys - NOW STARTING WITH SUNDAY
  const daysMap = [
    { label: "Sunday", key: "Sunday:" as keyof HoursData },
    { label: "Monday", key: "Monday:" as keyof HoursData },
    { label: "Tuesday", key: "Tuesday:" as keyof HoursData },
    { label: "Wednesday", key: "Wednesday:" as keyof HoursData },
    { label: "Thursday", key: "Thursday:" as keyof HoursData },
    { label: "Friday", key: "Friday:" as keyof HoursData },
    { label: "Saturday", key: "Saturday:" as keyof HoursData },
  ];

  return (
    <section id="hours" className="bg-black text-white py-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-black text-yellow-500 mb-6 italic uppercase tracking-tighter">
          Hours & Location
        </h2>

        <p className="text-gray-300 mb-12 text-xl max-w-3xl mx-auto">
          {hoursData?.heading || "Stop in and enjoy Milwaukee's favorite local pizza — dine-in, carryout, or delivery."}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Store Hours Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
            <h3 className="text-3xl font-black text-yellow-500 mb-8 uppercase italic">Store Hours</h3>
            <ul className="space-y-4 text-left max-w-xs mx-auto">
              {daysMap.map((day) => (
                <li key={day.label} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-bold text-yellow-500 uppercase text-sm">{day.label}:</span>
                  <span className="text-gray-200 font-medium">
                    {hoursData ? hoursData[day.key] : "3:30pm - 9pm"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Us Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 shadow-2xl flex flex-col justify-center">
            <h3 className="text-3xl font-black text-yellow-500 mb-8 uppercase italic">Find Us</h3>
            <div className="text-center space-y-4">
              <p className="text-2xl font-bold text-gray-100">
                249 East Hampton Avenue<br />
                Whitefish Bay, WI 53217
              </p>
              <p className="text-gray-400 text-lg italic">
                Located right on the border of Whitefish Bay and Shorewood.
              </p>
              <div className="pt-6">
                <a
                  href="https://www.google.com/maps/dir//249+E+Hampton+Ave,+Whitefish+Bay,+WI+53217"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase italic px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}