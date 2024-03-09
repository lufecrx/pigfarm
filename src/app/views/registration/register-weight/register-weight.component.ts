import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IPig } from '../../../model/pig/pig.interface';
import { RestService } from 'src/app/services/rest/rest.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationFormsService } from 'src/app/services/validation/validation-forms.service';

@Component({
  selector: 'app-register-weight',
  templateUrl: './register-weight.component.html',
  styleUrl: './register-weight.component.scss',
})
export class RegisterWeightComponent implements OnInit, AfterViewInit {
  pigs: IPig[] = [];
  filteredPigs: IPig[] = [];
  currentPage: number = 1;
  pageSize: number = 10; // Número de itens por página
  totalItems: number = 0; // Total de itens


  formAddWeight!: FormGroup;
  formErrors: any;
  modalSubmitted = false;

  modalVisible: boolean = false;
  pigRef: string = '';

  constructor(
    private restService: RestService,
    private router: Router,
    private formBuilder: FormBuilder,
    private validation: ValidationFormsService,
  ) {}

  ngOnInit(): void {
    this.getPigs();
    this.formAddWeight = this.formBuilder.group({
      weight: [
        '',
        [
          Validators.required,
          // Apenas números em Kg
          Validators.pattern(this.validation.formRules.weightPattern),
        ],
      ],
      date: ['',
        [
          Validators.required,
          Validators.pattern(
            this.validation.formRules.datePattern
          )
        ],
      ],
    });
  }

  ngAfterViewInit(): void {
    this.filteredPigs = this.pigs;
  }

  // Variables to hold filter values
  identifierFilter: string = '';
  genderFilter: string = '';
  statusFilter: string = '';

  // Function to apply filters
  applyFilters() {
    this.filteredPigs = this.pigs.filter(
      (pig) =>
        pig.identifier.includes(this.identifierFilter) &&
        (this.genderFilter === '' || pig.gender === this.genderFilter) &&
        (this.statusFilter === '' || pig.status === this.statusFilter)
    );
  }

  getPigs(): void {
    this.restService
      .getItemsPaginated(this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.pigs = response;
        this.totalItems = response.length;
        this.filteredPigs = this.pigs;
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

  addWeightMode(pig: IPig): void {
    if (pig.key) {
      this.pigRef = pig.key;
    }
    this.toggleModal();
  }

  addWeight(): void {
    this.modalSubmitted = true;
    if (this.pigRef) {
      this.restService.addWeightToPig(this.pigRef, this.formAddWeight.value);
      this.getPigs();
      this.toggleModal();
      this.pigRef = '';
    }
  }

  cancelAdd(): void {
    this.toggleModal();
    this.pigRef = '';
  }
}
