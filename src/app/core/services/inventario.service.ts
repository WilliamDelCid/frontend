import { Injectable } from '@angular/core';
import { RequestResponse } from '../models/IRequest';
import { Inventario, TipoProducto, Unidad } from '../../pages/interfaces/inventario.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private url = environment.urlAPI + 'inventarios';
  private urlUnidad = environment.urlAPI + 'unidad';
  private urlTipoProducto = environment.urlAPI + 'tipos-producto';

  isLoading = false;

  listInventario: RequestResponse<Inventario> = {
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
  listUnidad: Unidad[] = [];
  listTipoProducto: TipoProducto[] = [];

  constructor(private inventarioService: HttpClient) {}

  getPages(page: number = 0, size: number = 10,nombreProducto: string = '') {
    this.isLoading = true;
    return this.inventarioService
      .get<RequestResponse<Inventario>>(this.url , {
        params: {
          page: page.toString(),
          size: size.toString(),
          nombreProducto: nombreProducto
        },
      })
      .subscribe((data) => {
        this.listInventario = data;
        this.isLoading = false;
      });
  }

  getUnidad() {
    return this.inventarioService.get<Unidad[]>(`${this.urlUnidad}`).subscribe((resp) => {
      this.listUnidad = resp;
    });
  }

  getTipoProducto() {
    return this.inventarioService.get<TipoProducto[]>(`${this.urlTipoProducto}`).subscribe((resp) => {
      this.listTipoProducto = resp;
    });
  }

  crear(inventario: FormGroup) {
    return this.inventarioService.post(`${this.url}`, inventario);
  }

  actualizar(idInventario: number, inventario: FormGroup) {
    return this.inventarioService.put(`${this.url}/${idInventario}`, inventario);
  }

  eliminar(idInventario: number) {
    return this.inventarioService.delete(`${this.url}/${idInventario}`);
  }

  buscar(idInventario: number) {
    return this.inventarioService.get<Inventario>(`${this.url}/${idInventario}`);
  }

  pdf(event:any): Observable<Blob> {
    return this.inventarioService.get(this.url + '/generar-pdf/'+event, { responseType: 'blob' });
  }

}
