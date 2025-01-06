import React from "react";

const TweetHeader = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold rainbow-text">Tweet Generator</h1>
      <p className="text-muted-foreground">
        Konuyu girin, yapay zeka sizin için tweet oluştursun
      </p>
    </div>
  );
};

export default TweetHeader;