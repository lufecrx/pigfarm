import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPig } from '../../../model/pig/pig.interface';
import { RestService } from 'src/app/services/rest/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationFormsService } from 'src/app/services/validation/validation-forms.service';

export interface IWeight {
  weight: string;
  date: string;
}

@Component({
  selector: 'app-weight-control',
  templateUrl: './weight-control.component.html',
  styleUrls: ['./weight-control.component.scss']
})
export class WeightControlComponent implements OnInit, AfterViewInit {
  wh!: IWeight;
  pigRef: string = '';
  weightHistory: any[] = [];
  filteredWeightHistory: any[] = [];

  modalVisible: boolean = false;
  formEditWeight!: FormGroup;
  formErrors: any;
  weightSubmitted: boolean = false;
  modalSubmitted: boolean = false;

  constructor(
    private restService: RestService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private validation: ValidationFormsService
  ) { }

  ngOnInit(): void {
    this.pigRef = this.activatedRoute.snapshot.queryParams['pigRef'];
    this.getWeightHistory(this.pigRef);
    this.formEditWeight = this.formBuilder.group({
      weight: [
        '',
        [
          Validators.required,
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
    this.filteredWeightHistory = this.weightHistory;
  }

  // Variables to hold filter values
  dateFilter: string = '';
  weightFilter: string = '';

  // Function to apply filters
  applyFilters() {
    this.filteredWeightHistory = this.weightHistory.filter(
      (weight) =>
        (this.dateFilter === '' || weight.date === this.dateFilter) &&
        (this.weightFilter === '' || weight.weight.includes(this.weightFilter))
    );
  }

  getWeightHistory(pigId: string): void {
    this.restService.getItem(pigId).subscribe((pig: IPig) => {
      this.weightHistory = Object.values(pig.weightHistory);
    });
  }

  editWeight(wh: IWeight): void {
    this.wh = wh;
    this.modalVisible = true;
  }

  toggleModal(): void {
    this.modalVisible = !this.modalVisible;
  }

  handleModalChange(event: any) {
    this.modalVisible = event;
  }

  confirmEdit(): void {
    this.modalSubmitted = true;

    if (this.pigRef && this.formEditWeight.valid) {
      const updatedWeight: IWeight = {
        date: this.formEditWeight.get('date')?.value,
        weight: this.formEditWeight.get('weight')?.value
      };

      // Encontrar o índice do peso a ser editado
      const index = this.weightHistory.findIndex(wh => wh.date === this.wh.date && wh.weight === this.wh.weight);

      if (index !== -1) {
        // Atualizar o peso no array weightHistory
        this.weightHistory[index] = updatedWeight;

        // Enviar a atualização para o serviço
        this.restService.updateWeightHistory(this.pigRef, this.weightHistory)
          .then(() => {
            this.toggleModal();
          })
          .catch(error => {
            console.error('Error updating weight history:', error);
          });
      } else {
        console.error('Weight not found in the weight history array.');
      }
    }
  }

  cancelEdit(): void {
    this.toggleModal();
  }
}
