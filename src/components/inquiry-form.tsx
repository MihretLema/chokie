"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Info } from "lucide-react";
import { services, training } from "@/lib/content";
import { Button } from "./ui/button";
const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => !v || /^[+\d\s().-]{7,25}$/.test(v),
      "Enter a valid phone number.",
    ),
  organization: z.string().max(150),
  category: z.string().min(1, "Choose an option."),
  subject: z.string().max(200),
  message: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters.")
    .max(5000),
  priority: z.string(),
});
type Fields = z.infer<typeof schema>;
export function InquiryForm({
  mode = "contact",
}: {
  mode?: "contact" | "training" | "support";
}) {
  const [validated, setValidated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(
      schema.superRefine((data, ctx) => {
        if (mode === "support" && data.subject.trim().length < 3)
          ctx.addIssue({
            code: "custom",
            path: ["subject"],
            message: "Enter an issue subject (at least 3 characters).",
          });
      }),
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      category: "",
      subject: "",
      message: "",
      priority: "Normal",
    },
  });
  const id = mode;
  function field(
    name: keyof Fields,
    label: string,
    type = "text",
    required = false,
  ) {
    return (
      <div className="form-field">
        <label htmlFor={id + name}>
          {label}
          {required ? " *" : ""}
        </label>
        <input
          id={id + name}
          type={type}
          {...register(name)}
          required={required}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? id + name + "error" : undefined}
        />
        {errors[name] && (
          <span className="error" id={id + name + "error"}>
            {errors[name]?.message}
          </span>
        )}
      </div>
    );
  }
  return (
    <form
      className="inquiry-form"
      noValidate
      onChange={() => setValidated(false)}
      onSubmit={handleSubmit(() => setValidated(true))}
    >
      <div className="form-notice">
        <Info size={20} />
        <p>
          Frontend preview: submissions will be connected in Phase 4. No
          information is sent or saved.
        </p>
      </div>
      <div className="form-grid">
        {field("name", "Full Name", "text", true)}
        {field("email", "Email", "email", true)}
        {field("phone", "Phone Number", "tel")}
        {mode !== "support" && field("organization", "Organization")}
        <div className="form-field">
          <label htmlFor={id + "category"}>
            {mode === "training"
              ? "Training Program"
              : mode === "support"
                ? "Service Category"
                : "Interested Service"}{" "}
            *
          </label>
          <select
            id={id + "category"}
            {...register("category")}
            required
            aria-invalid={!!errors.category}
            aria-describedby={
              errors.category ? id + "category-error" : undefined
            }
          >
            <option value="">Select an option</option>
            {(mode === "training"
              ? training.map((t) => t.title)
              : services.map((s) => s.title)
            ).map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option>General inquiry</option>
          </select>
          {errors.category && (
            <span className="error" id={id + "category-error"}>
              {errors.category.message}
            </span>
          )}
        </div>
        {mode === "support" && (
          <>
            {field("subject", "Issue Subject", "text", true)}
            <div className="form-field">
              <label htmlFor={id + "priority"}>Priority</label>
              <select id={id + "priority"} {...register("priority")}>
                {["Low", "Normal", "High", "Critical"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      <div className="form-field">
        <label htmlFor={id + "message"}>
          {mode === "support" ? "Issue Description" : "Message"} *
        </label>
        <textarea
          id={id + "message"}
          rows={5}
          {...register("message")}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? id + "message-error" : undefined}
        />
        {errors.message && (
          <span className="error" id={id + "message-error"}>
            {errors.message.message}
          </span>
        )}
      </div>
      <Button disabled={isSubmitting} type="submit">
        Validate {mode === "support" ? "Ticket" : "Inquiry"}{" "}
        <ArrowUpRight size={17} />
      </Button>
      {validated && (
        <p className="validation-result" role="status">
          Your details pass validation. This is a preview only;{" "}
          {mode === "support"
            ? "no ticket has been created"
            : "your inquiry has not been sent"}
          .
        </p>
      )}
    </form>
  );
}
