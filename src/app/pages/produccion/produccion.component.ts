import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProduccionService } from '../../core/services/produccion.service';
import { DetalleMateriaPrimaDto } from '../interfaces/detalleMateria.interface';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FechaFormatoPipe } from '../../shared/pipes/fecha-formato.pipe';
import Swal from 'sweetalert2';

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
    FechaFormatoPipe
  ],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.scss'
})
export class ProduccionComponent {
  currentPage = DEFAULT_PAGE_NUMBER;
  modalRef: NgbModalRef | undefined;
  formularioGeneral!: FormGroup;
  formularioFinalizar!: FormGroup;
  nombreCliente: string = '';
  mostrarCombo: boolean = false;
  mostrarCantidad:boolean = false;
  cantidadExistente!:number;
  estado!: number;
  fechaEsperada!: string;
  detallesMateriaPrima: DetalleMateriaPrimaDto[] = [];
  idOrden!:number;
  loading = false;
  constructor(
    private produccionService: ProduccionService,
    private modalService: NgbModal,
    private fb: FormBuilder, private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.produccionService.getPages();
    this.produccionService.getOrdenes();
    this.iniciarFormularioGeneral();
    this.iniciarFormularioFinalizar();
  }

  iniciarFormularioGeneral() {
    this.formularioGeneral = this.fb.group({
      idOrdenPedido: ["", [Validators.required]],
      fechaIngreso: ["", [Validators.required]],
      lineaProduccion: ["", [Validators.required]],
    });

  }

  iniciarFormularioFinalizar() {
    this.formularioFinalizar = this.fb.group({
      fechaFinalizacion: ["", [Validators.required]],
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

  get ordenes() {
    return this.produccionService.listOrdenes;
  }


  openModal(content: TemplateRef<unknown>, idOrden: number = 0) {
    this.formularioGeneral.reset();
    this.formularioFinalizar.reset();
    if (idOrden) {
      this.idOrden = idOrden;
    }
      this.modalService.open(content, {
        size: 'xl',
      });
  }


  guardar() {
    if (this.formularioGeneral.valid) {
      this.loading = true;
      this.produccionService.crear(this.formularioGeneral.value).subscribe({
        next: () => {
          this.produccionService.getPages();
          this.modalService.dismissAll();
          this.currentPage = DEFAULT_PAGE_NUMBER;
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'La producción ha sido creada con éxito',
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (error: any) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: 'No se pudo guardar la producción '+ error.error.mensaje,
            timer: 3000,
            timerProgressBar: true
          });
          console.log(error);
        },
      });
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

  guardarFinalizacion() {
    if (this.formularioFinalizar.valid) {
      this.produccionService.finalizar(this.idOrden, this.formularioFinalizar.value).subscribe({
        next: () => {
          this.produccionService.getPages();
          this.modalService.dismissAll();
          this.currentPage = DEFAULT_PAGE_NUMBER;
          Swal.fire({
            icon: 'success',
            title: 'Finalizado',
            text: 'La producción ha sido finalizada con éxito',
            timer: 3000,
            timerProgressBar: true
          });
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al finalizar',
            text: 'No se pudo finalizar la producción',
            timer: 3000,
            timerProgressBar: true
          });
          console.log(error);
        },
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Información incompleta',
        text: 'Por favor complete todos los campos requeridos',
        timer: 3000,
        timerProgressBar: true
      });
    }
    return Object.values(this.formularioFinalizar.controls).forEach((control) =>
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


  buscar() {
    this.produccionService.getPages(0, 10, this.nombreCliente);
  }

  pdfSrc: SafeUrl | null = null;


  generarPDF() {
    this.produccionService.pdf(this.estado, this.fechaEsperada).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }


}
