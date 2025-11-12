export default function StoreHours() {
    return (
      <section id="hours" className="bg-zinc-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-yellow-500 mb-6">
            Hours & Location
          </h2>
  
          <p className="text-gray-300 mb-8 text-lg">
            Stop in and enjoy Milwaukee’s favorite local pizza — dine-in, carryout, or delivery. Below are our new updated hours.
          </p>
  
          <div className="grid md:grid-cols-2 gap-10">
            {/* Hours */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Store Hours</h3>
              <ul className="text-gray-200 space-y-2">
                <li><span className="font-semibold text-yellow-400">Monday:</span> 3:30pm - 9pm</li>
                <li><span className="font-semibold text-yellow-400">Tuesday:</span> 3:30pm - 9pm</li>
                <li><span className="font-semibold text-yellow-400">Wednesday:</span> 3:30pm - 9pm</li>
                <li><span className="font-semibold text-yellow-400">Thursday:</span> 3:30pm - 9pm</li>
                <li><span className="font-semibold text-yellow-400">Friday:</span> 3:30pm - 10pm</li>
                <li><span className="font-semibold text-yellow-400">Saturday:</span> 3:30pm - 10pm</li>
                <li><span className="font-semibold text-yellow-400">Sunday:</span> 3:30pm - 9pm</li>
              </ul>
            </div>
  
            {/* Location */}
            <div className="bg-black/60 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Find Us</h3>
              <p className="text-gray-200 mb-3">
                249 East Hampton Avenue<br />
                Whitefish Bay, WI 53217
              </p>
              <p className="text-gray-400 mb-4">Located right on the border of Whitefish Bay and Shorewood.</p>
              <a
                href="https://goo.gl/maps/YOUR_GOOGLE_MAPS_LINK"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-full transition"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
  