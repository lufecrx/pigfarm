import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWeightComponent } from './register-weight.component';

describe('RegisterWeightComponent', () => {
  let component: RegisterWeightComponent;
  let fixture: ComponentFixture<RegisterWeightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWeightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
