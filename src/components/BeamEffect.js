import React from "react";
import { BackgroundBeamsWithCollision } from "@aceternity-ui/components";

const BeamEffect = ({ children }) => {
  return (
    <BackgroundBeamsWithCollision>
      <div className="relative z-10">
        {children}
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default BeamEffect;
