export default function Card({ className = "", children }) {
  return <div className={`card p-4 ${className}`}>{children}</div>;
}
