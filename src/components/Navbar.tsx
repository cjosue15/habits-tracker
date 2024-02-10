import Container from "./Container";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-500/50">
      <Container>
        <div className="h-[80px] flex items-center">
          <h2 className="text-xl">Habits tracker</h2>
        </div>
      </Container>
    </nav>
  );
}
