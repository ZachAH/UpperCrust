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
            Have a question about our menu, catering, or hours? We’d love to hear
            from you! Call, email, or send us a message below.
          </p>
  
          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 text-gray-300">
            <div className="bg-black/60 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">Call Us</h3>
              <p>(414) 332-6820​</p>
            </div>
            <div className="bg-black/60 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">Visit Us</h3>
              <p>
                249 East Hampton Avenue
                <br />
                Whitefish Bay, WI 53217
              </p>
            </div>
            <div className="bg-black/60 p-6 rounded-xl border border-zinc-800">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">Email</h3>
              <p>
                <a
                  href="mailto:contactus@uppercrustpizza.us"
                  className="text-yellow-400 hover:text-yellow-500 transition"
                >
                  contactus@uppercrustpizza.us
                </a>
              </p>
            </div>
          </div>
  
          {/* Contact Form replaced with mailto link */}
          <div className="max-w-3xl mx-auto bg-black/60 border border-zinc-800 rounded-xl p-8 shadow-lg space-y-6">
            <p className="text-gray-300 mb-4">
              Prefer to send an email directly? Click the button Below!
            </p>
  
            <a
              href="mailto:contactus@uppercrustpizza.us?subject=Inquiry from Upper Crust Pizza Website"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full transition w-full md:w-auto"
            >
              Send Us an Email
            </a>
          </div>
        </div>
      </section>
    );
  }
  
  