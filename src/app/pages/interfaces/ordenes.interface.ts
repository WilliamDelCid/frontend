import { Inventario } from "./inventario.interface";


export interface Orden {
  id: number;
  cliente: Cliente;
  fechaEsperada: string;
  cantidadProducto: number;
  estadoOrden: number;
  inventario: Inventario;
}

export interface Cliente {
  id: number;
  nombreCliente: string;
}
