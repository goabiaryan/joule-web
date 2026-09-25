import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_ID = "G-20G80ZMSPG";

export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    const pageLocation = `${window.location.origin}${path}${location.hash}`;

    if (typeof window.gtag !== "function") return;

    window.gtag("config", GA_ID, {
      page_path: path,
      page_location: pageLocation,
      page_title: document.title,
      send_page_view: true,
    });
  }, [location]);

  return null;
}
