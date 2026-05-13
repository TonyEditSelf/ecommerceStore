export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-textPrimary">Let the storefront feel reachable</h1>
        <p className="mt-6 text-base leading-8 text-textSecondary">
          A clean contact page UI prepared for message handling once backend services are introduced.
        </p>
      </section>
      <form className="rounded-md border border-borderSoft bg-card p-6 shadow-soft">
        <input className="w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="Name" />
        <input className="mt-4 w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="Email" />
        <textarea className="mt-4 min-h-36 w-full rounded-md border border-borderSoft bg-white px-4 py-3 outline-none focus:border-primary" placeholder="Message" />
        <button className="mt-5 rounded-md bg-cta px-5 py-3 text-sm font-semibold text-textPrimary hover:bg-ctaHover">Send message UI</button>
      </form>
    </div>
  );
}
