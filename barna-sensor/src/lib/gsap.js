import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Avoid jumpy refreshes when mobile browser toolbars show/hide.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
