import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  @Input() tiltMax: number = 15;
  @Input() tiltScale: number = 1.05;

  private element: HTMLElement;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.element.style.transition = 'transform 0.1s ease';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    this.element.style.transition = 'transform 0.5s ease';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -this.tiltMax;
    const rotateY = (x - centerX) / centerX * this.tiltMax;
    
    this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${this.tiltScale})`;
  }
}
