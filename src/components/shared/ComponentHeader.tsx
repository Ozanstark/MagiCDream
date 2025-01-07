interface ComponentHeaderProps {
  title: string;
  description: string;
}

const ComponentHeader = ({ title, description }: ComponentHeaderProps) => {
  return (
    <div className="text-center space-y-4 sm:space-y-6 mb-8">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
        <span className="rainbow-text">{title}</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 border border-primary/20 py-2 sm:py-3 rounded-lg bg-card/50 backdrop-blur-sm">
        {description}
      </p>
    </div>
  );
};

export default ComponentHeader;