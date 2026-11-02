import About from "./components/About";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Hud from "./components/Hud";
import Journey from "./components/Journey";
import Projects from "./components/Projects";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

function App() {
  useSmoothScroll();

  return (
    <>
      <Cursor />
      <Hud />
      <main>
        <Hero />
        <About />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
