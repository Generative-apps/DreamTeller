import React, { useEffect, useMemo, useState } from "react";
export type question = {
  title: string;
  description: string;
};

type WindowsSize = {
  width: number;
  height: number;
};

export function UseWindowSize(): WindowsSize {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const setSize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", setSize);

    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [screenSize]);

  return screenSize;
}

export function useIsMobile() {
  const { width } = UseWindowSize();
  return width < 600;
}

export type Children = React.ReactNode | React.ReactNodeArray;
