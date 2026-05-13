import { Star } from "lucide-react";
import { getTestimonials } from "@/lib/catalog";

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Testimonials
        </p>
        <h2 className="mt-2 font-serif text-3xl text-textPrimary md:text-4xl">
          Quiet confidence from every interaction
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial._id}
            className="rounded-md border border-borderSoft bg-white p-6 shadow-subtle"
          >
            <div className="mb-4 flex gap-1">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-cta text-cta" />
              ))}
            </div>
            <blockquote className="font-serif text-base italic leading-7 text-textSecondary">
              "{testimonial.text}"
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-textPrimary">
              {testimonial.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
