interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold rainbow-text">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
        {description}
      </p>
    </div>
  );
};

export default Header;