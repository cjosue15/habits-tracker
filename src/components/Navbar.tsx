import Container from "./Container";
import { TreeIcon } from "./icons";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-500/50">
      <Container>
        <div className="h-[80px] flex items-center">
          <TreeIcon />

          <h2 className="text-xl font-bold ml-4">Habits tracker</h2>
        </div>
      </Container>
    </nav>
  );
}
