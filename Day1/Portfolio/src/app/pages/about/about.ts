import { Component, AfterViewInit } from '@angular/core';
import { TiltDirective } from '../../tilt.directive';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  imports: [TiltDirective],
  standalone: true
})
export class AboutComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }
}
