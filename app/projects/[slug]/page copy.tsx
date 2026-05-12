import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Mouse, ExternalLink, ArrowLeft, Terminal, Rocket, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata({ params }: { params: { slug: string } }) {
 
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} | John Edeh`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { order: "asc" } },
      stack: { orderBy: { category: "asc" } },
      highlights: { orderBy: { order: "asc" } },
    },
  });

  if (!project || !project.published) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-bg">
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-syne font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <StatusBadge status={project.status} className="mb-2" />
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-syne font-extrabold tracking-tighter text-text">
                  {project.name}
                </h1>
                <p className="text-xl md:text-2xl text-muted font-lora leading-relaxed italic">
                  {project.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 px-6 rounded-xl bg-surface border border-border flex items-center gap-3 font-syne font-bold uppercase tracking-widest text-xs hover:bg-surface-2 transition-all"
                  >
                    <Mouse className="w-5 h-5" /> Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 px-6 rounded-xl bg-accent text-white flex items-center gap-3 font-syne font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                  >
                    <ExternalLink className="w-5 h-5" /> Visit Site
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="mb-20">
            <ImageGallery images={project.images} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Highlights */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-syne font-bold text-text uppercase tracking-tight">
                    Key Technical Highlights
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {project.highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className="p-6 rounded-2xl bg-surface border border-border flex gap-4 group hover:border-accent/30 transition-all"
                    >
                      <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-text font-lora leading-relaxed">
                        {highlight.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Case Study Body */}
              <section className="space-y-8 prose prose-invert max-w-none prose-h2:font-syne prose-h2:text-3xl prose-h2:tracking-tight prose-p:font-lora prose-p:text-lg prose-p:text-muted prose-p:leading-relaxed prose-strong:text-text prose-li:text-muted">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-syne font-bold text-text uppercase tracking-tight m-0">
                    The Case Study
                  </h2>
                </div>
                <ReactMarkdown>{project.caseStudy}</ReactMarkdown>
              </section>
            </div>

            {/* Sidebar: Tech Stack */}
            <aside className="space-y-12">
              <div className="p-8 rounded-3xl bg-surface border border-border sticky top-32">
                <h3 className="text-xl font-syne font-bold text-text uppercase tracking-tight mb-8">
                  Project Stack
                </h3>
                
                <div className="space-y-8">
                  {/* Categorized Stack */}
                  {Array.from(new Set(project.stack.map(s => s.category))).map(cat => (
                    <div key={cat}>
                      <h4 className="text-[10px] font-mono text-dim uppercase tracking-[0.2em] mb-4">
                        {cat}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.stack
                          .filter(s => s.category === cat)
                          .map(item => (
                            <span
                              key={item.id}
                              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-sm font-lora text-text"
                            >
                              {item.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-12 border-t border-border">
                  <h4 className="text-[10px] font-mono text-dim uppercase tracking-[0.2em] mb-4">
                    Project Category
                  </h4>
                  <span className="text-xl font-syne font-bold text-accent">
                    {project.category}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
