import { Orden } from "./ordenes.interface";

export interface Produccion {
  id: number;
  ordenPedido: Orden;
  fechaIngreso: string;
  fechaFinalizacion: string;
  lineaProduccion: boolean;
  estadoProduccion: boolean;
}
