import { TipoDeMovimientoGasto } from "./general";

export type ResultadoAPI = {
  errores: string[];
  exitoso: boolean;
};

export type ResultadoAPICrear = ResultadoAPI & {
  idsCreados: string[];
};

export type MovimientoPayload = {
  id?: string;
  comentarios?: string;
  fecha: Date;
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
  tipoDeGasto?: TipoDeMovimientoGasto;
  monto: number;
};

export interface PersistirMovimientoGasto {
  added?: ResultadoAPICrear;
  updated?: ResultadoAPI[];
  deleted?: ResultadoAPI;
}
