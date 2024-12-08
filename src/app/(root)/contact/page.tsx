import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

const ContactPage = () => {
  return (
    <main className="px-4 md:px-6 lg:px-12 xl:px-24 my-20">
      <h1>Contact Us</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, autem
        possimus harum voluptatibus saepe neque, totam molestias quae porro
        reprehenderit accusantium necessitatibus natus non nesciunt pariatur
        quas! Dolores, minima exercitationem.
      </p>
    </main>
  );
};

export default ContactPage;
