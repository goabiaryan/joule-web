import { useScrollReveal } from "../hooks/useScrollReveal.js";

export default function ScrollReveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  style,
  children,
  ...rest
}) {
  const ref = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={["scroll-reveal", className].filter(Boolean).join(" ")}
      style={{ ...style, "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
