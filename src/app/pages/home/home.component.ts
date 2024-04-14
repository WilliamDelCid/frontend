import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../core/services/inventario.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const DEFAULT_PAGE_NUMBER = 1;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  currentPage = DEFAULT_PAGE_NUMBER;

  constructor(private inventarioService: InventarioService){


  }
  ngOnInit(): void {
    this.inventarioService.getPages();

  }

  get inventarios() {
    return this.inventarioService.listInventario;
  }

  pageChange(page: number) {
    this.inventarioService.getPages(page - 1);
  }

}
