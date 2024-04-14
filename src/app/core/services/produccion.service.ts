import { Injectable } from '@angular/core';
import { RequestResponse } from '../models/IRequest';
import { Inventario, TipoProducto, Unidad } from '../../pages/interfaces/inventario.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Cliente, Orden } from '../../pages/interfaces/ordenes.interface';
import { Produccion } from '../../pages/interfaces/produccion.interface';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private url = environment.urlAPI + 'produccion';
  private urlOrdenes = environment.urlAPI + 'ordenes';

  isLoading = false;

  listProduccion: RequestResponse<Produccion> = {
    content: [],
    pageable: {
      offset: 0,
      paged: true,
      pageNumber: 0,
      pageSize: 0,
      sort: {
        empty: true,
        sorted: true,
        unsorted: true,
      },
      unpaged: true,
    },
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: 0,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true,
    },
    totalElements: 0,
    totalPages: 0,
  };

  listOrdenes: Orden[] = [];
  constructor(private produccionService: HttpClient) {}

  getPages(page: number = 0, size: number = 10,nombreProducto: string = '') {
    this.isLoading = true;
    return this.produccionService
      .get<RequestResponse<Produccion>>(this.url + '/listar', {
        params: {
          page: page.toString(),
          size: size.toString(),
        },
      })
      .subscribe((data) => {
        this.listProduccion = data;
        this.isLoading = false;
      });
  }

  getOrdenes() {
    return this.produccionService.get<Orden[]>(`${this.urlOrdenes}/listar-all`).subscribe((resp) => {
      this.listOrdenes = resp;
    });
  }

  crear(produccion: FormGroup) {
    return this.produccionService.post(`${this.url}/guardar`, produccion);
  }
  finalizar(idOrden:number,produccion: FormGroup) {
    return this.produccionService.put(`${this.url}/${idOrden}/finalizar`, produccion);
  }


}
