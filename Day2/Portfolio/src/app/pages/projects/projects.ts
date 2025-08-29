import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInDirective } from '../../../fade-in.directive';
import { TiltDirective } from '../../tilt.directive';
import { FadeInScrollDirective } from '../../fade-in-scroll.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TiltDirective, FadeInScrollDirective],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit {

  ngOnInit() {
    console.log('Projects component loaded');
  }
}
