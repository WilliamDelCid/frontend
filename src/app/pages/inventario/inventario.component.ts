import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InventarioService } from '../../core/services/inventario.service';
import Swal from 'sweetalert2';

const DEFAULT_PAGE_NUMBER = 1;
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [NgbPaginationModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
})
export class InventarioComponent implements OnInit {
  currentPage = DEFAULT_PAGE_NUMBER;
  modalRef: NgbModalRef | undefined;
  formularioGeneral!: FormGroup;
  editar: boolean = false;

  constructor(
    private inventarioService: InventarioService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inventarioService.getPages();
    this.formularioGeneral = this.iniciarFormularioGeneral();
  }

  iniciarFormularioGeneral() {
    return this.fb.group({
      id: [''],
      nombreProducto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      cantidadProducto: ['', [Validators.required]],
      estadoProducto: ['', [Validators.required]],
      tipoProducto: ['', [Validators.required]],
    });
  }

  pageChange(page: number) {
    this.inventarioService.getPages(page - 1);
  }

  get isLoading() {
    return this.inventarioService.isLoading;
  }

  get inventarios() {
    return this.inventarioService.listInventario;
  }


  openModal(content: TemplateRef<unknown>, idInventario: number = 0) {
    this.formularioGeneral.reset();

    if (idInventario) {
      this.editar = true;
      this.modalService.open(content, {
        size: 'lg',
        centered: true,
      });
    } else {
      this.editar = false;
      this.modalService.open(content, {
        size: 'lg',
        centered: true,
      });
    }
  }

  eliminar(idInventario: number) {
    Swal.fire({
        title: 'Aviso',
        text: '¿Eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

        }
    });
}


}
