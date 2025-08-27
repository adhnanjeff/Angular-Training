import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appFadeInScroll]',
  standalone: true
})
export class FadeInScrollDirective implements OnInit {
  @Input() delay: number = 0;
  private element: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    // Set initial state
    this.renderer.setStyle(this.element, 'opacity', '0');
    this.renderer.setStyle(this.element, 'transform', 'translateY(30px)');
    this.renderer.setStyle(this.element, 'transition', `opacity 0.6s ease ${this.delay}ms, transform 0.6s ease ${this.delay}ms`);

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.setStyle(this.element, 'opacity', '1');
          this.renderer.setStyle(this.element, 'transform', 'translateY(0)');
          observer.unobserve(this.element); // Stop observing once animated
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(this.element);
  }
}
