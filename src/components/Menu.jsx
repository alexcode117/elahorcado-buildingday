import "./Menu.css";
import Button from "./ui/Button";
import Card from "./ui/Card";

const Menu = ({ onNewGame, onOpenAuth, user }) => {
  return (
    <div className="menu">
      <Card className="menu-card">
        <header className="menu-header">
          <div className="menu-logo">H</div>
          <div>
            <h1 className="menu-title">El Ahorcado</h1>
            <p className="menu-subtitle">Edición: Pokémon • 1ª generación</p>
          </div>
        </header>

        <div className="menu-actions">
          <Button className="menu-btn" variant={"primary"} onClick={onNewGame}>
            Nueva partida
          </Button>
          <Button className="menu-btn" variant={"ghost"} onClick={onOpenAuth}>
            Autenticación / Info
          </Button>
        </div>

        <footer className="menu-footer">
          <small className="muted">Hecho con ❤️ • Demo Building Day</small>
        </footer>
      </Card>
    </div>
  );
};

export default Menu;
