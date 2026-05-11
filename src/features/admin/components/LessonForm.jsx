import { useState } from "react";
import { Eye, Pencil } from "lucide-react";

import {
    CheckboxInput,
    SelectInput,
    SubmitButton,
    TextareaInput,
    TextInput,
} from "@/shared/components/forms";

import MarkdownRenderer from "@/features/lessons/components/MarkdownRenderer";

const LESSON_TEMPLATE = `# Lesson Title

Start with a short explanation of what this lesson is about.

## What you will learn

By the end of this lesson, you should understand:

- Point one
- Point two
- Point three

## Main concept

Explain the main idea here in simple language.

Try to explain not just **what** something is, but also **why** it matters.

## Example

\`\`\`html
<h1>Hello World</h1>
<p>This is an example.</p>
\`\`\`

## Explanation

Break down the example step by step:

1. Explain the first important part.
2. Explain the second important part.
3. Explain what the student should notice.

## Common mistake

> Mention a common beginner mistake here and explain how to avoid it.

## Quick practice

Try doing this yourself:

- Task one
- Task two
- Task three

## Summary

In this lesson, you learned:

- Key takeaway one
- Key takeaway two
- Key takeaway three
`;

export default function LessonForm({
    formData,
    courses = [],
    onChange,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Save lesson",
}) {
    const [contentMode, setContentMode] = useState("write");

    const courseOptions = courses.map(course => ({
        label: course.title,
        value: course.id,
    }));

    const handleCheckboxChange = event => {
        onChange({
            target: {
                name: event.target.name,
                value: event.target.checked,
            },
        });
    };

    const handleInsertTemplate = () => {
        const shouldReplace =
            !formData.content.trim() ||
            window.confirm(
                "This will replace your current lesson content with the template. Continue?",
            );

        if (!shouldReplace) return;

        onChange({
            target: {
                name: "content",
                value: LESSON_TEMPLATE,
            },
        });

        setContentMode("write");
    };

    return (
        <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-6"
        >
            <div className="grid gap-5">
                <SelectInput
                    label="Course"
                    name="courseId"
                    value={formData.courseId}
                    onChange={onChange}
                    options={courseOptions}
                    helpText="Choose the course this lesson belongs to."
                    required
                />

                <TextInput
                    label="Lesson title"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="What is HTML?"
                    required
                />

                <TextInput
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={onChange}
                    placeholder="what-is-html"
                    helpText="This controls the lesson URL."
                    required
                />

                <TextareaInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={onChange}
                    placeholder="Briefly explain what this lesson teaches."
                    rows={3}
                    required
                />

                <TextInput
                    label="Order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={onChange}
                    placeholder="1"
                    helpText="Lower numbers appear first in the course."
                    required
                />

                <div>
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="block text-sm font-medium">
                            Markdown content{" "}
                            <span className="text-destructive">*</span>
                        </label>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={handleInsertTemplate}
                                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                Insert template
                            </button>

                            <div className="inline-flex rounded-lg border border-border bg-background p-1">
                                <button
                                    type="button"
                                    onClick={() => setContentMode("write")}
                                    className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${
                                        contentMode === "write"
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Write
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setContentMode("preview")}
                                    className={`inline-flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${
                                        contentMode === "preview"
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    Preview
                                </button>
                            </div>
                        </div>
                    </div>

                    {contentMode === "write" ? (
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={onChange}
                            rows={18}
                            required
                            placeholder={`# Lesson title

Write your lesson content here.

## Example

\`\`\`html
<h1>Hello World</h1>
\`\`\`
`}
                            className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 font-mono text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    ) : (
                        <div className="min-h-[420px] rounded-lg border border-border bg-background p-5">
                            {formData.content.trim() ? (
                                <MarkdownRenderer content={formData.content} />
                            ) : (
                                <div className="flex min-h-[320px] items-center justify-center text-center">
                                    <div>
                                        <p className="font-medium">
                                            Nothing to preview yet
                                        </p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Write some markdown content first,
                                            then switch back to preview.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-muted-foreground">
                        You can use headings, lists, links, inline code, and
                        fenced code blocks.
                    </p>
                </div>

                <CheckboxInput
                    label="Publish lesson"
                    name="published"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    helpText="Published lessons are visible on the public lesson page."
                />
            </div>

            <div className="mt-6 flex justify-end">
                <SubmitButton loading={isSubmitting}>
                    {submitLabel}
                </SubmitButton>
            </div>
        </form>
    );
}
