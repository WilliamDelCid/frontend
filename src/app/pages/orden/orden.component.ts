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
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrdenService } from '../../core/services/orden.service';

const DEFAULT_PAGE_NUMBER = 1;
@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './orden.component.html',
  styleUrl: './orden.component.scss',
})
export class OrdenComponent implements OnInit {
  currentPage = DEFAULT_PAGE_NUMBER;
  modalRef: NgbModalRef | undefined;
  formularioGeneral!: FormGroup;
  nombreCliente: string = '';
  mostrarCombo: boolean = false;
  constructor(
    private ordenService: OrdenService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ordenService.getPages();
    this.ordenService.getClientes();
    this.ordenService.getTipoProducto();
    this.formularioGeneral = this.iniciarFormularioGeneral();
  }

  iniciarFormularioGeneral() {
    return this.fb.group({
      idCliente: ["", [Validators.required]],
      fechaEsperada: ["", [Validators.required]],
      cantidad: ["", [Validators.required, this.noNegativoValidator()]],
      estado: ["", [Validators.required]],
      idInventario: ["", [Validators.required]],
      tipoProducto: ["", [Validators.required]],
    });
  }

  pageChange(page: number) {
    this.ordenService.getPages(page - 1);
  }

  get isLoading() {
    return this.ordenService.isLoading;
  }

  get ordenes() {
    return this.ordenService.listOrdenes;
  }

  get clientes() {
    return this.ordenService.listClientes;
  }

  get TipoProductos() {
    return this.ordenService.listTipoProducto;
  }

  openModal(content: TemplateRef<unknown>, idInventario: number = 0) {
    this.formularioGeneral.reset();
      this.modalService.open(content, {
        size: 'lg',
        centered: true,
      });
  }

  guardar() {
    if (this.formularioGeneral.valid) {
        this.ordenService.crear(this.formularioGeneral.value).subscribe({
          next: () => {
            this.ordenService.getPages();
            this.modalService.dismissAll();
            this.currentPage = DEFAULT_PAGE_NUMBER;
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    }
    return Object.values(this.formularioGeneral.controls).forEach((control) =>
      control.markAsTouched()
    );
  }

  close() {
    this.modalService.dismissAll();
  }

  esCampoValido(campo: string) {
    const validarCampo = this.formularioGeneral.get(campo);
    return !validarCampo?.valid && validarCampo?.touched
      ? 'is-invalid'
      : validarCampo?.touched
      ? 'is-valid'
      : '';
  }

  noNegativoValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cantidad = control.value;
      if (cantidad < 1) {
        return { negativo: true };
      }
      return null;
    };
  }

  buscar() {
    this.ordenService.getPages(0, 10, this.nombreCliente);
  }

  cargarOpcionesSegundoCombo(event: any) {
    this.formularioGeneral.get('idInventario')?.reset();
    const tipoProductoId = event;
    this.ordenService.getInventario(tipoProductoId);
    this.mostrarCombo = true;
    this.inventarios;
  }

  get inventarios() {
    return this.ordenService.listInventario;
  }

}
