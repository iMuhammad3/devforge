import {
  CheckboxInput,
  SelectInput,
  SubmitButton,
  TextareaInput,
  TextInput,
} from "@/shared/components/forms";

const CATEGORY_OPTIONS = [
  { label: "Programming Language", value: "Language" },
  { label: "Data Structures", value: "Data Structures" },
  { label: "Algorithms", value: "Algorithms" },
];

const LEVEL_OPTIONS = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export default function CourseForm({
  formData,
  errors = {},
  onChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save course",
}) {
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
        <TextInput
          label="Course title"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="C Programming for Beginners"
          error={errors.title}
          required
        />

        <TextInput
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={onChange}
          placeholder="c-programming-for-beginners"
          helpText="This controls the course URL. Keep it lowercase and readable."
          error={errors.slug}
          required
        />

        <TextareaInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Briefly explain what students will learn."
          rows={4}
          error={errors.description}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectInput
            label="Category"
            name="category"
            value={formData.category}
            onChange={onChange}
            options={CATEGORY_OPTIONS}
            required
          />

          <SelectInput
            label="Level"
            name="level"
            value={formData.level}
            onChange={onChange}
            options={LEVEL_OPTIONS}
            required
          />
        </div>

        <TextInput
          label="Order"
          name="order"
          type="number"
          value={formData.order}
          onChange={onChange}
          placeholder="1"
          helpText="Lower numbers appear first."
          error={errors.order}
          required
        />

        <CheckboxInput
          label="Publish course"
          name="published"
          checked={formData.published}
          onChange={handleCheckboxChange}
          helpText="Published courses are visible on the public courses page."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <SubmitButton loading={isSubmitting}>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}