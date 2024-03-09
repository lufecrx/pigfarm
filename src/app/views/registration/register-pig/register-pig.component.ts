import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from '../../../services/rest/rest.service';
import { ValidationFormsService } from '../../../services/validation/validation-forms.service';

@Component({
  selector: 'app-register-pig',
  templateUrl: './register-pig.component.html',
  styleUrl: './register-pig.component.scss',
})
export class RegisterPigComponent implements OnInit {
  formPig!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];

  constructor(
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private validationService: ValidationFormsService,
    private restService: RestService,
    )
  {
    this.formErrors = this.validationService.errorMessages;
  }

  ngOnInit(): void {
    this.formPig = this.formBuilder.group({
      identifier: [
          '',
          [
            Validators.required,
            Validators.pattern(
              this.validationService.formRules.identifierPattern
            ),
          ],
      ],
      father_id: [
          '',
          [
            Validators.required,
            Validators.pattern(
              this.validationService.formRules.identifierPattern
            ),
          ],
      ],
      mother_id: [
          '',
          [
            Validators.required,
            Validators.pattern(
              this.validationService.formRules.identifierPattern
            ),
          ],
      ],
      date_birth: [
          '',
          [
            Validators.required,
            Validators.pattern(this.validationService.formRules.datePattern),
          ],
      ],
      date_exit: [
          '',
          [
            Validators.required,
            Validators.pattern(this.validationService.formRules.datePattern),
          ],
      ],
      status: [
          '',
          [
            Validators.required,
          ],
        ],
      gender:
        [
          '',
          [
            Validators.required,
          ],
        ],
    });
    this.formControls = Object.keys(this.formPig.controls);
  }

  async onSubmit() {
    if (this.formPig.valid) {
      try {
        const newTreatment = this.formPig.value;
        await this.restService.addItem(newTreatment);
        // this.router.navigate(['/list-pigs']);
      } catch (error : any) {
        console.error('Erro ao enviar o formulário:', error);
      }
    } else {
      console.log('Formulário inválido');
    }
  }
}
