// app/compound/page.jsx
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import CardNavig from "../../components/compoundPage/CardNavig";

export default function CompoundPage({ searchParams }) {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="px-3 pt-3 flex flex-col gap-3">
        <Header />
        <CardNavig />
      </div>
      <Footer />
    </div>
  );
}
