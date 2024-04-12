import { Injectable } from '@angular/core';
import { RequestResponse } from '../models/IRequest';
import { Inventario } from '../../pages/interfaces/inventario.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private url = environment.urlAPI + 'inventarios';

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
  constructor(private inventarioService: HttpClient) {}

  getPages(page: number = 0, size: number = 1) {
    this.isLoading = true;
    return this.inventarioService
      .get<RequestResponse<Inventario>>(this.url , {
        params: {
          page: page.toString(),
          size: size.toString(),
        },
      })
      .subscribe((data) => {
        this.listInventario = data;
        this.isLoading = false;
      });
  }
}
