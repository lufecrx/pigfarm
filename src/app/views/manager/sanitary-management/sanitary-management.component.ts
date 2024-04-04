import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SanitaryActivity } from '../../../model/activity/sanitary-activity.interface';
import { ActivitiesRestService } from 'src/app/services/rest/activities-rest.service';
import { ValidationFormsService } from 'src/app/services/validation/validation-forms.service';
import { IPig } from 'src/app/model/pig/pig.interface';
import { PigRestService } from 'src/app/services/rest/pig-rest.service';

export interface ISanitaryActivity {
  activity: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-sanitary-management',
  templateUrl: './sanitary-management.component.html',
  styleUrls: ['./sanitary-management.component.scss'],
})
export class SanitaryManagementComponent implements OnInit {
  pigsData: IPig[] = [];
  sanitaryActivities: SanitaryActivity[] = [];
  filteredActivities: any[] = [];

  formEditActivity!: FormGroup;
  formAddActivity!: FormGroup;
  formErrors: any;

  activityRef!: ISanitaryActivity;
  activityHistory: ISanitaryActivity[] = [];

  loading: boolean = false;

  avatar: string = './assets/img/avatars/pig.png';

  constructor(
    private activitiesRest: ActivitiesRestService,
    private pigsRest: PigRestService,
    private formBuilder: FormBuilder,
    private validation: ValidationFormsService
  ) {}

  ngOnInit(): void {
    this.getActivities();
    this.getPigs();
    this.formEditActivity = this.formBuilder.group({
      activity: ['', [Validators.required]],
      otherActivity: [''],
      date: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validation.formRules.datePattern),
        ],
      ],
      pigs: new FormControl(null, Validators.required),
      description: [''],
    });

    this.formAddActivity = this.formBuilder.group({
      activity: ['', [Validators.required]],
      otherActivity: [''],
      date: [
        '',
        [
          Validators.required,
          Validators.pattern(this.validation.formRules.datePattern),
        ],
      ],
      pigs: new FormControl(null, Validators.required),
      description: [''],
    });
  }

  onAddActivityChange(value: string) {
    if (value === 'Other') {
      this.formAddActivity.controls['otherActivity'].setValidators([Validators.required]);
    } else {
      this.formAddActivity.controls['otherActivity'].clearValidators();
    }
    this.formAddActivity.controls['otherActivity'].updateValueAndValidity();
  }

  onEditActivityChange(value: string) {
    if (value === 'Other') {
      this.formEditActivity.controls['otherActivity'].setValidators([Validators.required]);
    } else {
      this.formEditActivity.controls['otherActivity'].clearValidators();
    }
    this.formEditActivity.controls['otherActivity'].updateValueAndValidity();
  }

  // Variables to hold filter values
  pigFilter: string = '';
  activityFilter: string = '';
  dateFilter: string = '';

  // Function to apply filters
  applyFilters() {
    this.filteredActivities = this.sanitaryActivities.filter(
      (activity) =>
        (this.dateFilter === '' || activity.date === this.dateFilter) &&
        (this.activityFilter === '' ||
          activity.activity === this.activityFilter) &&
        (this.pigFilter === '' || activity.pigs.some(pig => pig.identifier === this.pigFilter))
    );
  }

  getActivities(): void {
    this.loading = true;

    this.activitiesRest
      .getActivities()
      .subscribe((data: SanitaryActivity[]) => {
        this.sanitaryActivities = data;
        // Order activities by date in descending order
        this.sanitaryActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredActivities = this.sanitaryActivities;
        this.loading = false;
      });
  }

  getPigs() {
    this.pigsRest.getPigs().subscribe((response) => {
      this.pigsData = response;
    });
  }

  // Functions to control modal for add activities
  addActivityModal: boolean = false;
  addActivitySubmit: boolean = false;

  addActivityMode() {
    this.addActivitySubmit = false;
    this.toggleAddActivity();
  }

  handleAddMode(event: any) {
    this.addActivityModal = event;
  }

  toggleAddActivity() {
    this.addActivityModal = !this.addActivityModal;
  }

  cancelAddActivity() {
    this.toggleAddActivity();
  }

  confirmAdd() {
    if (this.formAddActivity.controls['activity'].value === 'Other') {
      this.formAddActivity.controls['activity'].setValue(this.formAddActivity.controls['otherActivity'].value);
    }

    this.addActivitySubmit = true;
    if (this.formAddActivity.valid) {
      this.activitiesRest.addActivity(this.formAddActivity.value);

      // Add activity for all pigs from session
      const pigs = this.formAddActivity.controls['pigs'].value;
      pigs.forEach((pig: IPig) => {
        const pigRef = pig.key || ''; // Ensure pigRef is always a string
        this.pigsRest.addActivityToPig(pigRef, this.formAddActivity.value);
      });

      this.getActivities();
      this.toggleAddActivity();
      this.formAddActivity.reset();
    }
  }

  // Functions to control modal for view informations of activities
  viewActivityModal: boolean = false;
  viewActivityData: SanitaryActivity = {
    activity: '',
    date: '',
    pigs: [],
    description: '',
  };

  viewActivityMode(activity: SanitaryActivity) {
    this.viewActivityData = activity;
    this.toggleViewActivity();
  }

  handleViewMode(event: any) {
    this.viewActivityModal = event;
  }

  toggleViewActivity() {
    this.viewActivityModal = !this.viewActivityModal;
  }

  cancelViewActivity() {
    this.toggleViewActivity();
  }

  // Functions to control modal for edit a activity
  editActivityModal: boolean = false;
  editActivitySubmit: boolean = false;
  editActivityData!: SanitaryActivity;

  editActivityMode(activity: SanitaryActivity) {
    this.toggleEditActivity();
    this.editActivityData = activity;
    this.editActivitySubmit = false;
  }

  handleEditMode(event: any) {
    this.editActivityModal = event;
  }

  toggleEditActivity() {
    this.editActivityModal = !this.editActivityModal;
  }

  cancelEditActivity() {
    this.toggleEditActivity();
  }

  confirmEdit() {
    this.editActivitySubmit = true;

    if (this.formEditActivity.controls['activity'].value === 'Other') {
      this.formEditActivity.controls['activity'].setValue(this.formEditActivity.controls['otherActivity'].value);
    }

    if (this.formEditActivity.valid) {
      const key = this.editActivityData.key;
      const value = this.formEditActivity.value;

      if (key !== undefined) {
        this.activitiesRest.updateActivity(key, value);

        // Update activity for all pigs from session
        const pigs = this.formEditActivity.controls['pigs'].value;
        pigs.forEach((pig: IPig) => {
          const pigRef = pig.key || ''; // Ensure pigRef is always a string
          this.pigsRest.updateActivityHistory(pigRef, key);
        });

        this.getActivities();
        this.toggleEditActivity();
      }
    }
  }

  // Functions to control modal for delete a activity
  deleteActivityModal: boolean = false;
  deleteActivityData!: SanitaryActivity;

  deleteActivityMode(activity: SanitaryActivity) {
    this.toggleDeleteActivity();
    this.deleteActivityData = activity;
    this.activityRef = activity;
  }

  handleDeleteMode(event: any) {
    this.deleteActivityModal = event;
  }

  toggleDeleteActivity() {
    this.deleteActivityModal = !this.deleteActivityModal;
  }

  cancelDeleteActivity() {
    this.toggleDeleteActivity();
  }

  confirmDelete() {
    const activityKey = this.deleteActivityData.key;
    if (activityKey !== undefined) {
      this.activitiesRest.deleteActivity(activityKey);

      // Delete activity for all pigs from session
      const pigs = this.deleteActivityData.pigs;
      pigs.forEach((pig: IPig) => {
        const pigRef = pig.key || ''; // Ensure pigRef is always a string

        if (pigRef && this.activityRef) {
          // Find the index of the activity to delete
          const index = pig.activityHistory.findIndex(
            (activity) => activity === this.activityRef
          );

          if (index !== -1) {
            // Remove the activity from the activityHistory array
            pig.activityHistory.splice(index, 1);
          }

          // Update the activity history of the pig
          this.pigsRest
            .updateActivityHistory(pigRef, pig.activityHistory)
            .then(() => {
              this.toggleDeleteActivity();
              this.getActivities();
            })
            .catch((error) => {
              console.error('Error updating activity history:', error);
            });          
        } else {
          console.error('Activities or pigs not found.');
        } 
      });
    }
  }
}
