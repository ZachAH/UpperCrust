import { BUSINESS } from "../config/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-zinc-900 text-white py-20 px-6 flex flex-col items-center"
    >
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-4xl font-extrabold text-yellow-500 mb-6">
          Get In Touch
        </h2>
        <p className="text-gray-300 text-lg mb-10">
          Have a question about our menu, catering, or hours? Give us a call or
          stop by — we&apos;re happy to help.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12 text-gray-300 max-w-3xl mx-auto">
          <div className="bg-black/60 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">Call Us</h3>
            <p>
              <a
                href={`tel:${BUSINESS.phoneTel}`}
                className="text-yellow-400 hover:text-yellow-500 transition"
              >
                {BUSINESS.phone}
              </a>
            </p>
          </div>
          <div className="bg-black/60 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-yellow-400 font-bold text-lg mb-2">Visit Us</h3>
            <p>
              {BUSINESS.streetAddress}
              <br />
              {BUSINESS.addressLocality}, {BUSINESS.addressRegion}{" "}
              {BUSINESS.postalCode}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-black/60 border border-zinc-800 rounded-xl p-8 shadow-lg">
          <p className="text-gray-300 mb-6">
            Ready to order? Place your order online for pickup or delivery to
            Whitefish Bay and the surrounding North Shore.
          </p>
          <a
            href={BUSINESS.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full transition"
          >
            Order Online
          </a>
        </div>
      </div>
    </section>
  );
}
