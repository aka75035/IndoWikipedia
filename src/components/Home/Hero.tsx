export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
          The free encyclopedia of India
        </p>

        <h1 className="font-serif text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
          Discover India.
          <br />
          <span className="text-blue-600">
            One article at a time.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Explore the history, people, places, culture,
          science, and knowledge of India.
        </p>

        <div className="mx-auto mt-8 max-w-2xl">
          {/* SearchBar goes here later */}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            "History",
            "Culture",
            "Science",
            "Geography",
            "People",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}