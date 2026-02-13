import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RESOURCE_POSTS } from "../content/resources";

export default function Resources() {
  const [query, setQuery] = useState("");

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = RESOURCE_POSTS.slice().sort((a, b) =>
      (b.date || "").localeCompare(a.date || ""),
    );
    if (!q) return list;
    return list.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <main className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <h1 className="mb-4 font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl font-bold">
            Resources
          </h1>
          <p className="max-w-2xl text-lg text-foreground/70">
            Marketing guides, how-to’s and playbooks — written to be practical,
            not fluffy.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className="w-full sm:max-w-md rounded-design border border-black bg-white px-4 py-3 focus:outline-none"
          />
          <Link
            to="/pricing"
            className="text-sm underline text-foreground/80 hover:text-foreground"
          >
            View pricing →
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/resources/${post.slug}`}
              className="group relative block p-6 sm:p-8 rounded-design border border-black transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
              style={{
                backgroundColor: post.bgColor,
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-text-dark" />
              </div>

              <div className="pr-8">
                <h2 className="mb-4 font-['Fraunces'] text-xl sm:text-2xl text-text-dark">
                  {post.title}
                </h2>
                <p className="text-text-dark/80 leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-5 flex items-center gap-3 text-sm text-text-dark/90">
                  {post.readingTime ? <span>{post.readingTime}</span> : null}
                  {post.date ? (
                    <>
                      <span className="opacity-60">•</span>
                      <span className="opacity-80">
                        {new Date(post.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </section>

        {posts.length === 0 && (
          <div className="mt-10 rounded-design border border-black bg-white p-6">
            No resources found. Try a different search.
          </div>
        )}
      </div>
    </main>
  );
}
