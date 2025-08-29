import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { TiltDirective } from '../../tilt.directive';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [TiltDirective],
  standalone: true
})
export class HomeComponent implements OnInit, OnDestroy {
  show = signal(false);
  currentRoleIndex = signal(0);
  isChanging = signal(false);
  roles = ['SWE Intern', 'Backend Developer', 'Student'];
  private intervalId: any;

  ngOnInit() {
    setTimeout(() => {
      this.show.set(true);
    }, 10);

    // Start the role rotation
    this.intervalId = setInterval(() => {
      this.changeRole();
    }, 2000); // Change every 2 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  changeRole() {
    this.isChanging.set(true);
    
    // Change the role after a short delay
    setTimeout(() => {
      this.currentRoleIndex.update(current => (current + 1) % this.roles.length);
    }, 300); // Half of the animation duration
    
    // Remove the changing class after animation completes
    setTimeout(() => {
      this.isChanging.set(false);
    }, 600); // Full animation duration
  }

  get currentRole(): string {
    return this.roles[this.currentRoleIndex()];
  }
}
