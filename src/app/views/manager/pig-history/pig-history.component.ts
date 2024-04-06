import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SanitaryActivity } from 'src/app/model/activity/sanitary-activity.interface';
import { IWeight } from 'src/app/model/activity/weight.interface';
import { IPig } from 'src/app/model/pig/pig.interface';
import { ActivitiesRestService } from 'src/app/services/rest/activities-rest.service';
import { PigRestService } from 'src/app/services/rest/pig-rest.service';

export interface IActivity {
  date: string;
  activity: string;
  weight?: string;
  description: string;
}

@Component({
  selector: 'app-pig-history',
  templateUrl: './pig-history.component.html',
  styleUrl: './pig-history.component.scss',
})
export class PigHistoryComponent implements OnInit {
  sanitaryActivities: SanitaryActivity[] = [];
  weightHistory: IWeight[] = [];
  activities: IActivity[] = [];
  pigSelected!: IPig;

  filteredActivities: IActivity[] = [];

  loading: boolean = false;

  avatar: string = './assets/img/avatars/pig.png';

  constructor(
    private pigsRestService: PigRestService,
    private activitiesRestService: ActivitiesRestService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get all activities for the pig and join them in a single sorted array
    const pigRef = this.activatedRoute.snapshot.queryParams['pigRef'];

    this.loading = true;

    this.loadData(pigRef);
  }

  loadData(pigRef: string) {
    this.pigsRestService.getPigByID(pigRef).subscribe((pig: IPig) => {
      this.pigSelected = pig;
      this.getSanitaryActivities();
      this.getWeightHistory();

      // Sort activities by date in descending order
      this.filteredActivities = this.activities.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      this.loading = false;
    });
  }

  getSanitaryActivities() {
    // Get all sanitary activities references for the pig
    if (this.pigSelected.activityHistory) {
      const activitiesKeys: { ref: string }[] = Object.values(
        this.pigSelected.activityHistory
      );

      // Get the sanitary activities for the pig using the references
      activitiesKeys.forEach((activity) => {
        this.activitiesRestService
          .getActivityByKey(activity.ref)
          .then((sanitaryActivity: SanitaryActivity) => {
            this.sanitaryActivities.push(sanitaryActivity);

            // Add the sanitary activity to the activities array
            this.activities.push({
              date: sanitaryActivity.date,
              activity: sanitaryActivity.activity,
              description: sanitaryActivity.description,
              weight: 'N/A',
            });
          });
      });
    } else {
      this.sanitaryActivities = []; // If there are no activities, set the array to empty
    }
  }

  getWeightHistory() {
    if (this.pigSelected.weightHistory) {
      this.weightHistory = Object.values(this.pigSelected.weightHistory);
    } else {
      this.weightHistory = [];
    }

    // Add weight activities to the activities array
    this.weightHistory.forEach((weight) => {
      this.activities.push({
        date: weight.date,
        activity: 'Weighing',
        weight: weight.weight,
        description: '',
      });
    });
  }

  // Variables to hold filter values
  dateFilter: string = '';
  activityFilter: string = '';
  weightFilter: string = '';

  // Function to apply filters
  applyFilters() {
    this.filteredActivities = this.activities.filter(
      (activity) =>
        (this.dateFilter === '' || activity.date === this.dateFilter) &&
        (this.activityFilter === '' ||
          activity.activity.includes(this.activityFilter)) &&
        (this.weightFilter === '' ||
          (activity.weight ?? '').includes(this.weightFilter))
    );
  }
}
