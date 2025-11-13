import Slider from "react-slick";

export default function Reviews() {
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

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
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

      <Slider {...settings}>
        {reviews.map((review, i) => (
          <div key={i} className="px-2 sm:px-4">
            <div className="bg-zinc-900 p-4 sm:p-6 rounded-xl shadow-lg h-full flex flex-col justify-between">
              <p className="text-gray-200 mb-4 italic text-sm sm:text-base leading-relaxed">
                “{review.text}”
              </p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <p className="font-semibold text-sm sm:text-base">{review.name}</p>
                <p className="text-yellow-400 text-sm sm:text-base">
                  {"⭐".repeat(review.rating)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
