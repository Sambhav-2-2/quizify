"use client";
import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ThemeProvider(props) {
  return <NextThemesProvider {...props}>{props.children}</NextThemesProvider>;
}
