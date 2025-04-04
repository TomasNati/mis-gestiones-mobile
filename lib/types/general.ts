interface Categoria {
  id: number;
  nombre: string;
}

type TipoDeGasto = "Fijo" | "Variable";

export interface Subcategoria {
  id: number;
  nombre: string;
  categoria: Categoria;
  tipoDeGasto: TipoDeGasto;
}

export enum TipoDeMovimientoGasto {
  Credito = "Credito",
  Debito = "Debito",
  Efectivo = "Efectivo",
}

export type CategoriaUIMovimiento = {
  id: string;
  nombre: string;
  categoriaNombre: string;
  subcategoriaId: string;
  detalleSubcategoriaId?: string;
};

export type MovimientoGastoGrilla = {
  id: string;
  comentarios?: string;
  fecha: Date;
  categoria: string;
  concepto: CategoriaUIMovimiento;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
  isNew?: boolean;
};
