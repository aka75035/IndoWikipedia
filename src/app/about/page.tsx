import  Link  from "next/link";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about IndoWikipedia, its vision, technology, development, and creator.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">

      
      {/* Hero */}
      <section className="">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
          About the Project
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          IndoWikipedia
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          IndoWikipedia is an independent knowledge platform focused on
          organizing and presenting information about India in a modern,
          accessible, and structured way.
        </p>

        <div className="mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          Active Development
        </div>
      </section>

      <div className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">Creator</p>
          <p className="mt-1 font-medium">Akash Yadav</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Started</p>
          <p className="mt-1 font-medium">August 6, 2026</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="mt-1 font-medium">Active Development</p>
        </div>
      </div>

      {/* Project Overview */}
      <section className="mt-16">
        <SectionTitle
          title="What is IndoWikipedia?"
          eyebrow="Project Overview"
        />

        <div className="mt-6 space-y-4 leading-8 text-gray-600">
          <p>
            IndoWikipedia is a knowledge platform created with a specific
            focus on India. The project aims to organize information about
            Indian history, geography, states, cities, culture, people,
            science, technology, and many other subjects.
          </p>

          <p>
            The platform is being developed from the ground up rather than
            simply acting as a collection of static pages. Articles,
            revisions, categories, users, references, media, and other
            components are managed through a structured content system.
          </p>

          <p>
            The long-term goal is to create a platform where knowledge about
            India can be discovered, organized, maintained, and eventually
            contributed to by a wider community.
          </p>
        </div>
      </section>

      {/* Why */}
      <section className="mt-16">
        <SectionTitle
          title="Why was this project created?"
          eyebrow="The Idea"
        />

        <div className="mt-6 space-y-4 leading-8 text-gray-600">
          <p>
            IndoWikipedia started as a software development project with a
            simple idea: build an encyclopedia focused specifically on India
            while learning what it takes to design and develop a real
            knowledge platform.
          </p>

          <p>
            Building an encyclopedia involves much more than displaying
            articles. It requires systems for content management, revisions,
            categorization, authentication, publishing, references, media,
            search, discovery, and eventually community contribution.
          </p>

          <p>
            IndoWikipedia is therefore both a knowledge project and a
            software engineering project.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="mt-16">
        <SectionTitle
          title="Our Vision"
          eyebrow="Long-Term Vision"
        />

        <div className="mt-6 rounded-2xl border bg-gray-50 p-6 sm:p-8">
          <p className="text-xl leading-9 text-gray-700">
            To build a modern, India-focused knowledge platform where
            information about India can be easily discovered, understood,
            organized, referenced, and eventually contributed to by people
            from around the world.
          </p>
        </div>
      </section>

      {/* Current Status */}
      <section className="mt-16">
        <SectionTitle
          title="Current Status"
          eyebrow="Where We Are Now"
        />

        <div className="mt-6 rounded-2xl border p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-yellow-500" />

            <h3 className="text-lg font-semibold">
              IndoWikipedia is actively being developed
            </h3>
          </div>

          <div className="mt-6 space-y-4 leading-7 text-gray-600">
            <p>
              The project is currently in an early development stage. Core
              systems have been implemented, but the platform is not yet a
              finished encyclopedia.
            </p>

            <p>
              The article architecture, revision system, categories,
              authentication, article editor, publishing workflow, and
              public reading experience are being developed and improved.
            </p>

            <p>
              Both the software and the content library will continue to
              evolve as development progresses.
            </p>
          </div>
        </div>
      </section>

      {/* Built */}
      <section className="mt-16">
        <SectionTitle
          title="What has been built?"
          eyebrow="Current Features"
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <FeatureCard
            title="Article System"
            description="Structured articles with titles, summaries, sections, metadata, references, and publishing status."
          />

          <FeatureCard
            title="Revision System"
            description="Articles use revisions so changes can be stored independently instead of simply overwriting previous content."
          />

          <FeatureCard
            title="Block-Based Content"
            description="Articles can contain different content types including paragraphs, headings, lists, tables, images, galleries, quotes, and videos."
          />

          <FeatureCard
            title="Categories"
            description="Articles can be organized into categories and subcategories to make information easier to discover."
          />

          <FeatureCard
            title="Authentication"
            description="User authentication and account systems provide the foundation for authorship and future contribution features."
          />

          <FeatureCard
            title="Public Article Experience"
            description="Published articles have dedicated public pages designed for reading and navigation."
          />

          <FeatureCard
            title="References"
            description="Articles can contain references and supporting sources to improve the reliability and traceability of information."
          />

          <FeatureCard
            title="Random Article"
            description="Readers can discover content through a random article experience."
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="mt-16">
        <SectionTitle
          title="How IndoWikipedia is structured"
          eyebrow="Article Architecture"
        />

        <div className="mt-8 overflow-x-auto rounded-2xl border bg-gray-50 p-6">
          <pre className="text-sm leading-7 text-gray-700">
{`Article
│
├── title
├── slug
├── status
├── createdBy
├── publishedAt
├── updatedAt
│
└── currentRevision
       │
       ↓
   ArticleRevision
       │
       ├── title
       ├── summary
       ├── sections
       ├── infobox
       ├── references
       ├── categories
       │
       └── content blocks
              │
              ├── paragraph
              ├── heading
              ├── image
              ├── gallery
              ├── table
              ├── quote
              ├── list
              ├── ordered-list
              └── video`}
          </pre>
        </div>

        <div className="mt-6 space-y-4 leading-8 text-gray-600">
          <p>
            One of the important architectural decisions in IndoWikipedia
            is separating an article from its revisions.
          </p>

          <p>
            This provides a foundation for maintaining editing history,
            comparing versions, restoring previous versions, and eventually
            creating a more complete collaborative editing system.
          </p>
        </div>
      </section>

      {/* Technology */}
      <section className="mt-16">
        <SectionTitle
          title="Technology"
          eyebrow="Built With"
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <TechCard
            name="Next.js"
            description="Application framework used for the web application and server-side functionality."
          />

          <TechCard
            name="React"
            description="Used to build the interactive user interface and reusable components."
          />

          <TechCard
            name="TypeScript"
            description="Provides static typing and improves maintainability across the project."
          />

          <TechCard
            name="Tailwind CSS"
            description="Used to build and maintain the user interface styling."
          />

          <TechCard
            name="MongoDB"
            description="Primary database used to store articles, revisions, users, categories, and related data."
          />

          <TechCard
            name="Mongoose"
            description="Used for MongoDB models, schemas, relationships, and database operations."
          />
        </div>
      </section>

      {/* Development */}
      <section className="mt-16">
        <SectionTitle
          title="Development Approach"
          eyebrow="How It Is Being Built"
        />

        <div className="mt-8 space-y-0">
          <TimelineItem
            number="01"
            title="Foundation"
            description="Design the application architecture, database models, authentication, and core infrastructure."
          />

          <TimelineItem
            number="02"
            title="Article System"
            description="Build articles, revisions, publishing, categories, references, and structured content."
          />

          <TimelineItem
            number="03"
            title="Editor"
            description="Create an editor capable of handling different types of article content."
          />

          <TimelineItem
            number="04"
            title="Public Experience"
            description="Build the reading experience for published articles and improve navigation and discovery."
          />

          <TimelineItem
            number="05"
            title="Contribution"
            description="Expand the platform toward user contributions, moderation, revision management, and collaborative editing."
          />

          <TimelineItem
            number="06"
            title="Community"
            description="Eventually develop the systems required to support a broader community of readers and contributors."
          />
        </div>
      </section>

      {/* Creator */}
      <section className="mt-16">
        <SectionTitle
          title="Who created IndoWikipedia?"
          eyebrow="The Creator"
        />

        <div className="mt-8 rounded-2xl border p-6 sm:p-8">
          {/* Creator Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gray-100 text-3xl font-bold">
              A
            </div>

            {/* Basic Info */}
            <div>
              <Link
                href="https://portfolio-tau-coral.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <h3 className="text-2xl font-semibold transition hover:underline">
                  Akash Yadav
                </h3>
              </Link>

              <p className="mt-1 text-gray-500">
                Founder & Full-Stack Developer
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Creator of IndoWikipedia
              </p>
            </div>
          </div>

          {/* About Creator */}
          <div className="mt-8 space-y-5 leading-8 text-gray-600">
            <p>
              IndoWikipedia was created and is currently developed and
              maintained by{" "}
              <strong className="font-medium text-gray-900">
                Akash Yadav
              </strong>.
            </p>

            <p>
              Akash is a Computer Science and Engineering student and a
              software developer interested in building web applications,
              backend systems, databases, and practical software projects.
            </p>

            <p>
              IndoWikipedia started as an idea to build an India-focused
              knowledge platform while exploring what it takes to design and
              develop a real-world encyclopedia from the ground up.
            </p>

            <p>
              As the primary developer, Akash is responsible for the
              architecture and development of the platform, including the
              frontend, backend services, database design, authentication,
              article management system, revision architecture, content
              editor, categories, publishing workflow, and overall user
              experience.
            </p>

            <p>
              The project is being developed incrementally. New features,
              improvements, content systems, and infrastructure are being
              added as the project evolves.
            </p>
          </div>

          {/* Project Information */}
          <div className="mt-8 grid gap-4 border-t pt-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">
                Creator
              </p>

              <p className="mt-1 font-medium">
                Akash Yadav
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Project Started
              </p>

              <p className="mt-1 font-medium">
                August 2026
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Current Status
              </p>

              <p className="mt-1 font-medium">
                Active Development
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="mt-8 border-t pt-6">
            <h4 className="font-semibold text-gray-900">
              Role in IndoWikipedia
            </h4>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Founder",
                "Full-Stack Developer",
                "UI/UX Developer",
                "Backend Developer",
                "Database Designer",
                "System Architect",
              ].map((role) => (
                <span
                  key={role}
                  className="rounded-full border px-3 py-1.5 text-sm text-gray-600"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-8 border-t pt-6">
            <h4 className="font-semibold text-gray-900">
              Creator Links
            </h4>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="https://portfolio-tau-coral.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
              >
                Portfolio
              </Link>

              <Link
                href="https://github.com/aka75035"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
              >
                GitHub
              </Link>

              <Link
                href="https://www.linkedin.com/in/akash-yadav-717557291/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mt-16">
        <SectionTitle
          title="Roadmap"
          eyebrow="What's Next"
        />

        <div className="mt-8 space-y-4">
          <RoadmapItem
            status="Completed"
            title="Core Article Architecture"
          />

          <RoadmapItem
            status="Completed"
            title="Article Revisions"
          />

          <RoadmapItem
            status="Completed"
            title="Categories and Organization"
          />

          <RoadmapItem
            status="Completed"
            title="Public Article Experience"
          />

          <RoadmapItem
            status="In Progress"
            title="Improved Search and Discovery"
          />

          <RoadmapItem
            status="In Progress"
            title="Improved Article Editor"
          />

          <RoadmapItem
            status="Planned"
            title="Community Contributions"
          />

          <RoadmapItem
            status="Planned"
            title="Revision Comparison and Rollback"
          />

          <RoadmapItem
            status="Planned"
            title="Moderation System"
          />

          <RoadmapItem
            status="Planned"
            title="Expanded Search"
          />

          <RoadmapItem
            status="Planned"
            title="Discussion and Community Features"
          />
        </div>
      </section>

      {/* Limitations */}
      <section className="mt-16">
        <SectionTitle
          title="Current Limitations"
          eyebrow="Transparency"
        />

        <div className="mt-6 space-y-4 leading-8 text-gray-600">
          <p>
            IndoWikipedia is still a developing project and should not yet
            be considered a complete encyclopedia.
          </p>

          <ul className="space-y-3 pl-5">
            <li className="list-disc">
              The number of articles is still growing.
            </li>

            <li className="list-disc">
              Some features are still experimental or under development.
            </li>

            <li className="list-disc">
              Search and discovery capabilities will continue to improve.
            </li>

            <li className="list-disc">
              Community contribution and moderation systems are not yet
              fully implemented.
            </li>

            <li className="list-disc">
              The user interface and article experience are continuously
              being improved.
            </li>
          </ul>
        </div>
      </section>

      {/* Open source */}
      <section className="mt-16">
        <SectionTitle
          title="Project Links"
          eyebrow="Explore More"
        />

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="https://github.com/aka75035/IndoWikipedia"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border px-5 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            GitHub Repository
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-16 border-t pt-10">
        <h2 className="text-xl font-semibold">
          Independence and Disclaimer
        </h2>

        <p className="mt-4 leading-7 text-gray-500">
          IndoWikipedia is an independent project and is not affiliated
          with, sponsored by, or operated by the Wikimedia Foundation or
          Wikipedia.
        </p>

        <p className="mt-4 leading-7 text-gray-500">
          The project is currently under active development. Its content,
          features, policies, and technical implementation may change as
          the project evolves.
        </p>
      </section>

      {/* Closing */}
      <section className="mt-16 border-t pt-10 pb-8 text-center">
        <h2 className="text-2xl font-semibold">
          IndoWikipedia is still being built.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-500">
          What exists today is only the beginning. The goal is to continue
          improving the platform, expanding its knowledge base, and
          creating a better way to discover and share knowledge about
          India.
        </p>
      </section>
    </main>
  );
}

function SectionTitle({ eyebrow, title }:{ eyebrow: string, title: string }) {
  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-widest text-gray-400">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function FeatureCard({ title, description }:{ title: string; description: string; }) {
  return (
    <div className="rounded-2xl border p-6">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function TechCard({ name, description }:{ name: string; description: string; }) {
  return (
    <div className="rounded-2xl border p-6">
      <h3 className="text-lg font-semibold">{name}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function TimelineItem({ number, title, description }:{ number: string; title: string; description: string; }) {
  return (
    <div className="flex gap-5 border-b py-6 last:border-b-0">
      <span className="text-sm font-semibold text-gray-400">
        {number}
      </span>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}



type RoadmapStatus = "Completed" | "In Progress" | "Planned";

function RoadmapItem({
  status,
  title,
}: {
  status: RoadmapStatus;
  title: string;
}) {
  const statusStyles: Record<RoadmapStatus, string> = {
    Completed: "bg-green-50 text-green-700",
    "In Progress": "bg-yellow-50 text-yellow-700",
    Planned: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <span className="font-medium">{title}</span>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
          statusStyles[status]
        }`}
      >
        {status}
      </span>
    </div>
  );
}