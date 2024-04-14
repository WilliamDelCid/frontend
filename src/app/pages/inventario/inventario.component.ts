import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  NgbModal,
  NgbModalRef,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { InventarioService } from '../../core/services/inventario.service';
import { Inventario } from '../interfaces/inventario.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const DEFAULT_PAGE_NUMBER = 1;
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.scss',
})
export class InventarioComponent implements OnInit {
  currentPage = DEFAULT_PAGE_NUMBER;
  modalRef: NgbModalRef | undefined;
  formularioGeneral!: FormGroup;
  editar: boolean = false;
  nombreProducto: string = '';
  constructor(
    private inventarioService: InventarioService,
    private modalService: NgbModal,
    private fb: FormBuilder, private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.inventarioService.getPages();
    this.inventarioService.getUnidad();
    this.inventarioService.getTipoProducto();
    this.formularioGeneral = this.iniciarFormularioGeneral();
  }

  iniciarFormularioGeneral() {
    return this.fb.group({
      id: [''],
      nombreProducto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      producto: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      cantidadProducto: ['', [Validators.required, this.noNegativoValidator()]],
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

  get unidades() {
    return this.inventarioService.listUnidad;
  }

  get TipoProductos() {
    return this.inventarioService.listTipoProducto;
  }

  openModal(content: TemplateRef<unknown>, idInventario: number = 0) {
    this.formularioGeneral.reset();
    if (idInventario) {
      Swal.fire({
        text: 'Por favor, espere un momento...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        returnFocus: false,
      });

      this.inventarioService.buscar(idInventario).subscribe((resp) => {
        this.llenarFormulario(resp);
        this.editar = true;
        Swal.close();
        this.modalService.open(content, {
          size: 'lg',
          centered: true,
        });
      });
    } else {
      this.editar = false;
      this.modalService.open(content, {
        size: 'lg',
        centered: true,
      });
    }
  }

  guardar() {
    if (this.formularioGeneral.valid) {
      if (this.formularioGeneral.value.id) {
        this.inventarioService
          .actualizar(
            this.formularioGeneral.value.id,
            this.formularioGeneral.value
          )
          .subscribe({
            next: () => {
              this.inventarioService.getPages();
              this.modalService.dismissAll();
              this.editar = false;
              this.currentPage = DEFAULT_PAGE_NUMBER;
            },
            error: (error: any) => {
              console.log(error);
            },
          });
      } else {
        this.inventarioService.crear(this.formularioGeneral.value).subscribe({
          next: () => {
            this.inventarioService.getPages();
            this.modalService.dismissAll();
            this.editar = false;
            this.currentPage = DEFAULT_PAGE_NUMBER;
          },
          error: (error: any) => {
            console.log(error);
          },
        });
      }
    }
    return Object.values(this.formularioGeneral.controls).forEach((control) =>
      control.markAsTouched()
    );
  }

  close() {
    this.modalService.dismissAll();
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
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.eliminar(idInventario).subscribe({
          next: () => {
            this.inventarioService.getPages();
            this.currentPage = DEFAULT_PAGE_NUMBER;
            Swal.fire({
              title: "Inventario Eliminado",
              text: "Inventario Eliminado con exito",
              icon: "success"
            });
          },
          error: (error) => {
            Swal.fire({
              title: "Ocurrio un error al eliminar el inventario",
              text: error.error.mensaje,
              icon: "error"
            });
          },
        })
      }
    });
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formularioGeneral.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid'
      : validarCampo?.touched
      ? 'is-valid'
      : '';
  }

  llenarFormulario(resp: Inventario): void {
    const productoValue = resp.producto ? 'true' : 'false';
    this.formularioGeneral.setValue({
      id: resp.id,
      nombreProducto: resp.nombreProducto,
      descripcion: resp.descripcion,
      producto: productoValue,
      unidad: resp.unidad.id,
      cantidadProducto: resp.cantidadProducto,
      tipoProducto: resp.tipoProducto.id,
    });
  }

  noNegativoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cantidad = control.value;
      if (cantidad < 0) {
        return { negativo: true };
      }
      return null;
    };
  }

  buscar() {
    this.inventarioService.getPages(0, 10, this.nombreProducto);
  }
  pdfSrc: SafeUrl | null = null;


  cargarOpcionesSegundoCombo(event: any) {
    this.inventarioService.pdf(event).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

}
