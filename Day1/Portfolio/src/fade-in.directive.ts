import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Ensure element has base fade-in class (hidden initially)
    this.renderer.addClass(this.el.nativeElement, 'fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Reveal element when it enters the viewport
          this.renderer.addClass(this.el.nativeElement, 'visible');
          observer.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(this.el.nativeElement);
  }
}
