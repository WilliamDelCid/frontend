import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
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
import { ProduccionService } from '../../core/services/produccion.service';
import { DetalleMateriaPrimaDto } from '../interfaces/detalleMateria.interface';

const DEFAULT_PAGE_NUMBER = 1;


@Component({
  selector: 'app-produccion',
  standalone: true,
  imports: [
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.scss'
})
export class ProduccionComponent {
  currentPage = DEFAULT_PAGE_NUMBER;
  modalRef: NgbModalRef | undefined;
  formularioGeneral!: FormGroup;
  nombreCliente: string = '';
  mostrarCombo: boolean = false;
  mostrarCantidad:boolean = false;
  cantidadExistente!:number;

  detallesMateriaPrima: DetalleMateriaPrimaDto[] = [];

  constructor(
    private produccionService: ProduccionService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.produccionService.getPages();
    this.produccionService.getClientes();
    this.produccionService.getTipoProducto();
    this.iniciarFormularioGeneral();
  }

  iniciarFormularioGeneral() {
    this.formularioGeneral = this.fb.group({
      idOrdenPedido: ["", [Validators.required]],
      fechaIngreso: ["", [Validators.required]],
      lineaProduccion: ["", [Validators.required]],
    });

  }

  pageChange(page: number) {
    this.produccionService.getPages(page - 1);
  }

  get isLoading() {
    return this.produccionService.isLoading;
  }

  get producciones() {
    return this.produccionService.listProduccion;
  }

  get clientes() {
    return this.produccionService.listClientes;
  }

  get TipoProductos() {
    return this.produccionService.listTipoProducto;
  }

  openModal(content: TemplateRef<unknown>, idInventario: number = 0) {
    this.formularioGeneral.reset();
    this.produccionService.getPagesInventario();
    this.produccionService.getPagesInventario();
      this.modalService.open(content, {
        size: 'xl',
      });
  }


  guardar() {
    if (this.formularioGeneral.valid) {
        this.produccionService.crear(this.formularioGeneral.value).subscribe({
          next: () => {
            this.produccionService.getPages();
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
    this.produccionService.getPages(0, 10, this.nombreCliente);
  }

  cargarOpcionesSegundoCombo(event: any) {
    this.formularioGeneral.get('idInventario')?.reset();
    const tipoProductoId = event;
    this.produccionService.getInventario(tipoProductoId);
    this.mostrarCombo = true;
    this.inventarios;
  }

  get inventarios() {
    return this.produccionService.listInventario;
  }

  get inventariosPage(){
    return this.produccionService.listInventarioAll;
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
    console.log(nombreCombo);

    const cantidadUsar = this.formularioGeneral.value.cantidadUsar;

    // Validar que la cantidad a usar no exceda la cantidad disponible
    if (cantidadUsar > cantidadInventario) {
      // Mostrar un mensaje de error o realizar otra acción
      console.log('La cantidad a usar excede la cantidad disponible');
      return; // Salir de la función sin agregar el detalle
    }

    // Agregar el detalle a la lista
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
