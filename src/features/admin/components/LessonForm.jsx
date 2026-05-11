import {
  CheckboxInput,
  SelectInput,
  SubmitButton,
  TextareaInput,
  TextInput,
} from "@/shared/components/forms";

export default function LessonForm({
  formData,
  courses = [],
  onChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save lesson",
}) {
  const courseOptions = courses.map((course) => ({
    label: course.title,
    value: course.id,
  }));

  const handleCheckboxChange = (event) => {
    onChange({
      target: {
        name: event.target.name,
        value: event.target.checked,
      },
    });
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

        <TextareaInput
          label="Markdown content"
          name="content"
          value={formData.content}
          onChange={onChange}
          placeholder={`# Lesson title

Write your lesson content here.

## Example

\`\`\`html
<h1>Hello World</h1>
\`\`\`
`}
          rows={16}
          required
        />

        <CheckboxInput
          label="Publish lesson"
          name="published"
          checked={formData.published}
          onChange={handleCheckboxChange}
          helpText="Published lessons are visible on the public lesson page."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <SubmitButton loading={isSubmitting}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}