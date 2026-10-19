import "@testing-library/jest-dom/vitest";   // adds checks like toBeInTheDocument()
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup());   // wipe the fake screen after each test