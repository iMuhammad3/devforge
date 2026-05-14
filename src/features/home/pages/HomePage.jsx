import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Code2, Layers, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import ContinueLearningCard from "@/features/dashboard/components/ContinueLearningCard";

export default function HomePage() {
    const user = useAuthStore(state => state.user);
    const profile = useAuthStore(state => state.profile);
    return (
        <div className="bg-background text-foreground">
            {/* Hero */}
            <section className="border-b border-border">
                <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Frontend learning, built properly.
                    </div>

                    <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
                        Learn frontend development through clean, practical
                        lessons.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                        DevForge helps you learn HTML, CSS, JavaScript, React,
                        Tailwind, and modern frontend architecture with
                        beginner-friendly explanations and real-world examples.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to={user ? "/dashboard" : "/courses"}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            {user ? "Go to dashboard" : "Browse courses"}
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            to="/courses"
                            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium transition hover:bg-muted"
                        >
                            View courses
                        </Link>
                    </div>
                </div>
            </section>

            {user && (
                <section className="border-b border-border px-6 py-12">
                    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Welcome back
                            </p>

                            <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                Continue building your frontend skills
                                {profile?.displayName
                                    ? `, ${profile.displayName}`
                                    : ""}
                                .
                            </h2>

                            <p className="mt-4 leading-7 text-muted-foreground">
                                Jump back into your most recent course, review
                                completed lessons, or browse more frontend
                                topics when you’re ready.
                            </p>

                            <Link
                                to="/dashboard"
                                className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:bg-muted"
                            >
                                Open dashboard
                            </Link>
                        </div>

                        <ContinueLearningCard />
                    </div>
                </section>
            )}

            {/* Learning Tracks */}
            <section className="border-b border-border px-6 py-20">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 max-w-2xl">
                        <p className="text-sm font-medium text-primary">
                            Learning tracks
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Start with the frontend fundamentals.
                        </h2>

                        <p className="mt-4 text-muted-foreground">
                            The platform begins with the core technologies every
                            frontend developer needs before moving into more
                            advanced React patterns.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        <FeatureCard
                            icon={<BookOpen className="h-5 w-5" />}
                            title="HTML & Semantics"
                            description="Learn how to structure pages properly using semantic, accessible HTML."
                        />

                        <FeatureCard
                            icon={<Layers className="h-5 w-5" />}
                            title="CSS & Layouts"
                            description="Master styling, spacing, responsive layouts, Flexbox, Grid, and modern CSS."
                        />

                        <FeatureCard
                            icon={<Code2 className="h-5 w-5" />}
                            title="JavaScript & React"
                            description="Build interactive interfaces using JavaScript, components, hooks, and routing."
                        />
                    </div>
                </div>
            </section>

            {/* Why */}
            <section id="why" className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Why DevForge?
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight">
                            Built for people who want to understand, not just
                            copy code.
                        </h2>

                        <p className="mt-4 leading-7 text-muted-foreground">
                            Many tutorials show you what to type. DevForge is
                            designed to explain how frontend concepts work, why
                            they matter, and how to use them in real projects.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <ReasonItem
                            title="Frontend-focused"
                            description="No scattered topics. The platform starts with frontend development and goes deep."
                        />

                        <ReasonItem
                            title="Practical examples"
                            description="Lessons are designed around examples you can actually use when building websites and apps."
                        />

                        <ReasonItem
                            title="Clean learning experience"
                            description="Readable lessons, organized courses, dark mode support, and a modern interface."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border px-6 py-20">
                <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-8 text-center md:p-12">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Start learning frontend the right way.
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                        Begin with beginner-friendly courses and gradually work
                        your way toward building polished, real-world frontend
                        projects.
                    </p>

                    <Link
                        to="/courses"
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        View courses
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>

            <h3 className="font-semibold">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

function ReasonItem({ title, description }) {
    return (
        <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold">{title}</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>
        </div>
    );
}
