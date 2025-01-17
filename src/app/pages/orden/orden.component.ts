import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrdenService } from '../../core/services/orden.service';
import { DetalleMateriaPrimaDto } from '../interfaces/detalleMateria.interface';
import Swal from 'sweetalert2';
import { FechaFormatoPipe } from '../../shared/pipes/fecha-formato.pipe';

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
    FechaFormatoPipe
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
  mostrarCantidad:boolean = false;
  cantidadExistente!:number;

  detallesMateriaPrima: DetalleMateriaPrimaDto[] = [];

  constructor(
    private ordenService: OrdenService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ordenService.getPages();
    this.ordenService.getClientes();
    this.ordenService.getTipoProducto();
    this.iniciarFormularioGeneral();
  }

  iniciarFormularioGeneral() {
    this.formularioGeneral = this.fb.group({
      idCliente: ["", [Validators.required]],
      fechaEsperada: ["", [Validators.required]],
      cantidad: ["", [Validators.required, Validators.min(1)]],
      idInventario: ["", [Validators.required]],
      tipoProducto:[""],
      idInventarioCombo:[""],
      nombreCombo:[""],
      cantidadInventario:[""],
      cantidadUsar:[""],
      detallesMateriaPrima: [[]]
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
    this.ordenService.getPagesInventario();
      this.modalService.open(content, {
        size: 'xl',
      });
  }


  guardar() {
    if (this.formularioGeneral.valid) {
      if (this.detallesMateriaPrima.length > 0) {
        this.formularioGeneral.patchValue({
          detallesMateriaPrima: this.detallesMateriaPrima
        });
        this.ordenService.crear(this.formularioGeneral.value).subscribe({
          next: () => {
            this.ordenService.getPages();
            this.modalService.dismissAll();
            this.currentPage = DEFAULT_PAGE_NUMBER;
            Swal.fire({
              icon: 'success',
              title: 'Guardado',
              text: 'La orden ha sido creada con éxito',
              timer: 3000,
              timerProgressBar: true
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al guardar',
              text: 'No se pudo guardar la orden '+ error.error.mensaje,
              timer: 3000,
              timerProgressBar: true
            });
            console.log(error);
          },
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Falta información',
          text: 'Debe agregar al menos un detalle a la materia prima',
          timer: 3000,
          timerProgressBar: true
        });
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Información incompleta',
        text: 'Por favor complete todos los campos requeridos',
        timer: 3000,
        timerProgressBar: true
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

  get inventariosPage(){
    return this.ordenService.listInventarioAll;
  }

  cargarCantidad(event: any) {
    const idInventarioSeleccionado = event;
    const inventarioSeleccionado = this.inventariosPage.find(inventario => inventario.id === idInventarioSeleccionado);
    if (inventarioSeleccionado) {
      this.mostrarCantidad = true;
      this.cantidadExistente = inventarioSeleccionado.cantidadProducto;
      this.formularioGeneral.patchValue({
        cantidadInventario: this.cantidadExistente,
        nombreCombo: inventarioSeleccionado.nombreProducto
      });
    }
  }

  agregarDetalle() {
    const idInventario = this.formularioGeneral.value.idInventarioCombo;
    const cantidadInventario = this.formularioGeneral.value.cantidadInventario;
    const nombreCombo = this.formularioGeneral.value.nombreCombo;
    const cantidadUsar = this.formularioGeneral.value.cantidadUsar;
    if (isNaN(cantidadUsar)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad a usar debe ser un número válido'
      });
      return;
    }
    if (!cantidadUsar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad a usar no puede estar vacía'
      });
      return;
    }
    if (cantidadUsar > cantidadInventario) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad a usar excede la cantidad disponible'
      });
      return;
    }
    if (cantidadUsar === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad a usar no puede ser 0'
      });
      return;
    }


    const detalle: DetalleMateriaPrimaDto = {
      idInventario: idInventario,
      nombre: nombreCombo,
      cantidad: cantidadUsar
    };
    this.detallesMateriaPrima.push(detalle);
    console.log(this.detallesMateriaPrima);

    // Eliminar el inventario seleccionado de la lista
    const index = this.inventariosPage.findIndex(inventario => inventario.id === idInventario);
    if (index !== -1) {
      this.inventariosPage.splice(index, 1);
    }

    // Limpiar los campos del formulario
    this.formularioGeneral.patchValue({
      idInventarioCombo: "",
      cantidadInventario: "",
      cantidadUsar: ""
    });
    this.mostrarCantidad = false;
  }



}
