import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

const AboutPage = () => {
  return (
    <div className="px-4 md:px-6 lg:px-12 xl:px-24 my-20">
      Own-Closet is a Jaipur-based clothing e-commerce brand that celebrates
      stylish and high-quality fashion. Rooted in India&apos;s vibrant culture,
      it offers a unique collection of apparel designed to elevate everyday
      wardrobes. With a commitment to excellent craftsmanship and customer
      satisfaction, the brand ensures a seamless shopping experience. Own-Closet
      aims to bring the charm of Jaipur&apos;s heritage into contemporary
      fashion. It&apos;s your go-to destination for versatile, trendy, and
      timeless clothing.
    </div>
  );
};

export default AboutPage;
