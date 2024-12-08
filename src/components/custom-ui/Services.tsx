import { servicesLinks } from "@/lib/constants";

const Services = () => {
  return (
    <section className="px-4 md:px-6 lg:px-12 xl:px-24 pb-8 bg-landingPage-primary py-12 rounded-lg">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {servicesLinks.map((link) => (
          <div
            key={link.label}
            className="p-6 bg-landingPage-secondary rounded-lg hover:bg-landingPage-accent hover:shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="rounded-lg p-4 bg-landingPage-primary w-max">
              <p className="text-landingPage-accent text-2xl">{link.icon}</p>
            </div>
            <h4 className="font-semibold my-4 font-serif text-landingPage-accent">
              {link.label}
            </h4>
            <p className="text-landingPage-secondary text-sm leading-relaxed">
              {link.details}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
