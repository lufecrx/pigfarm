import { Component, OnInit } from '@angular/core';
import { IPig } from '../../../model/pig/pig.interface';
import { RestService } from 'src/app/services/rest/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-pigs',
  templateUrl: './list-pigs.component.html',
  styleUrls: ['./list-pigs.component.scss'],
})
export class ListPigsComponent implements OnInit {
  pigs: IPig[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Número de itens por página
  totalItems: number = 0; // Total de itens

  modalVisible: boolean = false;

  pigRef: string = '';

  constructor(private restService: RestService, private router: Router) {}

  ngOnInit(): void {
    this.getPigs();
  }

  getPigs(): void {
    this.restService
      .getItemsPaginated(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.pigs = response;
        this.totalItems = response.length;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getPigs();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  toggleModal(): void {
    this.modalVisible = !this.modalVisible;
  }

  handleModalChange(event: any) {
    this.modalVisible = event;
  }

  editMode(pig: IPig): void {
    this.router.navigate(['/manager/edit-pig'], {
      queryParams: { pigRef: pig.key },
    });
  }

  deleteMode(pig: IPig): void {
    if (pig.key) {
      this.pigRef = pig.key;
    }
    this.toggleModal();
  }

  deletePig(): void {
    if (this.pigRef) {
      this.restService.deleteItem(this.pigRef);
      this.getPigs();
      this.toggleModal();
      this.pigRef = '';
    }
  }

  cancelDelete(): void {
    this.toggleModal();
    this.pigRef = '';
  }
}
