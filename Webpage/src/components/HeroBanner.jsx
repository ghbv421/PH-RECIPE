import img1 from "../assets/images/beefpares.svg";
import img2 from "../assets/images/chickenadobo.svg";
import img3 from "../assets/images/bulalo.svg";
import img4 from "../assets/images/friedchicken.svg";
import img5 from "../assets/images/porkadobo.svg";

export default function HeroBanner() {
  const thumbs = [img1, img2, img3, img4, img5];

  return (
    <section className="hero">

      <img
        src="https://images.unsplash.com/photo-1603133872878-684f208fb84b"
        alt="Fried Rice"
      />

      <h1>Fried Rice</h1>

      <div className="top-list-wrap">
        <div className="top-list-label">Hot Top 5 list</div>
        <div className="top-list">
          {thumbs.map((src, i) => (
            <img key={i} src={src} alt={`Top ${i + 1}`} />
          ))}
        </div>
      </div>

    </section>
  );
}
