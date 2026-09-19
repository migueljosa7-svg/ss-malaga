import type { Hermandad } from "@/types/hermandad";
import { hermandadesBatch1 } from "./hermandades-1";
import { hermandadesBatch2 } from "./hermandades-2";
import { hermandadesBatch3 } from "./hermandades-3";
import { hermandadesBatch4 } from "./hermandades-4";
import { hermandadesBatch5 } from "./hermandades-5";
import { hermandadesBatch6 } from "./hermandades-6";

/** Base de datos completa: 13 hermandades emblemáticas de la Semana Santa de Sevilla. */
export const hermandadesMock: Hermandad[] = [
  ...hermandadesBatch1,
  ...hermandadesBatch2,
  ...hermandadesBatch3,
  ...hermandadesBatch4,
  ...hermandadesBatch5,
  ...hermandadesBatch6,
];
