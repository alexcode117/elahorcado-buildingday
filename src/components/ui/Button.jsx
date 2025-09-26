import "./Button.css";
export const Button = ({ variant, className = "", children, ...props }) => {
  let buttonClass = "";

  // Por defecto usamos la clase base de botones
  buttonClass = "btn";
  if (variant === "primary") buttonClass += " primary";
  else if (variant === "ghost") buttonClass += " ghost";

  if (className) {
    buttonClass += ` ${className}`;
  }

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
