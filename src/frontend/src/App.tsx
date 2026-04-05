import { Toaster } from "@/components/ui/sonner";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import TechStack from "./components/TechStack";
import VideoGallery from "./components/VideoGallery";

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#1a1a1a", color: "#e5e5e5" }}
    >
      <Nav />
      <main>
        <Hero />
        <VideoGallery />
        <TechStack />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#2d2d2d",
            border: "1px solid #3d3d3d",
            color: "#e5e5e5",
          },
        }}
      />
    </div>
  );
}
