import Slider from "react-slick";
import { useState } from "react";

export default function Reviews() {

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const reviews = [
    {
      name: "Drew Kusick",
      text: "Absolutely All we can say is the pizza looked good,it was par baked, took it home and over baked it! So I can't say too much for now except it probably would of been excellent if we didn't screw up! Thanks guys for a nice looking pizza, next time we'll be more careful!love Upper Crust Pizza! The crust is perfect every time and the staff are always friendly.",
      rating: 4,
    },
    {
      name: "Dan Cary",
      text: "This place always, always, always hits the spot. Whether we do carry-out or delivery, this place is hands down the best pizza place on the Northshore. Cannot recommend enough",
      rating: 5,
    },
    {
      name: "Leola C",
      text: "Ordered delivery tonight and everything was so good! I will definitely keep ordering from, supporting, and recommending this locally owned treasure in the future. Keep being fantastic, Upper Crust!",
      rating: 5,
    },
    {
      name: "Zachary Williams",
      text: "Excellent pizza and other foods, like sandwiches and pasta, plus the standard pizza joint appetizers, like mozzarella sticks and fried mushrooms. Get the pizza with extra sauce, well baked, and cut into squares for something that comes close to tavern style pizza. The crust is a little thick to be true tavern style, but it's a good substitute.",
      rating: 5,
    },
    {
      name: "Libbie",
      text: "We ordered a Deluxe and an Upper Crust Special and both were delicious!! Delivered nice and hot, delivery person was fantastic, and customer service all around was great. I highly recommend to anyone!",
      rating: 5,
    },
    {
      name: "Amanda Butler",
      text: "There’s nothing like this pizza! I always make sure to pick one up when the area. The service is always great making pick up a breeze!",
      rating: 5,
    },
    {
      name: "Noah Lehman",
      text: "Delicious, reasonably priced pizza. Easy pickup with parking out front. Been going here for years and although I'm only in town once or twice a year, I always end up getting a couple of pies and they are always great. Cheers!",
      rating: 5,
    },
    {
      name: "Karlee Pasbrig",
      text: "Pizzas were amazing! Excellent customer service and speedy!",
      rating: 5,
    },
    {
      name: "Jessica Carlson",
      text: "Food is amazing and the customer service is stellar! I recommended to everyone!",
      rating: 5,
    },
    {
      name: "Tristan Agacki",
      text: "FBest pizza around! Nobody makes a better thin crust garden pizza, but you truly can’t go wrong here. Also recommend their gluten free crust for those who are sensitive to gluten, or are just in the mood to try something new.",
      rating: 5,
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };


  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3, //default for desktop
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3 } }, // very large desktops
      { breakpoint: 1200, settings: { slidesToShow: 2 } }, // laptops + tablets
      { breakpoint: 992,  settings: { slidesToShow: 2 } }, // iPads + big phones in landscape
      { breakpoint: 768,  settings: { slidesToShow: 2 } }, // real tablets
      { breakpoint: 600,  settings: { slidesToShow: 1 } }, // MOST PHONES portrait
    ],
  };


  return (
    <section id="reviews" className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-3 text-yellow-500">
          What People Are Saying
        </h2>
        <p className="text-gray-300">
          Real reviews from happy customers — straight from Google.
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black to-transparent z-10"></div>

        <Slider {...settings}>
          {reviews.map((review, i) => {
            const isExpanded = expandedIndex === i;

            return (
              <div key={i} className="px-3 sm:px-4 min-w-[50%]">
                <div className="bg-zinc-900 p-5 sm:p-6 rounded-xl shadow-lg h-full flex flex-col review-card transition-all duration-300">

                  {/* Review text */}
                  <div className="relative">
                    <p
                      className={`text-gray-200 italic leading-relaxed text-sm sm:text-base transition-all 
                      ${isExpanded ? "max-h-full" : "max-h-40 overflow-hidden"}
                    `}
                    >
                      “{review.text}”
                    </p>

                    {/* Gradient fade for long text */}
                    {!isExpanded && review.text.length > 160 && (
                      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  {/* Read More toggle */}
                  {review.text.length > 160 && (
                    <button
                      onClick={() => toggleExpand(i)}
                      className="mt-3 text-yellow-400 text-sm font-semibold underline-offset-4 hover:text-yellow-300"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <p className="font-semibold text-sm sm:text-base">{review.name}</p>

                    {/* Star icons instead of ⭐⭐⭐⭐⭐ */}
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <svg
                          key={idx}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="gold"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.033a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.033a1 1 0 00-1.175 0l-2.8 2.033c-.784.57-1.838-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
}
