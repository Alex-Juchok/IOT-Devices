// lib/WidgetRegistry.js
import { createContext, useContext } from "react";

const WidgetRegistryContext = createContext([]);

export const useWidgets = () => useContext(WidgetRegistryContext);

export const WidgetRegistryProvider = ({ children, widgets }) => (
  <WidgetRegistryContext.Provider value={widgets}>
    {children}
  </WidgetRegistryContext.Provider>
);
