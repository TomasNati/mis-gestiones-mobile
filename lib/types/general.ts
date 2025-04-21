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

export type CategoriaUIMovimientoGroup = {
  group: string;
  categorias: CategoriaUIMovimiento[];
};

export type EstadoUIEntidad = "deleted" | "updated" | "added";

interface EntidadConEstado {
  state?: EstadoUIEntidad;
}

export interface MovimientoGastoGrilla extends EntidadConEstado {
  id: string;
  comentarios?: string;
  fecha: Date;
  categoria: string;
  concepto: CategoriaUIMovimiento;
  tipoDeGasto: TipoDeMovimientoGasto;
  monto: number;
}

export interface MovimientoAEditar {
  concepto: CategoriaUIMovimiento;
  monto: string;
  tipoDePago: TipoDeMovimientoGasto;
  comentarios: string;
  dia: number;
}

export type TipoEventoSuenio = "Despierto" | "Dormido";

export interface EventoSuenio {
  id: string;
  hora: string;
  comentarios?: string;
  tipo: TipoEventoSuenio;
  tipoDeActualizacion?: "nuevo" | "modificado" | "eliminado";
}

export interface AgendaTomiDia extends EntidadConEstado {
  id: string;
  fecha: Date;
  comentarios?: string;
  eventos: EventoSuenio[];
  esNuevo?: boolean;
}
