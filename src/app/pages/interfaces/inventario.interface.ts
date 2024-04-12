export interface Inventario {
  id: number;
  nombreProducto: string;
  descripcion: string;
  producto: boolean;
  unidad: Unidad;
  cantidadProducto: number;
  estadoProducto: boolean;
  tipoProducto: TipoProducto;
}

export interface Unidad {
  id: number;
  nombreUnidad:string;
}

export interface TipoProducto {
  id: number;
  nombreTipo:string;
}
