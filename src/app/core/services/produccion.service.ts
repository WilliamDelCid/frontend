import { Injectable } from '@angular/core';
import { RequestResponse } from '../models/IRequest';
import { Inventario, TipoProducto, Unidad } from '../../pages/interfaces/inventario.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormGroup } from '@angular/forms';
import { Cliente, Orden } from '../../pages/interfaces/ordenes.interface';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  private url = environment.urlAPI + 'ordenes';
  private urlCliente = environment.urlAPI + 'clientes';
  private urlTipoProducto = environment.urlAPI + 'tipos-producto';
  private urlInventario = environment.urlAPI + 'inventarios';

  isLoading = false;

  listOrdenes: RequestResponse<Orden> = {
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

  listClientes: Cliente[] = [];
  listTipoProducto: TipoProducto[] = [];
  listInventario:Inventario[]=[];
  listInventarioAll:Inventario[]=[];
  constructor(private inventarioService: HttpClient) {}

  getPages(page: number = 0, size: number = 10,nombreProducto: string = '') {
    this.isLoading = true;
    // nombreProducto: nombreProducto
    return this.inventarioService
      .get<RequestResponse<Orden>>(this.url + '/listar', {
        params: {
          page: page.toString(),
          size: size.toString(),
        },
      })
      .subscribe((data) => {
        this.listOrdenes = data;
        this.isLoading = false;
      });
  }

  getClientes() {
    return this.inventarioService.get<Cliente[]>(`${this.urlCliente}`).subscribe((resp) => {
      this.listClientes = resp;
    });
  }

  getTipoProducto() {
    return this.inventarioService.get<TipoProducto[]>(`${this.urlTipoProducto}`).subscribe((resp) => {
      this.listTipoProducto = resp;
    });
  }

  crear(inventario: FormGroup) {
    return this.inventarioService.post(`${this.url}/crear`, inventario);
  }

  getInventario(idTipo:any) {
    return this.inventarioService.get<Inventario[]>(`${this.urlInventario}/tipo/${idTipo}`).subscribe((resp) => {
      this.listInventario = resp;
    });
  }

  getPagesInventario() {
    return this.inventarioService.get<Inventario[]>(`${this.urlInventario}/all`).subscribe((resp) => {
      this.listInventarioAll = resp;
    });
  }

}

